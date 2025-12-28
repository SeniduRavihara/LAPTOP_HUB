-- Create enum types for order and payment status
create type public.order_status as enum ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');

-- Create orders table
create table public.orders (
  id uuid not null default gen_random_uuid(),
  customer_id uuid references auth.users(id) on delete set null,
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  currency text not null default 'USD',
  status order_status not null default 'pending',
  payment_status payment_status not null default 'pending',
  shipping_address jsonb not null,
  billing_address jsonb,
  payment_intent_id text, -- For Stripe or similar
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint orders_pkey primary key (id)
);

-- Create order items table
create table public.order_items (
  id uuid not null default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0), -- Price at time of purchase
  total_price numeric(10, 2) not null check (total_price >= 0), -- quantity * unit_price
  selected_options jsonb, -- For variants like color, size, etc.
  created_at timestamp with time zone default now(),
  constraint order_items_pkey primary key (id)
);

-- Enable Row Level Security
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies for Orders
create policy "Users can view their own orders"
  on public.orders for select
  using ( auth.uid() = customer_id );

create policy "Users can create their own orders"
  on public.orders for insert
  with check ( auth.uid() = customer_id );

create policy "Admins/Sellers can view all orders"
  on public.orders for select
  using ( 
    -- Assuming a function or RBAC, but simplified for now:
    -- Sellers need to see orders containing their products.
    -- This is complex with RLS alone on the parent table. 
    -- For now, restricting to customer.
    auth.uid() = customer_id 
  );

-- Policies for Order Items
create policy "Users can view their own order items"
  on public.order_items for select
  using ( 
    exists ( 
      select 1 from public.orders 
      where orders.id = order_items.order_id 
      and orders.customer_id = auth.uid() 
    ) 
  );

create policy "Users can insert their own order items"
  on public.order_items for insert
  with check ( 
    exists ( 
      select 1 from public.orders 
      where orders.id = order_items.order_id 
      and orders.customer_id = auth.uid() 
    ) 
  );

-- Create updated_at trigger for orders
create trigger handle_orders_updated_at
  before update on public.orders
  for each row
  execute procedure public.handle_updated_at();
