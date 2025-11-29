-- Helper functions for role checking
-- These functions are used across multiple tables for RLS policies

-- Check if the current user is an admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.users
    where id = auth.uid()
    and role in ('admin', 'super_admin')
  );
end;
$$ language plpgsql security definer;

-- Check if the current user is a seller
create or replace function public.is_seller()
returns boolean as $$
begin
  return exists (
    select 1 from public.users
    where id = auth.uid()
    and role = 'seller'
  );
end;
$$ language plpgsql security definer;

-- Check if the current user is a customer
create or replace function public.is_customer()
returns boolean as $$
begin
  return exists (
    select 1 from public.users
    where id = auth.uid()
    and role = 'customer'
  );
end;
$$ language plpgsql security definer;
