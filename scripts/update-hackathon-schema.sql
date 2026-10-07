-- Run this in your Supabase SQL Editor to add new fields to the hackathons table

ALTER TABLE hackathons ADD COLUMN IF NOT EXISTS project_name TEXT;
ALTER TABLE hackathons ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE hackathons ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE hackathons ADD COLUMN IF NOT EXISTS gallery_urls TEXT[] DEFAULT '{}';

-- Verify the changes
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'hackathons'
ORDER BY ordinal_position;