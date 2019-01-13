/*Connect to database*/
\connect listof



/*Create table for lists*/
CREATE TABLE base.sys_list (
    id SERIAL PRIMARY KEY
  , name TEXT NOT NULL UNIQUE
  , description TEXT NOT NULL
  , table_name TEXT
  , created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  , updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  , created_by_id INTEGER DEFAULT base.get_current_user_id() REFERENCES base.sys_user(id)
  , updated_by_id INTEGER DEFAULT base.get_current_user_id() REFERENCES base.sys_user(id)
  , user_group_id INTEGER DEFAULT 0 REFERENCES base.sys_user_group(id)
);

COMMENT ON TABLE base.sys_list IS
'Lists created in the application.';



/*Create function to generate a table name from a list name*/
CREATE OR REPLACE FUNCTION base.generate_table_name()
RETURNS TRIGGER AS $$
BEGIN
    NEW.table_name = LOWER(REPLACE(NEW.name, ' ', '_'));
    RETURN NEW;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.generate_table_name IS
'Function used to generate a table name from a list name.';



/*Create function to automatically create a list table when a list is created*/
CREATE OR REPLACE FUNCTION base.create_list_table()
RETURNS TRIGGER AS $$
BEGIN
    EXECUTE format('
        CREATE TABLE base.%I (
            id SERIAL PRIMARY KEY
            , created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            , updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            , created_by_id INTEGER DEFAULT base.get_current_user_id() REFERENCES base.sys_user(id)
            , updated_by_id INTEGER DEFAULT base.get_current_user_id() REFERENCES base.sys_user(id)
            , user_group_id INTEGER DEFAULT 0 REFERENCES base.sys_user_group(id)
        );',
        NEW.table_name
    );
    RETURN NEW;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.create_list_table IS
'Function used to automatically create a list table when a list is created.';



/*Create function to automatically rename a list table when a list is renamed*/
CREATE OR REPLACE FUNCTION base.rename_list_table()
RETURNS TRIGGER AS $$
BEGIN
    EXECUTE format('ALTER TABLE IF EXISTS base.%I RENAME TO %I;', OLD.table_name, NEW.table_name);
    RETURN NEW;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.rename_list_table IS
'Function used to automatically rename a list table when a list is renamed.';



/*Create function to automatically delete a list table when a list is deleted*/
CREATE OR REPLACE FUNCTION base.delete_list_table()
RETURNS TRIGGER AS $$
BEGIN
    EXECUTE format('DROP TABLE base.%I;', OLD.table_name);
    RETURN OLD;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.delete_list_table IS
'Function used to automatically delete a list table when a list is deleted.';



/*Triggers on insert*/
CREATE TRIGGER list_generate_table_name BEFORE INSERT
ON base.sys_list FOR EACH ROW EXECUTE PROCEDURE
base.generate_table_name();

CREATE TRIGGER list_create_list_table AFTER INSERT
ON base.sys_list FOR EACH ROW EXECUTE PROCEDURE
base.create_list_table();



/*Triggers on delete*/
CREATE TRIGGER list_delete_attribute BEFORE DELETE
ON base.sys_list FOR EACH ROW EXECUTE PROCEDURE
base.delete_children('sys_attribute', 'list_id');

CREATE TRIGGER list_delete_list_table AFTER DELETE
ON base.sys_list FOR EACH ROW EXECUTE PROCEDURE
base.delete_list_table();



/*Triggers on update*/
CREATE TRIGGER list_update_updated_date BEFORE UPDATE
ON base.sys_list FOR EACH ROW EXECUTE PROCEDURE
base.update_updated_date();

CREATE TRIGGER list_update_updated_by_id BEFORE UPDATE
ON base.sys_list FOR EACH ROW EXECUTE PROCEDURE
base.update_updated_by_id();

CREATE TRIGGER list_update_table_name BEFORE UPDATE
ON base.sys_list FOR EACH ROW WHEN (OLD.name IS DISTINCT FROM NEW.name) 
EXECUTE PROCEDURE base.generate_table_name();

CREATE TRIGGER list_rename_list_table AFTER UPDATE
ON base.sys_list FOR EACH ROW WHEN (OLD.table_name IS DISTINCT FROM NEW.table_name) 
EXECUTE PROCEDURE base.rename_list_table();