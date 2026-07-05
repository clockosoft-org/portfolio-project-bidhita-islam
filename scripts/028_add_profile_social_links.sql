-- ============================================================
-- Additional profile social / academic links
-- Safe to run multiple times (idempotent).
-- ============================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS google_scholar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS orcid_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS x_url TEXT;
