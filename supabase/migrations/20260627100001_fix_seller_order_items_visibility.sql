-- Create a policy that allows sellers to view order_items linked to products they own.
-- This ensures that when querying order_items with a join to products, the RLS policies don't block access.
CREATE POLICY "Sellers can view order items containing their products"
ON public.order_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.products p
    WHERE p.id = order_items.product_id
    AND p.seller_id = auth.uid()
  )
);
