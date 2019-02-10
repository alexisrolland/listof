/*Connect to database*/
\connect listof



/*Create function to get Id of the current user based on his database user role*/
CREATE OR REPLACE FUNCTION base.get_current_user_id()
RETURNS INTEGER AS $$
DECLARE
    user_id INTEGER;
BEGIN
    IF CURRENT_USER LIKE 'user_%' THEN
      SELECT SUBSTRING(CURRENT_USER, 6) INTO user_id;
    ELSE
      SELECT 0 INTO user_id;
    END IF;
    RETURN user_id;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.get_current_user_id IS
'Function used to get Id of the current user based on his database user role.';



/*Create table user*/
CREATE TABLE base.sys_user (
    id SERIAL PRIMARY KEY
  , email TEXT NOT NULL UNIQUE
  , password TEXT
  , role TEXT NOT NULL
  , flag_active BOOLEAN DEFAULT TRUE
  , created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  , updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  , created_by_id INTEGER DEFAULT base.get_current_user_id()
  , updated_by_id INTEGER DEFAULT base.get_current_user_id()
);

COMMENT ON TABLE base.sys_user IS
'Users information and their authentication methods.';



/*Triggers on update*/
CREATE TRIGGER user_update_updated_date BEFORE UPDATE
ON base.sys_user FOR EACH ROW EXECUTE PROCEDURE
base.update_updated_date();



/*Create default user*/
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

CREATE TRIGGER user_updated_by_id BEFORE UPDATE
ON base.sys_user FOR EACH ROW EXECUTE PROCEDURE
base.update_updated_by_id();



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

CREATE TRIGGER user_create_user AFTER INSERT
ON base.sys_user FOR EACH ROW EXECUTE PROCEDURE
base.create_user();



/*Create function to update user permissions in pg_roles table*/
CREATE OR REPLACE FUNCTION base.update_user_permission()
RETURNS TRIGGER AS $$
BEGIN
    -- Update permission
    IF OLD.role <> NEW.role THEN
        EXECUTE 'GRANT ' || NEW.role || ' TO user_' || NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.update_user_permission IS
'Function used to automatically update permissions of a user in pg_roles table.';

CREATE TRIGGER user_update_user_permission BEFORE UPDATE
ON base.sys_user FOR EACH ROW EXECUTE PROCEDURE
base.update_user_permission();
