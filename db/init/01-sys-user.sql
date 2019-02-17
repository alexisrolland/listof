/*Connect to database*/
\connect listof



/*Create table user*/
CREATE TABLE base.sys_user (
    id SERIAL PRIMARY KEY
  , email TEXT NOT NULL UNIQUE
  , password TEXT
  , role TEXT NOT NULL DEFAULT 'standard'
  , flag_active BOOLEAN DEFAULT TRUE
  , created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  , updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  , created_by_id INTEGER DEFAULT base.get_current_user_id()
  , updated_by_id INTEGER DEFAULT base.get_current_user_id()
);

COMMENT ON TABLE base.sys_user IS
'Users information.';



/*Create function to search users*/
CREATE OR REPLACE FUNCTION base.search_user(keyword TEXT)
RETURNS SETOF base.sys_user AS $$
    SELECT a.*
    FROM base.sys_user a
    WHERE a.email ILIKE ('%' || keyword || '%')
    ORDER BY a.email ASC
$$ language sql;

COMMENT ON FUNCTION base.search_user IS
'Function used to search users based on keywords contained in their email.';



/*Create function to hash password column*/
CREATE OR REPLACE FUNCTION base.hash_password()
RETURNS TRIGGER AS $$
BEGIN
    NEW.password = crypt(NEW.password, gen_salt('bf', 8));
    RETURN NEW;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.hash_password IS
'Function used to hash password when creating a user.';



/*Create function to authenticate users*/
CREATE OR REPLACE FUNCTION base.authenticate_user(user_email TEXT, user_password TEXT)
RETURNS base.sys_user AS $$
    SELECT a.*
    FROM base.sys_user a
    WHERE a.email = user_email
    AND a.password = crypt(user_password, a.password)
$$ language sql;

COMMENT ON FUNCTION base.authenticate_user IS
'Function used to authenticate users.';



/*Create default user*/
/*User is required to be able to create the default user group later*/
/*Must be created before other triggers to avoid conflicts in pg_roles table*/
INSERT INTO base.sys_user (id, email, role) VALUES
(0, 'postgres', 'admin');



/*Create function to update updated_by_id column*/
CREATE OR REPLACE FUNCTION base.update_updated_by_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_by_id = base.get_current_user_id();
    RETURN NEW;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.update_updated_by_id IS
'Function used to automatically update the updated_by_id column in tables.';



/*Create function to create database user in pg_roles table when user is created in user table*/
CREATE OR REPLACE FUNCTION base.create_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create database user
    EXECUTE 'CREATE USER user_' || NEW.id;

    -- Grant permission
    EXECUTE 'GRANT ' || NEW.role || ' TO user_' || NEW.id;

    -- Assign default user group
    INSERT INTO base.sys_user_group_user (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.create_user IS
'Function used to automatically create a database user in pg_roles tables when user is created in user table.';



/*Create function to update user permissions in pg_roles table*/
CREATE OR REPLACE FUNCTION base.update_user_permission()
RETURNS TRIGGER AS $$
BEGIN
    -- Update permission
    IF OLD.role <> NEW.role THEN
        -- Revoke permission
        EXECUTE 'REVOKE ' || OLD.role || ' FROM user_' || OLD.id;

        -- Grant permission
        EXECUTE 'GRANT ' || NEW.role || ' TO user_' || NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.update_user_permission IS
'Function used to automatically update permissions of a user in pg_roles table.';



/*Triggers on insert*/
CREATE TRIGGER user_hash_password BEFORE INSERT
ON base.sys_user FOR EACH ROW EXECUTE PROCEDURE
base.hash_password();

CREATE TRIGGER user_create_user AFTER INSERT
ON base.sys_user FOR EACH ROW EXECUTE PROCEDURE
base.create_user();



/*Triggers on update*/
CREATE TRIGGER user_update_updated_date BEFORE UPDATE
ON base.sys_user FOR EACH ROW EXECUTE PROCEDURE
base.update_updated_date();

CREATE TRIGGER user_updated_by_id BEFORE UPDATE
ON base.sys_user FOR EACH ROW EXECUTE PROCEDURE
base.update_updated_by_id();

CREATE TRIGGER user_update_user_permission BEFORE UPDATE
ON base.sys_user FOR EACH ROW EXECUTE PROCEDURE
base.update_user_permission();
