-- Drop the existing foreign key constraint referencing auth.users(id)
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_seller_id_fkey;

-- Add a new foreign key constraint referencing public.users(id)
ALTER TABLE public.products
ADD CONSTRAINT products_seller_id_fkey
FOREIGN KEY (seller_id)
REFERENCES public.users(id)
ON DELETE CASCADE;
