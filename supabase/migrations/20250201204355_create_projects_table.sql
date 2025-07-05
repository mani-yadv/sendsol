-- Create the coins_allocation_type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.coins_allocation_type AS ENUM ('fixed', 'unlimited');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create projects table
create table public.projects (
    id uuid not null default gen_random_uuid(),
    created_at timestamp with time zone not null default now(),
    name character varying not null,
    handle character varying not null,
    description text null,
    is_coin_project boolean not null default true,
    coin_ticker character varying null,
    allocation_type public.coins_allocation_type null,
    total_allocated_quantity numeric null,
    start_date timestamp with time zone null default now(),
    end_date timestamp with time zone null,
    user_id uuid not null default auth.uid(),
    is_featured boolean not null default false,
    wallet_address text null,
    constraint projects_pkey primary key (id),
    constraint projects_handle_key unique (handle),
    constraint projects_user_id_fkey foreign key (user_id) references auth.users (id)
) tablespace pg_default;

-- Set up Row Level Security (RLS)
alter table public.projects enable row level security;

-- Create policies
create policy "Enable read access for all users"
    on public.projects for select
    using (true);

create policy "Enable insert for authenticated users only"
    on public.projects for insert
    with check (auth.uid() = user_id);

create policy "Enable update for project owners"
    on public.projects for update
    using (auth.uid() = user_id);

create policy "Enable delete for project owners"
    on public.projects for delete
    using (auth.uid() = user_id);
