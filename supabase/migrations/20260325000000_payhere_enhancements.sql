-- Add payment fields to orders table
-- Using DO block for safety and clearer feedback
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='payment_reference') THEN
        ALTER TABLE public.orders ADD COLUMN payment_reference TEXT UNIQUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='payhere_payment_id') THEN
        ALTER TABLE public.orders ADD COLUMN payhere_payment_id TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='customer_name') THEN
        ALTER TABLE public.orders ADD COLUMN customer_name TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='customer_email') THEN
        ALTER TABLE public.orders ADD COLUMN customer_email TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='contact_phone') THEN
        ALTER TABLE public.orders ADD COLUMN contact_phone TEXT;
    END IF;
END $$;

-- Create a function to generate human-readable order references
CREATE OR REPLACE FUNCTION generate_order_reference() 
RETURNS TRIGGER AS $$
DECLARE
    date_part TEXT;
    seq_part INT;
    new_ref TEXT;
BEGIN
    -- Only generate if not provided
    IF NEW.payment_reference IS NULL THEN
        date_part := to_char(now(), 'YYYYMMDD');
        
        -- Get the next sequence number for today
        -- We use a count-based approach for simplicity, but acknowledge it's not strictly thread-safe
        SELECT count(*) + 1 INTO seq_part 
        FROM public.orders 
        WHERE payment_reference LIKE 'ORD-' || date_part || '-%';
        
        new_ref := 'ORD-' || date_part || '-' || lpad(seq_part::text, 3, '0');
        NEW.payment_reference := new_ref;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate payment_reference on insert
DROP TRIGGER IF EXISTS tr_generate_order_reference ON public.orders;
CREATE TRIGGER tr_generate_order_reference
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION generate_order_reference();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_payment_reference ON public.orders(payment_reference);
