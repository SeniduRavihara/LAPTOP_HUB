-- Create reviews table
create table public.reviews (
  id uuid not null default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  constraint reviews_pkey primary key (id),
  constraint reviews_unique_user_product unique (user_id, product_id) -- One review per product per user
);

-- Enable Row Level Security
alter table public.reviews enable row level security;

-- Policies
create policy "Reviews are viewable by everyone"
  on public.reviews for select
  using ( true );

create policy "Authenticated users can create reviews"
  on public.reviews for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own reviews"
  on public.reviews for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own reviews"
  on public.reviews for delete
  using ( auth.uid() = user_id );

-- Updated_at trigger
create trigger handle_reviews_updated_at
  before update on public.reviews
  for each row
  execute procedure public.handle_updated_at();
