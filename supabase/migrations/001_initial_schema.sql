-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  display_name text not null,
  bio text default '',
  home_city text default '',
  favorite_teams jsonb default '{}',
  created_at timestamptz default now()
);

-- Sports lookup
create table public.sports (
  id text primary key, -- 'NFL', 'MLB', 'NBA', 'NHL', 'MLS'
  name text not null
);

-- Teams
create table public.teams (
  id text primary key,
  sport_id text references public.sports(id),
  name text not null,
  city text not null,
  abbreviation text not null,
  primary_color text not null,
  slug text unique not null
);

-- Venues
create table public.venues (
  id text primary key,
  name text not null,
  slug text unique not null,
  city text not null,
  state text not null,
  sport_id text references public.sports(id),
  capacity integer
);

-- Games
create table public.games (
  id text primary key,
  home_team_id text references public.teams(id),
  away_team_id text references public.teams(id),
  venue_id text references public.venues(id),
  game_date date not null,
  home_score integer,
  away_score integer
);

-- Event logs
create table public.event_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  game_id text references public.games(id),
  attended_date date not null,
  game_rating integer check (game_rating between 1 and 5),
  overall integer check (overall between 1 and 5),
  atmosphere integer check (atmosphere between 1 and 5),
  crowd_energy integer check (crowd_energy between 1 and 5),
  seat_view_quality integer check (seat_view_quality between 1 and 5),
  food_drinks integer check (food_drinks between 1 and 5),
  entry_security integer check (entry_security between 1 and 5),
  bathrooms_lines integer check (bathrooms_lines between 1 and 5),
  parking_transit integer check (parking_transit between 1 and 5),
  value_for_money integer check (value_for_money between 1 and 5),
  review text default '',
  section text default '',
  created_at timestamptz default now()
);

-- Rankings
create table public.rankings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  description text default '',
  created_at timestamptz default now()
);

create table public.ranking_items (
  id uuid default uuid_generate_v4() primary key,
  ranking_id uuid references public.rankings(id) on delete cascade,
  rank integer not null,
  ref_id text not null,
  ref_type text check (ref_type in ('game', 'venue', 'team')),
  note text default ''
);

-- Want to attend
create table public.want_to_attend (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  team_id text references public.teams(id),
  venue_id text references public.venues(id),
  note text default '',
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.event_logs enable row level security;
alter table public.rankings enable row level security;
alter table public.ranking_items enable row level security;
alter table public.want_to_attend enable row level security;

-- Profiles: users can read all, only edit their own
create policy "Profiles are publicly readable" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- Event logs: public read, own write
create policy "Event logs are publicly readable" on public.event_logs for select using (true);
create policy "Users can insert their own logs" on public.event_logs for insert with check (auth.uid() = user_id);
create policy "Users can update their own logs" on public.event_logs for update using (auth.uid() = user_id);
create policy "Users can delete their own logs" on public.event_logs for delete using (auth.uid() = user_id);

-- Rankings: public read, own write
create policy "Rankings are publicly readable" on public.rankings for select using (true);
create policy "Users can manage their own rankings" on public.rankings for all using (auth.uid() = user_id);
create policy "Ranking items are publicly readable" on public.ranking_items for select using (true);
create policy "Users can manage their own ranking items" on public.ranking_items
  for all using (
    exists (select 1 from public.rankings r where r.id = ranking_id and r.user_id = auth.uid())
  );

-- Want to attend: own read/write only
create policy "Users can manage their own wishlist" on public.want_to_attend for all using (auth.uid() = user_id);

-- Trigger: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
