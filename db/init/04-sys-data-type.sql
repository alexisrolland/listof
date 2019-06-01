/*Connect to database*/
\connect listof



/*Create table data type*/
CREATE TABLE base.sys_data_type (
    id SERIAL PRIMARY KEY
  , "name" CITEXT NOT NULL UNIQUE
  , created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  , updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  , created_by_id INTEGER DEFAULT base.get_current_user_id() REFERENCES base.sys_user(id)
  , updated_by_id INTEGER DEFAULT base.get_current_user_id() REFERENCES base.sys_user(id)
);

COMMENT ON TABLE base.sys_data_type IS
'Data types used for lists attributes.';



/*Triggers on delete*/
CREATE TRIGGER data_type_delete_attribute BEFORE DELETE
ON base.sys_data_type FOR EACH ROW EXECUTE PROCEDURE
base.delete_children('sys_attribute', 'data_type_id');



/*Triggers on update*/
CREATE TRIGGER data_type_update_updated_date BEFORE UPDATE
ON base.sys_data_type FOR EACH ROW EXECUTE PROCEDURE
base.update_updated_date();

CREATE TRIGGER data_type_update_updated_by_id BEFORE UPDATE
ON base.sys_data_type FOR EACH ROW EXECUTE PROCEDURE
base.update_updated_by_id();



/*Initialize supported data types*/
INSERT INTO base.sys_data_type (id, name) VALUES
  (1, 'bigint')
, (2, 'boolean')
, (3, 'date')
, (4, 'decimal')
, (5, 'integer')
, (6, 'real')
, (7, 'smallint')
, (8, 'text')
, (9, 'timestamp')