-- Drop the old function
DROP FUNCTION IF EXISTS search_products(text, text[], numeric, numeric);

-- Function to update search vector with new lowercase keys
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.brand, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.specs->>'processor', NEW.specs->>'Processor', '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.specs->>'gpu', NEW.specs->>'GPU', '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.specs->>'ram', NEW.specs->>'RAM', '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Search function: Combines Full-Text Search (Keywords) + Trigram Search (Fuzzy Name)
-- Added new array filters for processor, ram, storage, and gpu.
CREATE OR REPLACE FUNCTION search_products(
  search_query text,
  filter_brands text[] DEFAULT NULL,
  min_price numeric DEFAULT NULL,
  max_price numeric DEFAULT NULL,
  filter_processors text[] DEFAULT NULL,
  filter_rams text[] DEFAULT NULL,
  filter_storages text[] DEFAULT NULL,
  filter_gpus text[] DEFAULT NULL
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
  auctions jsonb
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
        'id', a.id,
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
    AND (filter_processors IS NULL OR (p.specs->>'processor' = ANY(filter_processors) OR p.specs->>'Processor' = ANY(filter_processors)))
    AND (filter_rams IS NULL OR (p.specs->>'ram' = ANY(filter_rams) OR p.specs->>'RAM' = ANY(filter_rams)))
    AND (filter_storages IS NULL OR (p.specs->>'storage' = ANY(filter_storages) OR p.specs->>'Storage' = ANY(filter_storages)))
    AND (filter_gpus IS NULL OR (p.specs->>'gpu' = ANY(filter_gpus) OR p.specs->>'GPU' = ANY(filter_gpus)))
    AND (
      -- Match if valid Full-Text query OR Fuzzy Name Match > 0.1
      (p.search_vector @@ websearch_to_tsquery('english', search_query)) OR
      (similarity(p.name, search_query) > 0.1)
    )
  ORDER BY
    similarity_score DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
