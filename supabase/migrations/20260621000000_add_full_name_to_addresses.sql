-- Add full_name column to addresses table
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS full_name TEXT;
