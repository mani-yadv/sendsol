-- Drop coin-related columns
ALTER TABLE public.projects
DROP COLUMN is_coin_project,
DROP COLUMN coin_ticker,
DROP COLUMN allocation_type,
DROP COLUMN total_allocated_quantity;

-- Drop the unused enum type
DROP TYPE public.coins_allocation_type;

-- Add new columns for project links and goal
ALTER TABLE public.projects
ADD COLUMN pitch_deck_url TEXT,
ADD COLUMN goal_amount DECIMAL(18,4),
ADD COLUMN x_profile_url TEXT,
ADD COLUMN website_url TEXT;
