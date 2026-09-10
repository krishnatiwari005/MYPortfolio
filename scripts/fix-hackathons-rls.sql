-- ==============================================================================
-- FIX ROW-LEVEL SECURITY (RLS) FOR HACKATHONS TABLE
-- ==============================================================================
-- Run this in your Supabase Dashboard:
-- 1. Go to your Supabase Project Dashboard
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Paste the SQL below and click "Run"
-- ==============================================================================

-- 1. Make sure RLS is enabled on the hackathons table
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;

-- 2. Drop any existing conflicting policies on hackathons
DROP POLICY IF EXISTS "Public read hackathons" ON public.hackathons;
DROP POLICY IF EXISTS "Admin write hackathons" ON public.hackathons;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.hackathons;

-- 3. Policy: Allow anyone (visitors) to read/view hackathons
CREATE POLICY "Public read hackathons" 
ON public.hackathons 
FOR SELECT 
USING (true);

-- 4. Policy: Allow logged-in admin (authenticated users) to insert, update, and delete hackathons
CREATE POLICY "Admin write hackathons" 
ON public.hackathons 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
