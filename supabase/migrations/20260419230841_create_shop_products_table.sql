/*
  # Create shop_products table

  ## Summary
  Creates a table to store the Engagement Shop product listings, allowing admins
  to manage video URLs (and other metadata) for each shop item.

  ## New Tables

  ### shop_products
  - `id` (uuid, primary key)
  - `slug` (text, unique) — matches the hardcoded slug used in the frontend
  - `title` (text) — product display title
  - `tagline` (text) — one-line description shown under the title
  - `description` (text) — longer body copy
  - `video_url` (text, nullable) — URL of an uploaded promo/showcase video
  - `order_index` (int) — controls display order
  - `active` (bool) — show/hide on public page
  - `created_at`, `updated_at` (timestamptz)

  ## Security
  - RLS enabled
  - Public SELECT for active products (anon + authenticated)
  - INSERT / UPDATE / DELETE restricted to authenticated admins via admin_roles
*/

CREATE TABLE IF NOT EXISTS shop_products (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text UNIQUE NOT NULL,
  title        text NOT NULL DEFAULT '',
  tagline      text NOT NULL DEFAULT '',
  description  text NOT NULL DEFAULT '',
  video_url    text,
  order_index  integer NOT NULL DEFAULT 0,
  active       boolean NOT NULL DEFAULT true,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE shop_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active shop products"
  ON shop_products FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins can insert shop products"
  ON shop_products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can update shop products"
  ON shop_products FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete shop products"
  ON shop_products FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

INSERT INTO shop_products (slug, title, tagline, description, order_index) VALUES
  ('road-work-visualisations',
   'Road Work Visualisations',
   'Visualise and understand upcoming road works and their impacts.',
   'With effective graphic visualisations you can present forthcoming road works and their impacts. We create concise, easy-to-understand visualisations that can be shared widely on social media and used in internal and external presentations.',
   1),
  ('construction-work-visuals',
   'Construction Work Visuals',
   'Visualise your upcoming construction works, making it easier for local residents and stakeholders to understand them.',
   'From site setup diagrams to phased construction timelines, our clear, engaging graphics make complex information accessible — helping communities plan around disruption and reducing anxiety about upcoming works.',
   2),
  ('drone-footage-graphics',
   'Drone Footage Graphics (or Drone Hire)',
   'Bring your site drone footage alive and tell the story of your project.',
   'We overlay key information onto aerial footage to create compelling communication materials. Professional graphics and annotations transform raw drone footage into powerful engagement assets.',
   3),
  ('noise-impact-animations',
   'Noise Impact Animations',
   'Visualise the noise impact from construction sites by demonstrating how loud certain activities are.',
   'Help communities understand where and when noise will be an issue. Our data-driven animations demonstrate your mitigation measures and provide transparent, clear communication around noise-generating works.',
   4),
  ('maps-graphs-exhibition-graphics',
   'Maps, Graphs, or Other Exhibition Graphics',
   'No more snipping from Google Maps! Create bespoke and visually pleasing work site maps.',
   'From A-board displays to interactive digital screens, we produce bespoke maps, charts, and exhibition materials that inform and impress — all tailored to your project and brand.',
   5),
  ('letters-engagement-plans',
   'Letters, Engagement Plans, or Other Types of Correspondence Written',
   'Need a letter quickly drafted for some upcoming works?',
   'Letters, engagement plans, and all types of correspondence written by engagement specialists. Clear, professional, and effective communication materials that meet regulatory standards and resonate with communities.',
   6)
ON CONFLICT (slug) DO NOTHING;
