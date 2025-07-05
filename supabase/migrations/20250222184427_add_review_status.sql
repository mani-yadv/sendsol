-- Create review status enum type
CREATE TYPE project_review_status AS ENUM (
    'under_review',
    'reviewed',
    'approved',
    'verified',
    'platform_project',
    'rejected',
    'potential_risk',
    'dyor',
    'uncertain',
    'flagged',
    'inactive',
    'restricted'
);

-- Add review_status column with default value
ALTER TABLE projects 
ADD COLUMN review_status project_review_status NOT NULL DEFAULT 'under_review';
