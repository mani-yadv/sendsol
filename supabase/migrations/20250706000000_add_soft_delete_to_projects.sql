-- Add soft delete column to projects table
ALTER TABLE projects ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create index for better performance on non-deleted projects
CREATE INDEX idx_projects_deleted_at ON projects (deleted_at) WHERE deleted_at IS NULL;

-- Update existing RLS policies to exclude deleted projects
DROP POLICY IF EXISTS "Enable read access for all users" ON projects;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON projects;
DROP POLICY IF EXISTS "Enable update for project owners" ON projects;
DROP POLICY IF EXISTS "Enable delete for project owners" ON projects;

-- Recreate RLS policies with deleted_at filter
CREATE POLICY "Users can view active projects" ON projects
    FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "Users can insert projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own active projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = user_id);