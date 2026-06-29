-- Create payment method enum
DO $$ BEGIN
    CREATE TYPE public.payment_method AS ENUM ('online', 'cod');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add payment_method to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_method public.payment_method NOT NULL DEFAULT 'online';

-- Add comment
COMMENT ON COLUMN public.orders.payment_method IS 'The method used for payment: online (PayHere) or cod (Cash on Delivery)';
