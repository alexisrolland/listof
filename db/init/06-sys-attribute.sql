/*Connect to database*/
\connect listof



/*Create table for list attributes*/
CREATE TABLE base.sys_attribute (
    id SERIAL PRIMARY KEY
  , name TEXT NOT NULL
  , description TEXT
  , column_name TEXT
  , flag_unique BOOLEAN DEFAULT FALSE
  , flag_mandatory BOOLEAN DEFAULT FALSE
  , length INTEGER
  , default_value TEXT
  , created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  , updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  , created_by_id INTEGER DEFAULT base.get_current_user_id() REFERENCES base.sys_user(id)
  , updated_by_id INTEGER DEFAULT base.get_current_user_id() REFERENCES base.sys_user(id)
  , user_group_id INTEGER DEFAULT 1 REFERENCES base.sys_user_group(id)
  , list_id INTEGER NOT NULL REFERENCES base.sys_list(id)
  , data_type_id INTEGER NOT NULL REFERENCES base.sys_data_type(id)
  , linked_attribute_id INTEGER NULL REFERENCES base.sys_attribute(id)
  , UNIQUE (name, list_id)
);

COMMENT ON TABLE base.sys_attribute IS
'List attributes created in the application.';



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



/*Create function to automatically create a column on a list table when an attribute is created*/
CREATE OR REPLACE FUNCTION base.create_list_column()
RETURNS TRIGGER AS $$
DECLARE
    v_alter_statement TEXT;
    v_alter_table TEXT;
    v_data_type TEXT;
    v_linked_table_name TEXT;
    v_table_name TEXT;
BEGIN
    /*Get table name*/
    SELECT table_name 
    INTO v_table_name
    FROM base.sys_list
    WHERE id=NEW.list_id;
    v_alter_table = format('ALTER TABLE public.%I ', v_table_name);
    
    /*Test if attribute should be a foreign key of another list*/
    IF (NEW.linked_attribute_id IS NOT NULL) THEN
        /*Get linked table name*/
        SELECT b.table_name 
        INTO v_linked_table_name
        FROM base.sys_attribute a
        INNER JOIN base.sys_list b on a.list_id=b.id
        WHERE a.id=NEW.linked_attribute_id;

        /*Create foreign key column*/
        v_alter_statement = v_alter_table || format('ADD COLUMN %I INTEGER;', NEW.column_name);
        EXECUTE v_alter_statement;

        /*Add foreign key constraint*/
        v_alter_statement = v_alter_table || format('ADD CONSTRAINT %I_%I_fkey ', v_table_name, NEW.column_name);
        v_alter_statement = v_alter_statement || format('FOREIGN KEY (%I) ', NEW.column_name);
        v_alter_statement = v_alter_statement || format('REFERENCES public.%I(id);', v_linked_table_name);
        EXECUTE v_alter_statement;

    /*If attribute is not a foreign key create column*/
    ELSE
        /*Get column data type*/
        SELECT name 
        INTO v_data_type
        FROM base.sys_data_type
        WHERE id=NEW.data_type_id;

        /*Create column*/
        v_alter_statement = v_alter_table || format('ADD COLUMN %I ', NEW.column_name);
        v_alter_statement = v_alter_statement || v_data_type || ';';
        EXECUTE v_alter_statement;
    END IF;

    /*Add default value*/
    IF (NEW.default_value IS NOT NULL) THEN
        v_alter_statement = v_alter_table || format('ALTER COLUMN %I SET DEFAULT %L;', NEW.column_name, NEW.default_value);
        EXECUTE v_alter_statement;
    END IF;

    /*Add mandatory constraint*/
    IF NEW.flag_mandatory THEN
        v_alter_statement = v_alter_table || format('ALTER COLUMN %I SET NOT NULL;', NEW.column_name);
        EXECUTE v_alter_statement;
    END IF;

    /*Add unicity constraint*/
    IF NEW.flag_unique THEN
        v_alter_statement = v_alter_table || format('ADD CONSTRAINT %I_%I_key ', v_table_name, NEW.column_name);
        v_alter_statement = v_alter_statement || format('UNIQUE (%I);', NEW.column_name);
        EXECUTE v_alter_statement;
    END IF;

    RETURN NEW;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.create_list_column IS
'Function used to automatically create a column on a list table when an attribute is created.';



/*Create function to automatically rename a column on a list table when an attribute is renamed*/
CREATE OR REPLACE FUNCTION base.rename_list_column()
RETURNS TRIGGER AS $$
DECLARE
    v_alter_statement TEXT;
    v_alter_table TEXT;
    v_table_name TEXT;
BEGIN
    SELECT table_name 
    INTO v_table_name
    FROM base.sys_list
    WHERE id = OLD.list_id;
    v_alter_table = format('ALTER TABLE public.%I ', v_table_name);

     /*Test if attribute is a foreign key, rename corresponding constraint*/
    IF (NEW.linked_attribute_id IS NOT NULL) THEN
        v_alter_statement = v_alter_table || format('RENAME CONSTRAINT %I_%I_fkey TO %I_%I_fkey;', v_table_name, OLD.column_name, v_table_name, NEW.column_name);
        EXECUTE v_alter_statement;
    END IF;

    /*Rename column*/
    v_alter_statement = v_alter_table || format('RENAME COLUMN %I TO %I;', OLD.column_name, NEW.column_name);
    EXECUTE v_alter_statement;

    RETURN NEW;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.rename_list_column IS
'Function used to automatically rename a column on a list table when an attribute is renamed.';



/*Create function to automatically delete a column on a list table when an attribute is deleted*/
CREATE OR REPLACE FUNCTION base.delete_list_column()
RETURNS TRIGGER AS $$
DECLARE
    v_alter_statement TEXT;
    v_alter_table TEXT;
    v_linked_table_name TEXT;
    v_table_name TEXT;
BEGIN
    /*Get table name*/
    SELECT table_name 
    INTO v_table_name
    FROM base.sys_list
    WHERE id=OLD.list_id;
    v_alter_table = format('ALTER TABLE public.%I ', v_table_name);
    
    /*Test if attribute is a foreign key of another list*/
    IF (OLD.linked_attribute_id IS NOT NULL) THEN
        /*Get linked table name*/
        SELECT b.table_name 
        INTO v_linked_table_name
        FROM base.sys_attribute a
        INNER JOIN base.sys_list b on a.list_id=b.id
        WHERE a.id=NEW.linked_attribute_id;

        /*Delete foreign key constraint*/
        v_alter_statement = v_alter_table || format('DROP CONSTRAINT %I_%I_fkey;', v_table_name, OLD.column_name);
        EXECUTE v_alter_statement;
    END IF;

    /*Delete foreign key column*/
    v_alter_statement = v_alter_table || format('DROP COLUMN %I;', OLD.column_name);
    EXECUTE v_alter_statement;

    RETURN OLD;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.delete_list_column IS
'Function used to automatically delete a column on a list table when an attribute is deleted.';



/*Create function to get the user group Id of a list*/
/*This is used to default the user_group_id column in sys_attribute table*/
CREATE OR REPLACE FUNCTION base.get_list_user_group_id()
RETURNS TRIGGER AS $$
BEGIN
    SELECT user_group_id
    INTO NEW.user_group_id
    FROM base.sys_list
    WHERE id=NEW.list_id;

    RETURN NEW;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.get_list_user_group_id IS
'Function used to get the user group Id of a list.';



/*Create function to update the user group Id of all attributes of a list*/
CREATE OR REPLACE FUNCTION base.update_attribute_user_group_id()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE base.sys_attribute
    SET user_group_id=NEW.user_group_id
    WHERE list_id=NEW.id;

    RETURN NEW;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.update_attribute_user_group_id IS
'Function used to update the user group Id of all attributes of a list.';



/*Triggers on insert*/
CREATE TRIGGER attribute_generate_column_name BEFORE INSERT
ON base.sys_attribute FOR EACH ROW EXECUTE PROCEDURE
base.generate_column_name();

CREATE TRIGGER attribute_set_user_group_id BEFORE INSERT
ON base.sys_attribute FOR EACH ROW EXECUTE PROCEDURE
base.get_list_user_group_id();

CREATE TRIGGER attribute_create_list_column AFTER INSERT
ON base.sys_attribute FOR EACH ROW EXECUTE PROCEDURE
base.create_list_column();



/*Triggers on delete*/
CREATE TRIGGER attribute_delete_list_column AFTER DELETE
ON base.sys_attribute FOR EACH ROW EXECUTE PROCEDURE
base.delete_list_column();



/*Triggers on update*/
CREATE TRIGGER attribute_update_updated_date BEFORE UPDATE
ON base.sys_attribute FOR EACH ROW EXECUTE PROCEDURE
base.update_updated_date();

CREATE TRIGGER attribute_update_updated_by_id BEFORE UPDATE
ON base.sys_attribute FOR EACH ROW EXECUTE PROCEDURE
base.update_updated_by_id();

CREATE TRIGGER attribute_update_column_name BEFORE UPDATE
ON base.sys_attribute FOR EACH ROW WHEN (OLD.name IS DISTINCT FROM NEW.name) 
EXECUTE PROCEDURE base.generate_column_name();

CREATE TRIGGER attribute_rename_list_column AFTER UPDATE
ON base.sys_attribute FOR EACH ROW WHEN (OLD.column_name IS DISTINCT FROM NEW.column_name)
EXECUTE PROCEDURE base.rename_list_column();

/*Trigger on update of parent list*/
CREATE TRIGGER list_update_attribute_user_group_id AFTER UPDATE
ON base.sys_list FOR EACH ROW WHEN (OLD.user_group_id IS DISTINCT FROM NEW.user_group_id) 
EXECUTE PROCEDURE base.update_attribute_user_group_id();