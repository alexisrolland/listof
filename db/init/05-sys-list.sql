/*Connect to database*/
\connect listof



/*Create metadata table of lists*/
CREATE TABLE base.sys_list (
    id SERIAL PRIMARY KEY
  , "name" CITEXT NOT NULL UNIQUE
  , "description" CITEXT NOT NULL
  , table_name TEXT
  , created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  , updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  , created_by_id INTEGER DEFAULT base.get_current_user_id() REFERENCES base.sys_user(id)
  , updated_by_id INTEGER DEFAULT base.get_current_user_id() REFERENCES base.sys_user(id)
  , user_group_id INTEGER DEFAULT 1 REFERENCES base.sys_user_group(id)
);

COMMENT ON TABLE base.sys_list IS
'Lists created in the application.';



/*Create function to search metadata table of lists*/
CREATE OR REPLACE FUNCTION base.search_list(search_keyword TEXT, sort_attribute TEXT, sort_order TEXT)
RETURNS SETOF base.sys_list AS $$
BEGIN
    RETURN QUERY
    EXECUTE format(
        'SELECT a.*
        FROM base.sys_list a
        WHERE a.name ILIKE (''%%%I%%'') OR a.description ILIKE (''%%%I%%'')
        ORDER BY a.%I %s',
        search_keyword,
        search_keyword,
        sort_attribute,
        sort_order);
END;
$$ language plpgsql;

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



/*Create function to create a table when a list is created*/
CREATE OR REPLACE FUNCTION base.create_list_table()
RETURNS TRIGGER AS $$
BEGIN
    /*Create table*/
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

    /*Create view used in particular by the list search function*/
    EXECUTE format('SELECT base.create_list_view(''%I'');', NEW.table_name);

    /*Set ownership to advanced user to allow all advanced users to delete view*/
    EXECUTE format('ALTER VIEW public.vw_%I OWNER TO advanced;', NEW.table_name);

    /*Create function to search list table from the list view*/
    EXECUTE format('SELECT base.create_list_search(''%I'');', NEW.table_name);

    /*Set ownership to advanced user to allow all advanced users to delete function*/
    EXECUTE format('ALTER FUNCTION public.search_%I OWNER TO advanced;', NEW.table_name);

    /*Create trigger to update updated date*/
    EXECUTE format('
        CREATE TRIGGER %I_update_updated_date BEFORE UPDATE
        ON public.%I FOR EACH ROW EXECUTE PROCEDURE
        base.update_updated_date();',
        NEW.table_name,
        NEW.table_name
    );
    
    /*Create trigger to update updated by*/
    EXECUTE format('
        CREATE TRIGGER %I_update_updated_by_id BEFORE UPDATE
        ON public.%I FOR EACH ROW EXECUTE PROCEDURE
        base.update_updated_by_id();',
        NEW.table_name,
        NEW.table_name
    );

    RETURN NEW;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.create_list_table IS
'Function used to automatically create a table when a list is created.';



/*Create function to create view for a list table*/
CREATE OR REPLACE FUNCTION base.create_list_view(list_table_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_counter INTEGER;
    v_create TEXT;
    v_select TEXT;
    v_search_all_column TEXT;
    v_from TEXT;
    v_join TEXT;
    v_attribute RECORD;
BEGIN
    v_counter = 0;
    v_create = format('CREATE OR REPLACE VIEW public.vw_%I AS SELECT "0".id', list_table_name);
    v_select = '';
    v_search_all_column = ', CAST("0".id AS TEXT)';
    v_from = format(' FROM public.%I "0"', list_table_name);
    v_join = '';

    /*Build query select and joins to be used in the view*/
    FOR v_attribute IN
        SELECT b.column_name
        ,c.column_name AS linked_column_name
        ,d.table_name AS linked_table_name
        FROM base.sys_list a
        INNER JOIN base.sys_attribute b ON a.id=b.list_id
        LEFT JOIN base.sys_attribute c ON b.linked_attribute_id=c.id
        LEFT JOIN base.sys_list d ON c.list_id=d.id
        WHERE a.table_name=list_table_name
    LOOP
        v_counter = v_counter + 1;
        IF v_attribute.linked_column_name IS NULL THEN
            v_select = v_select || format(', "0".%I', v_attribute.column_name);
            v_search_all_column = v_search_all_column || format(' || '' '' || CAST("0".%I AS TEXT)', v_attribute.column_name);
        ELSE
            v_select = v_select || format(', %I.%I AS %I', v_counter, v_attribute.linked_column_name, v_attribute.column_name);
            v_search_all_column = v_search_all_column || format(' || '' '' || CAST(%I.%I AS TEXT)', v_counter, v_attribute.linked_column_name);
            v_join = v_join || format(' LEFT JOIN public.%I %I ON "0".%I=%I.id', v_attribute.linked_table_name, v_counter, v_attribute.column_name, v_counter);
        END IF;
    END LOOP;

    /*Add search column to select*/
    v_search_all_column = v_search_all_column || ' AS search_all';
    EXECUTE v_create || v_select || v_search_all_column || v_from || v_join;

    /*Set ownership to advanced user to allow all advanced users to manage view structure*/
    EXECUTE format('ALTER VIEW public.vw_%I OWNER TO advanced;', list_table_name);
    
    /*Refresh privileges to allow users to query the view*/
    EXECUTE 'GRANT SELECT ON ALL TABLES IN SCHEMA public TO anonymous;';

    /*Add comment to view*/
    EXECUTE format('COMMENT ON VIEW public.vw_%I IS ''View used to search list based on keywords.''', list_table_name);

    RETURN true;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.create_list_view IS
'Function used to automatically create a view for a list table.';



/*Create function to search list table from the list view*/
CREATE OR REPLACE FUNCTION base.create_list_search(list_table_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_counter INTEGER;
    v_create TEXT;
    v_select TEXT;
    v_from TEXT;
    v_join TEXT;
    v_attribute RECORD;
BEGIN
    EXECUTE format(
        $code$
            CREATE OR REPLACE FUNCTION public.search_%I(search_attribute TEXT, search_keyword TEXT, sort_attribute TEXT, sort_order TEXT)
            RETURNS SETOF public.%I AS $str$
                BEGIN
                    RETURN QUERY
                    EXECUTE 'SELECT a.*
                    FROM public.%I a
                    INNER JOIN public.vw_%I b ON a.id = b.id
                    WHERE CAST(b.' || search_attribute || ' AS TEXT) ILIKE ''%%' || search_keyword || '%%''
                    ORDER BY b.' || sort_attribute || ' ' || sort_order;
                END;
            $str$ language plpgsql;
        $code$,
        list_table_name,
        list_table_name,
        list_table_name,
        list_table_name
    );

    /*Add comment to search function*/
    EXECUTE format('COMMENT ON FUNCTION public.search_%I IS ''Function used to search list based on keywords.''', list_table_name);

    RETURN true;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.create_list_search IS
'Function used to automatically create a search function for a list table.';



/*Create function to duplicate values of a list*/
CREATE OR REPLACE FUNCTION base.duplicate_list_value(source_list_id INTEGER, target_list_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    v_source_table_name TEXT;
    v_target_table_name TEXT;
BEGIN
    /*Get source table name*/
    SELECT table_name
    INTO v_source_table_name
    FROM base.sys_list
    WHERE id=source_list_id;

    /*Get target table name*/
    SELECT table_name
    INTO v_target_table_name
    FROM base.sys_list
    WHERE id=target_list_id;

    /*Duplicate list data*/
    EXECUTE format('INSERT INTO public.%I SELECT * FROM public.%I;', v_target_table_name, v_source_table_name);
    
    /*Reset sequence to avoid unique constraint error*/
    EXECUTE format('SELECT SETVAL(''%I_id_seq'', (SELECT MAX(id) FROM public.%I));', v_target_table_name, v_target_table_name);

    RETURN true;
END;
$$ language plpgsql strict;

COMMENT ON FUNCTION base.duplicate_list_value IS
'Function used to duplicate data from a source list table to another target list table.';



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
        /*Rename integrity constraints*/
        EXECUTE(v_alter_table || format(
            'RENAME CONSTRAINT %I_%I_fkey TO %I_%I_fkey;',
            OLD.table_name,
            v_column_name.column_name,
            NEW.table_name,
            v_column_name.column_name
        ));
    END LOOP;

    /*Rename list table*/
    v_alter_statement = v_alter_table || format('RENAME TO %I;', NEW.table_name);
    EXECUTE v_alter_statement;

    /*Rename list view*/
    EXECUTE format('ALTER VIEW public.vw_%I RENAME TO vw_%I;', OLD.table_name, NEW.table_name);

    /*Rename list search*/
    EXECUTE format('ALTER FUNCTION public.search_%I RENAME TO search_%I', OLD.table_name, NEW.table_name);

    /*Rebuild list search to map it to the new list view*/
    EXECUTE format('SELECT base.create_list_search(''%I'');', NEW.table_name);

    /*Rename triggers*/
    EXECUTE format('ALTER TRIGGER %I_update_updated_date ON public.%I RENAME TO %I_update_updated_date;', OLD.table_name, NEW.table_name, NEW.table_name);
    EXECUTE format('ALTER TRIGGER %I_update_updated_by_id ON public.%I RENAME TO %I_update_updated_by_id;', OLD.table_name, NEW.table_name, NEW.table_name);

    RETURN NEW;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.rename_list_table IS
'Function used to automatically rename a table when a list is renamed.';



/*Create function to automatically delete a table when a list is deleted*/
CREATE OR REPLACE FUNCTION base.delete_list_table()
RETURNS TRIGGER AS $$
BEGIN
    /*Drop list search function*/
    EXECUTE format('DROP FUNCTION IF EXISTS public.search_%I;', OLD.table_name);

    /*Drop list table view*/
    EXECUTE format('DROP VIEW IF EXISTS public.vw_%I;', OLD.table_name);

    /*Drop list table*/
    EXECUTE format('DROP TABLE IF EXISTS public.%I;', OLD.table_name);

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