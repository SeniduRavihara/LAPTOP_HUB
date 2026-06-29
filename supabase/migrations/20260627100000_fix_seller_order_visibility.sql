-- Drop the overly restrictive policy
DROP POLICY IF EXISTS "Admins/Sellers can view all orders" ON public.orders;

-- Create a new policy that allows sellers to view orders containing their products
CREATE POLICY "Sellers can view orders containing their products"
ON public.orders
FOR SELECT
USING (
  auth.uid() = customer_id OR
  EXISTS (
    SELECT 1
    FROM public.order_items oi
    JOIN public.products p ON oi.product_id = p.id
    WHERE oi.order_id = orders.id
    AND p.seller_id = auth.uid()
  )
);
