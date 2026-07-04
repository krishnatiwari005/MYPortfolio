-- ============================================================
-- Run this SQL in your Supabase Dashboard:
-- Go to: SQL Editor → New Query → Paste this → Run
-- ============================================================

-- Create the OTP codes table for custom admin authentication
CREATE TABLE IF NOT EXISTS admin_otp_codes (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email       TEXT        NOT NULL,
  code        TEXT        NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  used        BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (only service role can access this table)
ALTER TABLE admin_otp_codes ENABLE ROW LEVEL SECURITY;

-- No public access — only the server-side service role can read/write
-- (anon and authenticated users cannot access this table at all)
CREATE POLICY "No public access" ON admin_otp_codes
  FOR ALL
  TO public
  USING (false);

-- Index for fast lookup by email + used status
CREATE INDEX IF NOT EXISTS idx_admin_otp_codes_email 
  ON admin_otp_codes (email, used, expires_at);

-- Auto-cleanup: delete codes older than 1 hour to keep table clean
-- (Optional: set up a pg_cron job or just let the expiry check handle it)
