/*
  # Allow video uploads in media storage bucket

  ## Summary
  Updates the media storage bucket to allow video MIME types (mp4, webm, quicktime, ogg)
  in addition to the existing image types. This enables video uploads for shop products.

  ## Changes
  - Updates the `media` bucket `allowed_mime_types` to include video formats
  - No table changes, no RLS changes
*/

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/ogg'
]
WHERE id = 'media';
