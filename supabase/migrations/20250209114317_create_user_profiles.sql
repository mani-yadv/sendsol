-- Create user_profiles table
create table user_profiles (
    id uuid references auth.users primary key,
    username text,
    avatar_url text,
    avatar_url_original text,
    verified boolean default false,
    name text,
    x_profile_url text,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create RLS policies
alter table user_profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on user_profiles for select
  using ( true );

create policy "Users can update own profile"
  on user_profiles for update
  using ( auth.uid() = id );

-- Function to process avatar URL
create or replace function process_avatar_url(url text)
returns text
language plpgsql
as $$
declare
    processed_url text;
begin
    if url is null then
        return null;
    end if;

    -- Twitter/X specific processing
    if url like '%twimg.com%' then
        -- Handle normal size
        if url like '%_normal.%' then
            processed_url := regexp_replace(url, '_normal(?=\.[^.]+$)', '');
        -- Handle other known sizes (mini, bigger, etc)
        elsif url ~ '_[a-z]+\.[^.]+$' then
            processed_url := regexp_replace(url, '_[a-z]+(?=\.[^.]+$)', '');
        else
            processed_url := url;
        end if;
        return processed_url;
    end if;

    -- Default to original URL if not from a known provider
    return url;
end;
$$;

-- Function to handle profile updates from auth.users metadata
create or replace function sync_user_profile()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
    original_avatar text;
begin
    original_avatar := new.raw_user_meta_data->>'avatar_url';

    insert into public.user_profiles (
        id,
        username,
        avatar_url,
        avatar_url_original,
        name,
        x_profile_url,
        updated_at
    )
    values (
        new.id,
        new.raw_user_meta_data->>'preferred_username',
        process_avatar_url(original_avatar),
        original_avatar,
        new.raw_user_meta_data->>'name',
        'https://x.com/' || (new.raw_user_meta_data->>'preferred_username'),
        now()
    )
    on conflict (id) do update set
        username = excluded.username,
        avatar_url = excluded.avatar_url,
        avatar_url_original = excluded.avatar_url_original,
        name = excluded.name,
        x_profile_url = excluded.x_profile_url,
        updated_at = now();
    return new;
end;
$$;

-- Trigger to sync profile on user creation/update
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert or update on auth.users
    for each row execute procedure public.sync_user_profile();

-- Migrate existing users
with user_data as (
    select 
        id,
        raw_user_meta_data->>'preferred_username' as username,
        raw_user_meta_data->>'avatar_url' as original_avatar,
        raw_user_meta_data->>'name' as name,
        'https://x.com/' || (raw_user_meta_data->>'preferred_username') as x_profile_url
    from auth.users
)
insert into user_profiles (
    id,
    username,
    avatar_url,
    avatar_url_original,
    name,
    x_profile_url,
    updated_at
)
select 
    id,
    username,
    process_avatar_url(original_avatar),
    original_avatar,
    name,
    x_profile_url,
    now()
from user_data
on conflict (id) do update set
    username = excluded.username,
    avatar_url = excluded.avatar_url,
    avatar_url_original = excluded.avatar_url_original,
    name = excluded.name,
    x_profile_url = excluded.x_profile_url,
    updated_at = now();
