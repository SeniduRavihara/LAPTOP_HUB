-- Enable extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Add search_vector column
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create index for full-text search
CREATE INDEX IF NOT EXISTS products_search_idx ON public.products USING GIN (search_vector);

-- Create index for fuzzy name matching
CREATE INDEX IF NOT EXISTS products_name_trgm_idx ON public.products USING GIN (name gin_trgm_ops);

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.brand, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.specs->>'Processor', '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.specs->>'GPU', '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.specs->>'RAM', '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update search vector
DROP TRIGGER IF EXISTS update_product_search_vector_trigger ON public.products;
CREATE TRIGGER update_product_search_vector_trigger
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_product_search_vector();

-- Populate search_vector for existing rows
UPDATE public.products
SET search_vector = 
  setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(brand, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(specs->>'Processor', '')), 'B') ||
  setweight(to_tsvector('english', coalesce(specs->>'GPU', '')), 'B') ||
  setweight(to_tsvector('english', coalesce(specs->>'RAM', '')), 'B') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'C')
WHERE search_vector IS NULL;

-- Search function: Combines Full-Text Search (Keywords) + Trigram Search (Fuzzy Name)
DROP FUNCTION IF EXISTS search_products(text, text[], numeric, numeric);

CREATE OR REPLACE FUNCTION search_products(
  search_query text,
  filter_brands text[] DEFAULT NULL,
  min_price numeric DEFAULT NULL,
  max_price numeric DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  brand text,
  price numeric,
  original_price numeric,
  stock integer,
  images text[],
  specs jsonb,
  badge text,
  seller_id uuid,
  created_at timestamp with time zone,
  similarity_score real,
  auctions jsonb -- Added auction data
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.description,
    p.brand,
    p.price,
    p.original_price,
    p.stock,
    p.images,
    p.specs,
    p.badge,
    p.seller_id,
    p.created_at,
    (
      -- Combine Full-Text Rank + Name Similarity
      ts_rank(p.search_vector, websearch_to_tsquery('english', search_query)) +
      (similarity(p.name, search_query) * 0.5)
    )::real as similarity_score,
    (
      SELECT jsonb_agg(jsonb_build_object(
        'status', a.status,
        'starting_bid', a.starting_bid,
        'end_time', a.end_time,
        'bids', (SELECT jsonb_agg(jsonb_build_object('amount', b.amount)) FROM public.bids b WHERE b.auction_id = a.id)
      ))
      FROM public.auctions a
      WHERE a.product_id = p.id AND a.status = 'active'
    ) as auctions
  FROM
    public.products p
  WHERE
    (filter_brands IS NULL OR p.brand = ANY(filter_brands))
    AND (min_price IS NULL OR p.price >= min_price)
    AND (max_price IS NULL OR p.price <= max_price)
    AND (
      -- Match if valid Full-Text query OR Fuzzy Name Match > 0.1
      (p.search_vector @@ websearch_to_tsquery('english', search_query)) OR
      (similarity(p.name, search_query) > 0.1)
    )
  ORDER BY
    similarity_score DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
