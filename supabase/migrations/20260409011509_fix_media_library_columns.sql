/*
  # Fix media_library table columns

  The frontend inserts records with: name, url, tags (text), created_at
  The original schema had: file_name, file_url, tags (text[]), uploaded_at

  This migration ensures the columns the frontend uses exist with correct types.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'media_library' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE media_library ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'media_library' AND column_name = 'tags'
    AND data_type = 'text' AND udt_name = 'text'
  ) THEN
    ALTER TABLE media_library ADD COLUMN IF NOT EXISTS tags_str text;
  END IF;
END $$;

ALTER TABLE media_library ALTER COLUMN url DROP NOT NULL;
ALTER TABLE media_library ALTER COLUMN name DROP NOT NULL;
