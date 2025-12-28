-- Create enum for auction status
create type public.auction_status as enum ('active', 'completed', 'cancelled');

-- Create auctions table
create table public.auctions (
  id uuid not null default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade not null,
  seller_id uuid references auth.users(id) on delete cascade not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  starting_bid numeric(10, 2) not null check (starting_bid >= 0),
  reserve_price numeric(10, 2), -- Optional minimum price to win
  status auction_status not null default 'active',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  -- Validation to ensure end_time is after start_time
  constraint auctions_dates_check check (end_time > start_time)
);

-- Create bids table
create table public.bids (
  id uuid not null default gen_random_uuid(),
  auction_id uuid references public.auctions(id) on delete cascade not null,
  bidder_id uuid references auth.users(id) on delete cascade not null,
  amount numeric(10, 2) not null check (amount > 0),
  created_at timestamp with time zone default now(),
  constraint bids_unique_amount_per_auction unique (auction_id, amount) -- Prevent duplicate bid amounts on same auction
);

-- Indexes for performance
create index auctions_product_id_idx on public.auctions(product_id);
create index auctions_seller_id_idx on public.auctions(seller_id);
create index auctions_status_end_time_idx on public.auctions(status, end_time);
create index bids_auction_id_amount_idx on public.bids(auction_id, amount desc);
create index bids_bidder_id_idx on public.bids(bidder_id);

-- Enable Row Level Security
alter table public.auctions enable row level security;
alter table public.bids enable row level security;

-- Policies for Auctions
create policy "Auctions are viewable by everyone"
  on public.auctions for select
  using ( true );

create policy "Sellers can create auctions for their products"
  on public.auctions for insert
  with check ( 
    auth.uid() = seller_id  -- Ensure the user creating the auction is the seller listed
    -- Ideally we also check if they own the product, but that requires a join which can be expensive in RLS.
    -- App logic should enforce product ownership.
  );

create policy "Sellers can update their own auctions"
  on public.auctions for update
  using ( auth.uid() = seller_id );

-- Policies for Bids
create policy "Bids are viewable by everyone"
  on public.bids for select
  using ( true );

create policy "Users can place bids"
  on public.bids for insert
  with check ( 
    auth.uid() = bidder_id 
    -- We will add a trigger to validate bid amount and auction status
  );

-- Function to handle updated_at for auctions
create trigger handle_auctions_updated_at
  before update on public.auctions
  for each row
  execute procedure public.handle_updated_at();

-- Trigger Function: Validate Bid
create or replace function public.validate_bid()
returns trigger as $$
declare
  auction_record record;
  current_max_bid numeric;
begin
  -- Get auction details
  select * into auction_record from public.auctions where id = new.auction_id;
  
  -- Check if auction exists and is active
  if auction_record.status != 'active' then
    raise exception 'Auction is not active';
  end if;

  -- Check if within time range
  if now() < auction_record.start_time then
     raise exception 'Auction has not started yet';
  end if;
  
  if now() > auction_record.end_time then
     raise exception 'Auction has ended';
  end if;

  -- Check against starting bid
  if new.amount < auction_record.starting_bid then
    raise exception 'Bid must be at least the starting bid of %', auction_record.starting_bid;
  end if;

  -- Check against current highest bid
  select max(amount) into current_max_bid from public.bids where auction_id = new.auction_id;
  
  if current_max_bid is not null and new.amount <= current_max_bid then
    raise exception 'Bid must be higher than the current highest bid of %', current_max_bid;
  end if;

  return new;
end;
$$ language plpgsql;

-- Register Trigger
create trigger check_bid_validity
  before insert on public.bids
  for each row
  execute procedure public.validate_bid();
