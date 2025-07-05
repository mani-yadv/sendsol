-- Create the transaction_status enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.transaction_status AS ENUM ('pending', 'confirmed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create transactions table
create table public.transactions (
    id uuid not null default gen_random_uuid(),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone null,
    sender_wallet text not null,
    receiver_wallet text not null,
    amount numeric not null,
    transaction_id text not null,
    status public.transaction_status not null default 'pending'::transaction_status,
    project_id uuid not null,
    block_time bigint null,
    slot bigint null,
    verified_amount numeric null,
    verified_at timestamp with time zone null,
    constraint transactions_pkey primary key (id),
    constraint public_transactions_project_id_fkey foreign key (project_id) references projects (id)
) tablespace pg_default;

-- Create indexes
create index if not exists transactions_transaction_id_idx 
    on public.transactions using btree (transaction_id) 
    tablespace pg_default;

create index if not exists transactions_sender_wallet_idx 
    on public.transactions using btree (sender_wallet) 
    tablespace pg_default;

create index if not exists transactions_status_idx 
    on public.transactions using btree (status) 
    tablespace pg_default;

-- Set up Row Level Security (RLS)
alter table public.transactions enable row level security;

-- Create policies
create policy "Enable read access for all users"
    on public.transactions for select
    using (true);

create policy "Enable insert for authenticated users only"
    on public.transactions for insert
    with check (true);

-- Drop existing RPC if it exists
drop function if exists public.get_confirmed_transactions(project_id uuid);
