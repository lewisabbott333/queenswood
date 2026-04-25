/*
  # Create Queenswood Engagement Database Schema

  1. New Tables:
    - `admin_users`: Administrator accounts (must be first for RLS policies)
    - `posts`: News and insights articles
    - `case_studies`: Project case studies
    - `enquiries`: Contact form submissions
    - `media_library`: Uploaded assets
    - `settings`: Site-wide configuration
    - `job_postings`: Career listings
    - `team_members`: Team bios and photos

  2. Security:
    - All tables have RLS enabled
    - Public reads on published content
    - Admin writes restricted to authenticated admins
    - Enquiries/media restricted to admins

  3. Data:
    - Initial seed data populated from live site
*/

-- Admin users table (must be created first)
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text DEFAULT 'editor',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid() AND au.role = 'super_admin'
  ));

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  body text NOT NULL,
  hero_image text,
  category text DEFAULT 'Insights',
  author text DEFAULT 'Queenswood Team',
  published_at timestamptz DEFAULT now(),
  meta_title text,
  meta_description text,
  og_image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published posts"
  ON posts FOR SELECT
  USING (published_at <= now());

CREATE POLICY "Only admins can insert posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role IN ('super_admin', 'editor')
  ));

CREATE POLICY "Only admins can update posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role IN ('super_admin', 'editor')
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role IN ('super_admin', 'editor')
  ));

-- Case studies table
CREATE TABLE IF NOT EXISTS case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  client text NOT NULL,
  sector text NOT NULL,
  hero_image text,
  summary text NOT NULL,
  body text NOT NULL,
  stats jsonb DEFAULT '{}',
  published_at timestamptz DEFAULT now(),
  meta_title text,
  meta_description text,
  og_image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published case studies"
  ON case_studies FOR SELECT
  USING (published_at <= now());

CREATE POLICY "Only admins can insert case studies"
  ON case_studies FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role IN ('super_admin', 'editor')
  ));

CREATE POLICY "Only admins can update case studies"
  ON case_studies FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role IN ('super_admin', 'editor')
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role IN ('super_admin', 'editor')
  ));

-- Enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  message text NOT NULL,
  subject text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read enquiries"
  ON enquiries FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Anyone can submit enquiries"
  ON enquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can update enquiries"
  ON enquiries FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  ));

-- Media library table
CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_type text,
  tags text[] DEFAULT '{}',
  uploaded_at timestamptz DEFAULT now()
);

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read media"
  ON media_library FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert media"
  ON media_library FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  ));

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role = 'super_admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role = 'super_admin'
  ));

-- Job postings table
CREATE TABLE IF NOT EXISTS job_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL,
  location text,
  department text,
  description text NOT NULL,
  salary text,
  active boolean DEFAULT true,
  posted_at timestamptz DEFAULT now(),
  meta_title text,
  meta_description text
);

ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active jobs"
  ON job_postings FOR SELECT
  USING (active = true);

CREATE POLICY "Only admins can manage jobs"
  ON job_postings FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role IN ('super_admin', 'editor')
  ));

CREATE POLICY "Only admins can update jobs"
  ON job_postings FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role IN ('super_admin', 'editor')
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role IN ('super_admin', 'editor')
  ));

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  image_url text,
  bio text,
  order_index integer
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read team members"
  ON team_members FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage team"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role = 'super_admin'
  ));

-- Insert initial settings
INSERT INTO settings (key, value) VALUES
  ('address_line1', '175-185 Grays Inn Road'),
  ('address_line2', 'London, WC1X 8UE'),
  ('phone', '+44 020 8058 9563'),
  ('email', 'hello@wearequeenswood.com'),
  ('tagline', 'Building Bridges'),
  ('copyright_year', '2026'),
  ('social_linkedin', 'https://linkedin.com/company/queenswood'),
  ('social_twitter', 'https://twitter.com/queenswood'),
  ('social_instagram', 'https://instagram.com/queenswood'),
  ('social_facebook', 'https://facebook.com/queenswood')
ON CONFLICT (key) DO NOTHING;

-- Insert initial posts
INSERT INTO posts (title, slug, excerpt, body, category, published_at, meta_title, meta_description)
VALUES (
  'Six Environmental Groups You Should Engage Early',
  'six-environmental-groups-you-should-engage-early',
  'How engagement with environmental groups builds more credible, deliverable infrastructure schemes.',
  'Environmental groups play a crucial role in infrastructure projects. Early engagement builds credibility and ensures sustainable outcomes.',
  'Insights',
  now(),
  'Environmental Engagement Strategy | Queenswood',
  'Learn how early engagement with environmental groups builds credibility for infrastructure projects'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert initial case studies
INSERT INTO case_studies (title, slug, client, sector, summary, body, published_at, meta_title, meta_description)
VALUES 
  ('National Highways Concrete Roads Programme', 'national-highways-concrete-roads', 'Sisk/National Highways', 'Transport', 'Comprehensive stakeholder engagement for a nationwide concrete roads improvement initiative.', 'The National Highways Concrete Roads Programme represents one of the most significant infrastructure modernization efforts in the UK. Our team provided extensive community and stakeholder engagement across multiple regions.', now(), 'National Highways Concrete Roads | Queenswood', 'Case study: Stakeholder engagement for National Highways concrete roads programme'),
  ('High Speed 2 Phase 1', 'hs2-phase-1', 'SCS JV, Align JV, EKFB JV', 'Transport', 'Strategic community engagement supporting HS2 Phase 1 development and delivery.', 'HS2 Phase 1 represented a transformational infrastructure project requiring unprecedented levels of community and stakeholder engagement.', now(), 'HS2 Phase 1 Engagement | Queenswood', 'Community engagement strategy for HS2 Phase 1 project'),
  ('High Speed 2 Phase 2b', 'hs2-phase-2b', 'Bechtel, HS2 Phase 2b Development Partner', 'Transport', 'Community engagement for HS2 Phase 2b development and environmental mitigation.', 'Building on the success of Phase 1, Phase 2b required sophisticated engagement strategies to address community concerns and environmental considerations.', now(), 'HS2 Phase 2b Engagement | Queenswood', 'Stakeholder engagement for HS2 Phase 2b development'),
  ('Old Street Roundabout Improvement', 'old-street-roundabout', 'Morgan Sindall / Transport for London', 'Transport', 'Public consultation and stakeholder management for a major London transport intersection upgrade.', 'The Old Street Roundabout project required careful coordination with multiple stakeholder groups and detailed public consultation.', now(), 'Old Street Roundabout | Queenswood', 'Transport engagement for Old Street roundabout improvement'),
  ('M621 Junctions 1-7 Improvement Scheme', 'm621-junctions', 'Keltbray / National Highways', 'Transport', 'Community and stakeholder engagement for major motorway junction improvements.', 'The M621 junctions scheme involved comprehensive engagement with local communities and business stakeholders throughout Yorkshire.', now(), 'M621 Junctions | Queenswood', 'Stakeholder engagement for M621 junction improvements'),
  ('Devon Bus Service Improvement Plan', 'devon-bus-simp', 'Devon County Council', 'Transport', 'Public consultation and engagement for regional bus service optimization.', 'The Devon BSIP represented an opportunity to reshape public transport connectivity across a diverse geographic area.', now(), 'Devon Bus Service Improvement | Queenswood', 'Public consultation for Devon bus service improvement plan'),
  ('Crossrail 2', 'crossrail-2', 'Transport for London', 'Transport', 'Strategic stakeholder engagement for London''s next major rail infrastructure project.', 'Crossrail 2 engagement required coordination across London boroughs, regional authorities, and diverse community stakeholder groups.', now(), 'Crossrail 2 Engagement | Queenswood', 'Stakeholder strategy for Crossrail 2 infrastructure project'),
  ('Thames Water Strategic Resource Options', 'thames-water-sro', 'Strategic Resource Options', 'Water', 'Community engagement for major water infrastructure strategy development.', 'Thames Water''s SRO programme required sophisticated engagement with environmental groups, business stakeholders, and affected communities.', now(), 'Thames Water Strategic Resources | Queenswood', 'Water infrastructure engagement for Thames Water SRO'),
  ('HS2 Phase 2a', 'hs2-phase-2a', 'Balfour Beatty', 'Transport', 'Comprehensive engagement for HS2 Phase 2a development and delivery.', 'Phase 2a built on established engagement foundations while addressing new geographic communities and stakeholder concerns.', now(), 'HS2 Phase 2a Engagement | Queenswood', 'Community engagement for HS2 Phase 2a project'),
  ('Lower Thames Crossing', 'lower-thames-crossing', 'CASCADE JV, Lower Thames Crossing Technical Partner', 'Transport', 'Strategic engagement for major Thames crossing infrastructure project.', 'The Lower Thames Crossing project represented one of the most complex multi-stakeholder engagement challenges in recent UK infrastructure development.', now(), 'Lower Thames Crossing | Queenswood', 'Stakeholder engagement for Lower Thames Crossing project')
ON CONFLICT (slug) DO NOTHING;

-- Insert team members
INSERT INTO team_members (name, role, order_index) VALUES
  ('Jack Day', 'Director', 1),
  ('Glenn Tobin', 'Senior Consultant', 2),
  ('David Eve', 'Consultant', 3),
  ('Patrick Kelly', 'Consultant', 4),
  ('Jill Williamson', 'Consultant', 5),
  ('Helen Cole', 'Consultant', 6),
  ('John Parrott', 'Consultant', 7),
  ('Katy Davies', 'Consultant', 8),
  ('Cher Snudden', 'Consultant', 9),
  ('Conor Loughney', 'Consultant', 10),
  ('Ruth Curtis', 'Consultant', 11),
  ('Clodagh Steel', 'Consultant', 12),
  ('Mayrum Gao', 'Consultant', 13),
  ('Lucas Avalo', 'Consultant', 14),
  ('Niamh Hughes', 'Consultant', 15),
  ('Emily Young', 'Consultant', 16),
  ('Siobhan Steel', 'Consultant', 17),
  ('Rachel Heptonstall', 'Consultant', 18),
  ('Rajeev (Raj) Soni', 'Consultant', 19),
  ('Naomi Evans', 'Consultant', 20),
  ('Raj Phillips', 'Consultant', 21)
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published_at);
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON job_postings(active);
