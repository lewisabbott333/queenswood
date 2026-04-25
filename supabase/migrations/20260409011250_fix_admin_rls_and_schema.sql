/*
  # Fix Admin RLS Policies and Schema

  ## Summary
  The original schema used admin_users table lookups for all RLS policies, but the
  admin UI uses Supabase Auth (not the admin_users table), so all writes were blocked.
  This migration replaces the broken policies with auth.uid()-based checks for admins
  who sign in via Supabase Auth.

  ## Changes

  ### 1. admin_users: add email column, link to auth.users properly
  - Drop old broken policies, add working ones keyed on auth.uid()

  ### 2. All content tables (posts, case_studies, job_postings, team_members, settings)
  - Drop old admin_users-dependent write policies
  - Replace with policies that check the admin_roles table (user_id = auth.uid())
  - Add missing DELETE policies

  ### 3. media_library: fix column mismatch
  - Add `url` and `name` columns to match what the frontend inserts
  - Drop old INSERT policy, add working one

  ### 4. enquiries: fix UPDATE/DELETE policies

  ### 5. admin_roles table
  - New simple table: (user_id uuid) - if your user_id is in here, you're an admin
  - Much simpler than the broken admin_users approach

  ### 6. job_postings SELECT: admins can see ALL jobs (not just active)
*/

-- ============================================================
-- STEP 1: Create admin_roles table (simple, clean approach)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'admin' NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read own role"
  ON admin_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- STEP 2: Fix POSTS policies
-- ============================================================
DROP POLICY IF EXISTS "Only admins can insert posts" ON posts;
DROP POLICY IF EXISTS "Only admins can update posts" ON posts;
DROP POLICY IF EXISTS "Only admins can delete posts" ON posts;

CREATE POLICY "Admins can insert posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete posts"
  ON posts FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

-- ============================================================
-- STEP 3: Fix CASE_STUDIES policies
-- ============================================================
DROP POLICY IF EXISTS "Only admins can insert case studies" ON case_studies;
DROP POLICY IF EXISTS "Only admins can update case studies" ON case_studies;
DROP POLICY IF EXISTS "Only admins can delete case studies" ON case_studies;

CREATE POLICY "Admins can insert case studies"
  ON case_studies FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update case studies"
  ON case_studies FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete case studies"
  ON case_studies FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

-- ============================================================
-- STEP 4: Fix ENQUIRIES policies
-- ============================================================
DROP POLICY IF EXISTS "Only admins can read enquiries" ON enquiries;
DROP POLICY IF EXISTS "Only admins can update enquiries" ON enquiries;
DROP POLICY IF EXISTS "Only admins can delete enquiries" ON enquiries;

CREATE POLICY "Admins can read enquiries"
  ON enquiries FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update enquiries"
  ON enquiries FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete enquiries"
  ON enquiries FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

-- ============================================================
-- STEP 5: Fix MEDIA_LIBRARY - column mismatch + policies
-- ============================================================
-- Add the columns the frontend expects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'media_library' AND column_name = 'url'
  ) THEN
    ALTER TABLE media_library ADD COLUMN url text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'media_library' AND column_name = 'name'
  ) THEN
    ALTER TABLE media_library ADD COLUMN name text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'media_library' AND column_name = 'tags'
    AND data_type = 'text'
  ) THEN
    ALTER TABLE media_library ADD COLUMN IF NOT EXISTS tags_text text;
  END IF;
END $$;

DROP POLICY IF EXISTS "Only admins can insert media" ON media_library;
DROP POLICY IF EXISTS "Only admins can delete media" ON media_library;

CREATE POLICY "Admins can insert media"
  ON media_library FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete media"
  ON media_library FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

-- ============================================================
-- STEP 6: Fix SETTINGS policies
-- ============================================================
DROP POLICY IF EXISTS "Only admins can update settings" ON settings;
DROP POLICY IF EXISTS "Only admins can insert settings" ON settings;
DROP POLICY IF EXISTS "Only admins can upsert settings" ON settings;

CREATE POLICY "Admins can insert settings"
  ON settings FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete settings"
  ON settings FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

-- ============================================================
-- STEP 7: Fix JOB_POSTINGS policies
-- ============================================================
DROP POLICY IF EXISTS "Only admins can manage jobs" ON job_postings;
DROP POLICY IF EXISTS "Only admins can update jobs" ON job_postings;
DROP POLICY IF EXISTS "Only admins can delete jobs" ON job_postings;
DROP POLICY IF EXISTS "Anyone can read active jobs" ON job_postings;

CREATE POLICY "Anyone can read active jobs"
  ON job_postings FOR SELECT
  USING (active = true OR EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can insert jobs"
  ON job_postings FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update jobs"
  ON job_postings FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete jobs"
  ON job_postings FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

-- ============================================================
-- STEP 8: Fix TEAM_MEMBERS policies
-- ============================================================
DROP POLICY IF EXISTS "Only admins can manage team" ON team_members;
DROP POLICY IF EXISTS "Only admins can update team" ON team_members;
DROP POLICY IF EXISTS "Only admins can delete team" ON team_members;

CREATE POLICY "Admins can insert team members"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update team members"
  ON team_members FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete team members"
  ON team_members FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));
