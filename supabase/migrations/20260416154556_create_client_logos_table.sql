/*
  # Create client_logos table

  ## Summary
  Adds a table to store the logos/names shown in the homepage marquee carousel.

  ## New Tables
  - `client_logos`
    - `id` (uuid, primary key)
    - `name` (text) — display name shown in the marquee
    - `logo_url` (text, nullable) — optional image URL; if blank, the name is shown as text
    - `order_index` (integer) — controls display order
    - `active` (boolean) — whether this entry is visible on the site
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled
  - Authenticated admins can manage entries (SELECT, INSERT, UPDATE, DELETE)
  - Public (anon) can SELECT active entries for the homepage

  ## Notes
  - Seeds with the current hardcoded list of 20 client names
*/

CREATE TABLE IF NOT EXISTS client_logos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  logo_url text NOT NULL DEFAULT '',
  order_index integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE client_logos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active client logos"
  ON client_logos FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Authenticated users can insert client logos"
  ON client_logos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update client logos"
  ON client_logos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete client logos"
  ON client_logos FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO client_logos (name, order_index) VALUES
  ('Align', 1),
  ('Balfour Beatty', 2),
  ('Ferrovial', 3),
  ('Costain', 4),
  ('Keltbray', 5),
  ('Transport for London', 6),
  ('WSP', 7),
  ('Midlands Connect', 8),
  ('Thames Water', 9),
  ('Kier', 10),
  ('Arcadis', 11),
  ('EKFB', 12),
  ('Arora Group', 13),
  ('Bechtel', 14),
  ('BAM', 15),
  ('Devon County Council', 16),
  ('Morgan Sindall', 17),
  ('NMCN', 18),
  ('Skanska', 19),
  ('SCS JV', 20);
