create or replace function public.get_project_transactions_stats(
    project_txn_stats_project_id uuid,
    project_txn_stats_offset int,
    project_txn_stats_limit int
)
returns table (
    sender_wallet text,
    total_amount numeric,
    tx_count bigint
)
language sql
security definer
as $$
    select 
        sender_wallet,
        sum(amount) as total_amount,
        count(*) as tx_count
    from public.transactions
    where status = 'confirmed'
    and project_id = project_txn_stats_project_id
    group by sender_wallet
    order by sum(amount) desc
    offset project_txn_stats_offset
    limit project_txn_stats_limit;
$$;

-- Function to get total unique senders count
create or replace function public.get_project_total_senders(
    project_total_senders_project_id uuid
)
returns bigint language sql as $$
    select count(distinct sender_wallet)
    from public.transactions
    where status = 'confirmed'
    and project_id = project_total_senders_project_id;
$$;
