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
  , user_group_id INTEGER DEFAULT 1 REFERENCES base.sys_user_group(id)
);

COMMENT ON TABLE base.sys_list IS
'Lists created in the application.';



/*Create function to search lists*/
CREATE OR REPLACE FUNCTION base.search_list(keyword TEXT)
RETURNS SETOF base.sys_list AS $$
    SELECT a.*
    FROM base.sys_list a
    WHERE a.name ILIKE ('%' || keyword || '%') OR a.description ILIKE ('%' || keyword || '%')
    ORDER BY a.name ASC
$$ language sql;

COMMENT ON FUNCTION base.search_list IS
'Function used to search lists based on keywords contained in their name and description.';



/*Create function to generate a table name from a list name*/
CREATE OR REPLACE FUNCTION base.generate_table_name()
RETURNS TRIGGER AS $$
BEGIN
    NEW.table_name = REPLACE(LOWER(NEW.name), ' ', '_');
    RETURN NEW;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.generate_table_name IS
'Function used to generate a table name from a list name.';



/*Create function to automatically create a table when a list is created*/
CREATE OR REPLACE FUNCTION base.create_list_table()
RETURNS TRIGGER AS $$
BEGIN
    EXECUTE format('
        CREATE TABLE public.%I (
            id SERIAL PRIMARY KEY
            , created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            , updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            , created_by_id INTEGER DEFAULT base.get_current_user_id() REFERENCES base.sys_user(id)
            , updated_by_id INTEGER DEFAULT base.get_current_user_id() REFERENCES base.sys_user(id)
            , user_group_id INTEGER DEFAULT 1 REFERENCES base.sys_user_group(id)
        );',
        NEW.table_name
    );

    /*Set ownership to advanced user to allow all advanced users to manage table structure*/
    EXECUTE format('ALTER TABLE public.%I OWNER TO advanced;', NEW.table_name);

    /*Create function to search list table*/
    EXECUTE format(
        $code$
            CREATE OR REPLACE FUNCTION public.search_%I(column_name TEXT, keyword TEXT)
            RETURNS SETOF public.%I AS $str$
                BEGIN
                    RETURN QUERY
                    EXECUTE 'SELECT a.*
                    FROM public.%I a
                    WHERE CAST(a.' || column_name || ' AS TEXT) ILIKE ''%%' || keyword || '%%''
                    ORDER BY ' || column_name || ' ASC';
                END;
            $str$ language plpgsql;
        $code$,
        NEW.table_name,
        NEW.table_name,
        NEW.table_name
    );

    /*Add comment to search function*/
    EXECUTE format('COMMENT ON FUNCTION public.search_%I IS ''Function used to search list based on keywords.''', NEW.table_name);

    RETURN NEW;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.create_list_table IS
'Function used to automatically create a table when a list is created.';



/*Create function to automatically rename a table when a list is renamed*/
CREATE OR REPLACE FUNCTION base.rename_list_table()
RETURNS TRIGGER AS $$
DECLARE
    v_alter_statement TEXT;
    v_alter_table TEXT;
    v_column_name RECORD;
BEGIN
    /*Select attributes which are foreign keys, rename corresponding integrity constraints*/
    v_alter_table = format('ALTER TABLE public.%I ', OLD.table_name);
    FOR v_column_name IN
        SELECT b.column_name
        FROM base.sys_list a
        INNER JOIN base.sys_attribute b ON a.id=b.list_id
        WHERE a.id=NEW.id
        AND b.linked_attribute_id IS NOT NULL
    LOOP
        EXECUTE(v_alter_table || format(
            'RENAME CONSTRAINT %I_%I_fkey TO %I_%I_fkey;',
            OLD.table_name,
            v_column_name.column_name,
            NEW.table_name,
            v_column_name.column_name
        ));
    END LOOP;

    /*Rename table*/
    v_alter_statement = v_alter_table || format('RENAME TO %I;', NEW.table_name);
    EXECUTE v_alter_statement;

    /*Update function to search list table based on its new name*/
    EXECUTE format(
        $code$
            CREATE OR REPLACE FUNCTION public.search_%I(column_name TEXT, keyword TEXT)
            RETURNS SETOF public.%I AS $str$
                BEGIN
                    RETURN QUERY
                    EXECUTE 'SELECT a.*
                    FROM public.%I a
                    WHERE CAST(a.' || column_name || ' AS TEXT) ILIKE ''%%' || keyword || '%%''
                    ORDER BY ' || column_name || ' ASC';
                END;
            $str$ language plpgsql;
        $code$,
        OLD.table_name,
        NEW.table_name,
        NEW.table_name
    );

    /*Rename function to reflect new table name*/
    EXECUTE format(
        'ALTER FUNCTION public.search_%I RENAME TO search_%I',
        OLD.table_name,
        NEW.table_name
    );

    RETURN NEW;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.rename_list_table IS
'Function used to automatically rename a table when a list is renamed.';



/*Create function to automatically delete a table when a list is deleted*/
CREATE OR REPLACE FUNCTION base.delete_list_table()
RETURNS TRIGGER AS $$
BEGIN
    EXECUTE format('DROP TABLE public.%I;', OLD.table_name);
    RETURN OLD;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.delete_list_table IS
'Function used to automatically delete a table when a list is deleted.';



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