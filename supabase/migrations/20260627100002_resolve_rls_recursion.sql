-- Create security definer helper functions to bypass RLS recursion
CREATE OR REPLACE FUNCTION public.is_order_seller(order_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.order_items oi
    JOIN public.products p ON oi.product_id = p.id
    WHERE oi.order_id = $1
    AND p.seller_id = $2
  );
$$;

CREATE OR REPLACE FUNCTION public.is_order_customer(order_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.orders
    WHERE id = $1
    AND customer_id = $2
  );
$$;

-- Drop recursive/problematic SELECT policies on orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Sellers can view orders containing their products" ON public.orders;

-- Create new SELECT policy on orders
CREATE POLICY "Sellers and customers can view orders"
ON public.orders
FOR SELECT
USING (
  auth.uid() = customer_id OR
  public.is_order_seller(id, auth.uid())
);

-- Drop recursive/problematic SELECT and INSERT policies on order_items
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Sellers can view order items containing their products" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;

-- Create new SELECT and INSERT policies on order_items
CREATE POLICY "Sellers and customers can view order items"
ON public.order_items
FOR SELECT
USING (
  public.is_order_customer(order_id, auth.uid()) OR
  public.is_order_seller(order_id, auth.uid())
);

CREATE POLICY "Users can insert their own order items"
ON public.order_items
FOR INSERT
WITH CHECK (
  public.is_order_customer(order_id, auth.uid())
);
