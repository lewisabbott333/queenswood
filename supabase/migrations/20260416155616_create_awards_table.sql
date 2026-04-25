/*
  # Create Awards Table

  ## Summary
  Creates a new `awards` table to allow admins to manage award entries displayed on the About Us and Home pages.

  ## New Tables
  - `awards`
    - `id` (uuid, primary key)
    - `event_name` (text) - e.g. "HS2 Inspiration Awards 2022"
    - `title` (text) - e.g. "Outstanding Community & Stakeholder Engagement"
    - `description` (text) - body copy for the award card
    - `image_url` (text, nullable) - optional award badge/logo image
    - `order_index` (int) - display order
    - `active` (boolean) - whether to show on site
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled
  - Public can SELECT active awards
  - Authenticated admins can INSERT, UPDATE, DELETE
*/

CREATE TABLE IF NOT EXISTS awards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url text,
  order_index int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE awards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active awards"
  ON awards FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can insert awards"
  ON awards FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can update awards"
  ON awards FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can delete awards"
  ON awards FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid())
  );

-- Seed with existing awards
INSERT INTO awards (event_name, title, description, order_index, active) VALUES
(
  'HS2 Inspiration Awards 2022',
  'Outstanding Community & Stakeholder Engagement',
  'Recognised for outstanding work leading innovative engagement and communication with the HS2 project, setting new standards for community liaison on major infrastructure programmes.',
  1,
  true
),
(
  'Digital Consultancy Awards 2024',
  'Digital Consultancy of the Year',
  'Demonstrating excellence in the adoption of digital processes and technologies, transforming how engagement services are delivered across complex infrastructure programmes.',
  2,
  true
);
