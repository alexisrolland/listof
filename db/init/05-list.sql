/*Connect to database*/
\connect listof



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



/*Triggers on insert*/
CREATE TRIGGER list_generate_table_name BEFORE INSERT
ON base.sys_list FOR EACH ROW EXECUTE PROCEDURE
base.generate_table_name();



/*Triggers on delete*/
CREATE TRIGGER list_delete_attribute BEFORE DELETE
ON base.sys_list FOR EACH ROW EXECUTE PROCEDURE
base.delete_children('sys_list', 'list_id');



/*Triggers on update*/
CREATE TRIGGER list_update_updated_date BEFORE UPDATE
ON base.sys_list FOR EACH ROW EXECUTE PROCEDURE
base.update_updated_date();

CREATE TRIGGER list_update_updated_by_id BEFORE UPDATE
ON base.sys_list FOR EACH ROW EXECUTE PROCEDURE
base.update_updated_by_id();