-- Drop existing constraint if it exists
alter table projects
drop constraint if exists projects_user_id_fkey;

-- Add foreign key constraint to projects table
alter table projects
add constraint projects_user_id_fkey
foreign key (user_id)
references user_profiles(id);
