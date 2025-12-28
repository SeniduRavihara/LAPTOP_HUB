-- Create payments table
create table public.payments (
  id uuid not null default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete restrict not null,
  user_id uuid references auth.users(id) on delete set null,
  amount numeric(10, 2) not null check (amount >= 0),
  currency text not null default 'USD',
  provider text not null, -- e.g., 'stripe', 'paypal'
  method text, -- e.g., 'credit_card', 'bank_transfer'
  status payment_status not null default 'pending', -- Uses existing enum
  transaction_id text, -- External Reference ID
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  constraint payments_pkey primary key (id)
);

-- Index for looking up payments by order or transaction
create index payments_order_id_idx on public.payments(order_id);
create index payments_user_id_idx on public.payments(user_id);
create index payments_transaction_id_idx on public.payments(transaction_id);

-- Enable Row Level Security
alter table public.payments enable row level security;

-- Policies
create policy "Users can view their own payments"
  on public.payments for select
  using ( auth.uid() = user_id );

-- Normally payments are inserted by server-side processes (webhooks), 
-- but if we allow client creation for initiation:
create policy "Users can initiate payments"
  on public.payments for insert
  with check ( auth.uid() = user_id );

-- Trigger for updated_at
create trigger handle_payments_updated_at
  before update on public.payments
  for each row
  execute procedure public.handle_updated_at();
