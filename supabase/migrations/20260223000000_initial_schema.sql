-- Migration setup for Karen Dictionary PWA

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: words
create table public.words (
  id uuid default uuid_generate_v4() primary key,
  karen_word text not null,
  korean_word text not null,
  romanization text,
  part_of_speech text,
  target_audience text check (target_audience in ('children', 'students', 'adults', 'all')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: media
create table public.media (
  id uuid default uuid_generate_v4() primary key,
  word_id uuid references public.words(id) on delete cascade,
  media_type text check (media_type in ('image', 'audio', 'video')),
  media_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: examples
create table public.examples (
  id uuid default uuid_generate_v4() primary key,
  word_id uuid references public.words(id) on delete cascade,
  karen_sentence text not null,
  korean_translation text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: relates
create table public.relates (
  id uuid default uuid_generate_v4() primary key,
  word_id uuid references public.words(id) on delete cascade,
  related_word_id uuid references public.words(id) on delete cascade,
  relation_type text check (relation_type in ('synonym', 'antonym')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint check_self_reference check (word_id != related_word_id)
);

-- Set up Row Level Security (RLS)
alter table public.words enable row level security;
alter table public.media enable row level security;
alter table public.examples enable row level security;
alter table public.relates enable row level security;

-- Create policies (For MVP data collection, allow open access. Later, lock this down with Auth)
create policy "Allow all actions on words" on public.words for all using (true);
create policy "Allow all actions on media" on public.media for all using (true);
create policy "Allow all actions on examples" on public.examples for all using (true);
create policy "Allow all actions on relates" on public.relates for all using (true);
