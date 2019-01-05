/*Connect to database*/
\connect listof



/*Create standard user role*/
CREATE ROLE standard;
GRANT USAGE ON SCHEMA base TO standard;
GRANT SELECT, UPDATE, INSERT, DELETE ON base.sys_list TO standard;
GRANT SELECT, UPDATE, INSERT, DELETE ON base.sys_attribute TO standard;



/*Create admin user role*/
CREATE ROLE admin;
GRANT standard TO admin;
GRANT SELECT, UPDATE, INSERT, DELETE ON base.sys_data_type TO admin;



/*Create row level security for lists*/
ALTER TABLE base.sys_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_group_list on base.sys_list
TO standard USING (pg_has_role('user_group_' || user_group_id, 'MEMBER'));



/*Create row level security for attribute*/
ALTER TABLE base.sys_attribute ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_group_attribute on base.sys_attribute
TO standard USING (pg_has_role('user_group_' || user_group_id, 'MEMBER'));