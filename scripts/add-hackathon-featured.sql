-- ============================================================
-- SQL Migration: Add 'is_featured' to Hackathons Table
-- Run this in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run (Ctrl+Enter)
-- ============================================================

ALTER TABLE hackathons ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Verification:
SELECT id, title, is_featured FROM hackathons;
