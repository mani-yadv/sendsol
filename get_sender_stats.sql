create or replace function get_sender_stats(from_offset integer, to_offset integer)
returns table (
    sender_wallet text,
    total_amount numeric,
    transaction_count bigint
) language plpgsql as $$
begin
    return query
    select 
        t.sender_wallet,
        sum(t.amount) as total_amount,
        count(*) as transaction_count
    from transactions t
    where t.status = 'confirmed'
    group by t.sender_wallet
    order by total_amount desc
    limit (to_offset - from_offset + 1)
    offset from_offset;
end;
$$;
