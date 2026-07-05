-- ============================================================
-- Publications: DOI reference (alternative to uploading a PDF)
-- Safe to run multiple times (idempotent).
-- ============================================================

-- Stores either a full DOI URL (https://doi.org/10.xxxx/yyyy) or a bare DOI
-- (10.xxxx/yyyy). The UI normalizes bare DOIs to a doi.org link when rendering.
ALTER TABLE publications ADD COLUMN IF NOT EXISTS doi TEXT;
