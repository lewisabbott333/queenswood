/*
  # Add Social Construct Presenter Image Setting

  1. Changes
    - Inserts a new settings row with key `social_construct_presenter_image`
    - Default value is empty string (falls back to "AT" initials display)

  2. Notes
    - Uses INSERT ... ON CONFLICT DO NOTHING to be safe if run multiple times
*/

INSERT INTO settings (key, value, updated_at)
VALUES ('social_construct_presenter_image', '', now())
ON CONFLICT (key) DO NOTHING;
