-- Create addresses table
create table if not exists public.addresses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  street_line_1 text not null,
  street_line_2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'Sri Lanka',
  landmark text,
  latitude numeric(10, 8),
  longitude numeric(11, 8),
  phone text,
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.addresses enable row level security;

-- Create policies
create policy "Users can view their own addresses." on public.addresses
  for select using (auth.uid() = user_id);

create policy "Users can insert their own addresses." on public.addresses
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own addresses." on public.addresses
  for update using (auth.uid() = user_id);

create policy "Users can delete their own addresses." on public.addresses
  for delete using (auth.uid() = user_id);

-- Create trigger for updated_at
create trigger handle_addresses_updated_at
  before update on public.addresses
  for each row execute procedure public.handle_updated_at();

-- Function to handle default address logic (ensure only one default per user)
create or replace function public.handle_default_address()
returns trigger as $$
begin
  if new.is_default then
    update public.addresses
    set is_default = false
    where user_id = new.user_id
    and id != new.id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for default address
create trigger on_address_default_update
  before insert or update on public.addresses
  for each row execute procedure public.handle_default_address();
