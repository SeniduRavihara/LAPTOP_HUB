-- Create messages table for C2C user-to-user/buyer-to-seller chat
create table public.messages (
  id uuid not null default gen_random_uuid() primary key,
  sender_id uuid references auth.users(id) on delete cascade not null,
  receiver_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  content text not null,
  is_read boolean not null default false,
  created_at timestamp with time zone default now()
);

-- Indexing for performance
create index messages_sender_id_idx on public.messages(sender_id);
create index messages_receiver_id_idx on public.messages(receiver_id);
create index messages_product_id_idx on public.messages(product_id);
create index messages_created_at_idx on public.messages(created_at desc);

-- Enable RLS
alter table public.messages enable row level security;

-- Policies for Messages
create policy "Users can view messages they sent or received"
  on public.messages for select
  using ( auth.uid() = sender_id or auth.uid() = receiver_id );

create policy "Users can insert messages as themselves"
  on public.messages for insert
  with check ( auth.uid() = sender_id );

create policy "Receivers can update message read status"
  on public.messages for update
  using ( auth.uid() = receiver_id )
  with check ( auth.uid() = receiver_id );
