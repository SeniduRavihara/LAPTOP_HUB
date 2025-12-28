-- Create products table
create table public.products (
  id uuid not null default gen_random_uuid(),
  name text not null,
  description text,
  brand text,
  price numeric(10, 2) not null,
  original_price numeric(10, 2),
  stock integer not null default 0,
  images text[] default array[]::text[],
  specs jsonb default '{}'::jsonb,
  badge text,
  seller_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint products_pkey primary key (id)
);

-- Enable Row Level Security
alter table public.products enable row level security;

-- Create policies
create policy "Public products are viewable by everyone"
  on public.products for select
  using ( true );

create policy "Sellers can create products"
  on public.products for insert
  with check ( auth.uid() = seller_id );

create policy "Sellers can update their own products"
  on public.products for update
  using ( auth.uid() = seller_id );

create policy "Sellers can delete their own products"
  on public.products for delete
  using ( auth.uid() = seller_id );

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_products_updated_at
  before update on public.products
  for each row
  execute procedure public.handle_updated_at();
