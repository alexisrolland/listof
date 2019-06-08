/*Connect to database*/
\connect listof



/*
Create anonymous user role
The anonymous role is the default role used to query the database for non authenticated users.
It grants permissions to read lists and their values which belong to the Public group only.
*/
CREATE ROLE anonymous;
GRANT user_group_1 TO anonymous;  /*Grant Public user group to anonymous*/

/*base schema*/
GRANT USAGE ON SCHEMA base TO anonymous;
GRANT SELECT ON ALL TABLES IN SCHEMA base TO anonymous;

/*public schema*/
GRANT USAGE ON SCHEMA public TO anonymous;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anonymous;



/*
Create standard user role
The standard role is the default role for all users who wish to manage values of a list.
It grants permissions to read, write and delete records on the tables created for each list.
*/
CREATE ROLE standard;
GRANT anonymous TO standard;

/*public schema*/
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO standard;
GRANT INSERT, UPDATE, DELETE, REFERENCES ON ALL TABLES IN SCHEMA public TO standard;



/*
Create advanced user role
The advanced role is the role used for all users who wish to create and manage lists definition and structure.
In addition to the permissions of the standard role, it grants permissions to create, update and delete lists as well as their attributes.
*/
CREATE ROLE advanced;
GRANT standard TO advanced;

/*base schema*/
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA base TO advanced;
GRANT REFERENCES ON ALL TABLES IN SCHEMA base TO advanced;
GRANT INSERT, UPDATE, DELETE ON base.sys_list TO advanced;
GRANT INSERT, UPDATE, DELETE ON base.sys_attribute TO advanced;



/*
Create admin user role
The admin role is used to manage application users and configuration.
It grants the same permissions as the advanced role, plus the permissions to read, write and delete the following objects:
Data types, Users, User groups
*/
CREATE ROLE admin;
GRANT advanced TO admin;

/*base schema*/
GRANT INSERT, UPDATE, DELETE ON base.sys_user TO admin;
GRANT INSERT, UPDATE, DELETE ON base.sys_user_group TO admin;
GRANT INSERT, UPDATE, DELETE ON base.sys_user_group_membership TO admin;
GRANT INSERT, UPDATE, DELETE ON base.sys_data_type TO admin;

/*Grant admin role to default user*/
GRANT admin TO user_1;



/*Create function to refresh database permissions*/
CREATE OR REPLACE FUNCTION base.refresh_permission()
RETURNS event_trigger AS $$
BEGIN
    /*anonymous*/
    /*public schema*/
    GRANT USAGE ON SCHEMA public TO anonymous;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO anonymous;

    /*standard*/
    /*public schema*/
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO standard;
    GRANT INSERT, UPDATE, DELETE, REFERENCES ON ALL TABLES IN SCHEMA public TO standard;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION base.refresh_permission IS
'Function used to refresh database permissions on public schema.';

/*Create trigger to refresh permissions on public schema when a DDL is executed*/
CREATE EVENT TRIGGER refresh_permission ON ddl_command_end
WHEN TAG IN (
    'CREATE TABLE',
    'CREATE TABLE AS',
    'ALTER TABLE',
    'DROP TABLE'
)
EXECUTE PROCEDURE base.refresh_permission();



/*Create row level security policies*/
ALTER TABLE base.sys_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE base.sys_attribute ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_group_policy on base.sys_list FOR ALL TO PUBLIC
USING (pg_has_role('user_group_' || user_group_id, 'MEMBER'));

CREATE POLICY user_group_policy on base.sys_attribute FOR ALL TO PUBLIC
USING (pg_has_role('user_group_' || user_group_id, 'MEMBER'));