-- =====================================================
-- S.M.D. & C.A.C. — Wedding site Supabase schema
-- Run this in the Supabase SQL editor
-- =====================================================

-- RSVP / Guests table
-- attending: NULL = pending (not yet responded), TRUE = oui, FALSE = non
-- responded_at: when the guest clicked oui/non (null while pending)
create table if not exists public.rsvp (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  attending     boolean null,
  token         uuid not null default gen_random_uuid() unique,
  arrived       boolean not null default false,
  responded_at  timestamptz null,
  created_at    timestamptz not null default now()
);

-- Migration for existing databases:
alter table public.rsvp alter column attending drop not null;
alter table public.rsvp add column if not exists responded_at timestamptz null;

-- Wishes wall
create table if not exists public.wishes (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  message     text not null,
  hearts      int  not null default 0,
  created_at  timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.rsvp   enable row level security;
alter table public.wishes enable row level security;

-- Public can insert RSVP and read by token (for /checkin)
drop policy if exists "rsvp_insert_anon"  on public.rsvp;
drop policy if exists "rsvp_select_anon"  on public.rsvp;
create policy "rsvp_insert_anon" on public.rsvp for insert with check (true);
create policy "rsvp_select_anon" on public.rsvp for select using (true);
-- Admin updates (arrived) happen with the anon key from the admin pages.
-- For production, create a service_role-protected route instead.
drop policy if exists "rsvp_update_anon" on public.rsvp;
create policy "rsvp_update_anon" on public.rsvp for update using (true) with check (true);

-- Public can read & insert wishes; updates (hearts) and deletes (admin moderation) allowed
drop policy if exists "wishes_select_anon" on public.wishes;
drop policy if exists "wishes_insert_anon" on public.wishes;
drop policy if exists "wishes_update_anon" on public.wishes;
drop policy if exists "wishes_delete_anon" on public.wishes;
create policy "wishes_select_anon" on public.wishes for select using (true);
create policy "wishes_insert_anon" on public.wishes for insert with check (true);
create policy "wishes_update_anon" on public.wishes for update using (true) with check (true);
create policy "wishes_delete_anon" on public.wishes for delete using (true);

-- Realtime publication
alter publication supabase_realtime add table public.rsvp;
alter publication supabase_realtime add table public.wishes;
