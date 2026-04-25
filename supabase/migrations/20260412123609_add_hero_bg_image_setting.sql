/*
  # Add Hero Background Image Setting

  1. Changes
    - Inserts a new `hero_bg_image` key into the settings table with an empty default value.
    - Admins can set this to any image URL (e.g. from the media library) to use as the hero background.
    - If empty, the hero falls back to the animated particle canvas.

  2. Notes
    - No schema changes needed; the existing `settings` table supports arbitrary key/value pairs.
    - RLS policies already allow admins to upsert and public to read.
*/

INSERT INTO settings (key, value)
VALUES ('hero_bg_image', '')
ON CONFLICT (key) DO NOTHING;
