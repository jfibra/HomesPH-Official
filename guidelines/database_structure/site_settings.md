-- Reference/bootstrap script for site settings.
-- Not required for the registration approval rollout.
-- Run this only when setting up a fresh environment that does not yet have
-- the site_settings table.

create table public.site_settings (
id uuid not null default gen_random_uuid (),
key text not null,
value jsonb not null,
description text null,
category text null default 'general'::text,
updated_at timestamp with time zone null default now(),
constraint site_settings_pkey primary key (id),
constraint site_settings_key_key unique (key)
) TABLESPACE pg_default;

create trigger trg_site_settings_set_timestamp BEFORE
update on site_settings for EACH row
execute FUNCTION trigger_set_timestamp ();
