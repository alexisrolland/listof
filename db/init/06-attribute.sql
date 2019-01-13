/*Connect to database*/
\connect listof



/*Create function to generate a column name from an attribute name*/
CREATE OR REPLACE FUNCTION base.generate_column_name()
RETURNS TRIGGER AS $$
BEGIN
    NEW.column_name = LOWER(REPLACE(NEW.name, ' ', '_'));
    RETURN NEW;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.generate_column_name IS
/*Create function to generate a column name from a list name*/
'Function used to generate a table name from an attribute name.';



/*Create table for list attributes*/
CREATE TABLE base.sys_attribute (
    id SERIAL PRIMARY KEY
  , name TEXT NOT NULL
  , description TEXT
  , column_name TEXT
  , flag_unique BOOLEAN DEFAULT FALSE
  , flag_mandatory BOOLEAN DEFAULT FALSE
  , default_value TEXT
  , list_of_value TEXT
  , created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  , updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  , created_by_id INTEGER DEFAULT base.get_current_user_id() REFERENCES base.sys_user(id)
  , updated_by_id INTEGER DEFAULT base.get_current_user_id() REFERENCES base.sys_user(id)
  , user_group_id INTEGER DEFAULT 0 REFERENCES base.sys_user_group(id)
  , list_id INTEGER NOT NULL REFERENCES base.sys_list(id)
  , data_type_id INTEGER NOT NULL REFERENCES base.sys_data_type(id)
  , UNIQUE (name, list_id)
);

COMMENT ON TABLE base.sys_attribute IS
'List attributes created in the application.';



/*Triggers on insert*/
CREATE TRIGGER attribute_generate_column_name BEFORE INSERT
ON base.sys_attribute FOR EACH ROW EXECUTE PROCEDURE
base.generate_column_name();



/*Triggers on update*/
CREATE TRIGGER attribute_update_updated_date BEFORE UPDATE
ON base.sys_attribute FOR EACH ROW EXECUTE PROCEDURE
base.update_updated_date();

CREATE TRIGGER attribute_update_updated_by_id BEFORE UPDATE
ON base.sys_attribute FOR EACH ROW EXECUTE PROCEDURE
base.update_updated_by_id();