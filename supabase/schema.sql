-- Reset Database Schema for Projects
-- Run this in your Supabase SQL Editor to reset the projects table

-- 1. Drop existing table and policies (policies go with the table)
drop table if exists projects;

-- 2. Create the table
create table projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  current_phase text default 'ONBOARDING',
  data jsonb default '{}'::jsonb,
  name text
);

-- 3. Enable RLS
alter table projects enable row level security;

-- 4. Re-create policies
create policy "Users can view their own projects"
  on projects for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own projects"
  on projects for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own projects"
  on projects for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own projects"
  on projects for delete
  using ( auth.uid() = user_id );
