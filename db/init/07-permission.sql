/*Connect to database*/
\connect listof



/*
Create standard user role
The standard role is the default role for all users who wish to manage values of a list.
It grants permissions to read, write and delete records on the tables created for each list.
*/
CREATE ROLE standard;

/*base schema*/
GRANT USAGE ON SCHEMA base TO standard;
GRANT SELECT ON ALL TABLES IN SCHEMA base TO standard;

/*public schema*/
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO standard;
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES ON ALL TABLES IN SCHEMA public TO standard;



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
GRANT admin TO user_0;

/*base schema*/
GRANT INSERT, UPDATE, DELETE ON base.sys_user TO admin;
GRANT INSERT, UPDATE, DELETE ON base.sys_user_group TO admin;
GRANT INSERT, UPDATE, DELETE ON base.sys_user_group_user TO admin;
GRANT INSERT, UPDATE, DELETE ON base.sys_data_type TO admin;