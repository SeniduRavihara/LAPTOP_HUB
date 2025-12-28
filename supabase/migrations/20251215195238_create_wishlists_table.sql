-- Create wishlists table
create table public.wishlists (
  id uuid not null default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  
  constraint wishlists_pkey primary key (id),
  constraint wishlists_unique_user_product unique (user_id, product_id)
);

-- Enable Row Level Security
alter table public.wishlists enable row level security;

-- Policies
create policy "Users can view their own wishlist"
  on public.wishlists for select
  using ( auth.uid() = user_id );

create policy "Users can add to their own wishlist"
  on public.wishlists for insert
  with check ( auth.uid() = user_id );

create policy "Users can remove from their own wishlist"
  on public.wishlists for delete
  using ( auth.uid() = user_id );
