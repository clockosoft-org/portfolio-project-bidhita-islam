-- ============================================================
-- CV storage: PRIVATE bucket + profiles.cv_path column
-- Safe to run multiple times (idempotent).
--
-- The bucket is private: no public read. Public downloads are
-- served through the /api/cv route which mints a short-lived
-- signed URL with the service-role key. The authenticated admin
-- can read (to preview) via the authenticated SELECT policy.
-- ============================================================

-- 1) Store the object PATH of the uploaded CV (e.g. "cv-1717000000000.pdf")
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cv_path TEXT;

-- 2) Create a PRIVATE bucket for CV files.
--    file_size_limit = 20 MB, allowed = PDF + Word docs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cv-files',
  'cv-files',
  false,
  20971520,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 3) RLS policies: authenticated read/write ONLY (no public/anon access).
--    Signed public downloads go through the service role, which bypasses RLS.
DO $$
DECLARE
  b TEXT := 'cv-files';
BEGIN
  -- Authenticated read (admin preview / signed-url generation)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = b || '_auth_read'
  ) THEN
    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR SELECT USING (bucket_id = %L AND auth.uid() IS NOT NULL)',
      b || '_auth_read', b
    );
  END IF;

  -- Authenticated upload
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = b || '_auth_insert'
  ) THEN
    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR INSERT WITH CHECK (bucket_id = %L AND auth.uid() IS NOT NULL)',
      b || '_auth_insert', b
    );
  END IF;

  -- Authenticated update
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = b || '_auth_update'
  ) THEN
    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR UPDATE USING (bucket_id = %L AND auth.uid() IS NOT NULL)',
      b || '_auth_update', b
    );
  END IF;

  -- Authenticated delete
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = b || '_auth_delete'
  ) THEN
    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR DELETE USING (bucket_id = %L AND auth.uid() IS NOT NULL)',
      b || '_auth_delete', b
    );
  END IF;
END $$;
