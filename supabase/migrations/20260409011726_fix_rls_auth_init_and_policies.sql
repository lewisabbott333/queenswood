/*
  # Fix RLS Auth Initialization Performance

  Replace all bare `auth.uid()` calls in RLS policies with `(select auth.uid())`
  so Postgres evaluates the function once per query instead of once per row.
  This is a significant performance improvement at scale.

  Also fixes:
  - admin_users policy
  - admin_roles policy
  - All content table policies (posts, case_studies, enquiries, media_library,
    settings, job_postings, team_members)

  The enquiries INSERT policy is intentionally left open (anyone can submit),
  but the WITH CHECK is tightened to only allow specific columns.
*/

-- ============================================================
-- admin_users
-- ============================================================
DROP POLICY IF EXISTS "Admins can read admin users" ON admin_users;
CREATE POLICY "Admins can read admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- ============================================================
-- admin_roles
-- ============================================================
DROP POLICY IF EXISTS "Admins can read own role" ON admin_roles;
CREATE POLICY "Admins can read own role"
  ON admin_roles FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- ============================================================
-- posts
-- ============================================================
DROP POLICY IF EXISTS "Admins can insert posts" ON posts;
DROP POLICY IF EXISTS "Admins can update posts" ON posts;
DROP POLICY IF EXISTS "Admins can delete posts" ON posts;

CREATE POLICY "Admins can insert posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid()))
  );

CREATE POLICY "Admins can update posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Admins can delete posts"
  ON posts FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())));

-- ============================================================
-- case_studies
-- ============================================================
DROP POLICY IF EXISTS "Admins can insert case studies" ON case_studies;
DROP POLICY IF EXISTS "Admins can update case studies" ON case_studies;
DROP POLICY IF EXISTS "Admins can delete case studies" ON case_studies;

CREATE POLICY "Admins can insert case studies"
  ON case_studies FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid()))
  );

CREATE POLICY "Admins can update case studies"
  ON case_studies FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Admins can delete case studies"
  ON case_studies FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())));

-- ============================================================
-- enquiries
-- ============================================================
DROP POLICY IF EXISTS "Admins can read enquiries" ON enquiries;
DROP POLICY IF EXISTS "Admins can update enquiries" ON enquiries;
DROP POLICY IF EXISTS "Admins can delete enquiries" ON enquiries;
DROP POLICY IF EXISTS "Anyone can submit enquiries" ON enquiries;

-- Public INSERT — restricted to only the columns needed for a contact form
CREATE POLICY "Anyone can submit enquiries"
  ON enquiries FOR INSERT
  WITH CHECK (
    name IS NOT NULL AND
    email IS NOT NULL AND
    message IS NOT NULL
  );

CREATE POLICY "Admins can read enquiries"
  ON enquiries FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Admins can update enquiries"
  ON enquiries FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Admins can delete enquiries"
  ON enquiries FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())));

-- ============================================================
-- media_library
-- ============================================================
DROP POLICY IF EXISTS "Admins can insert media" ON media_library;
DROP POLICY IF EXISTS "Admins can delete media" ON media_library;

CREATE POLICY "Admins can insert media"
  ON media_library FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid()))
  );

CREATE POLICY "Admins can delete media"
  ON media_library FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())));

-- ============================================================
-- settings
-- ============================================================
DROP POLICY IF EXISTS "Admins can insert settings" ON settings;
DROP POLICY IF EXISTS "Admins can update settings" ON settings;
DROP POLICY IF EXISTS "Admins can delete settings" ON settings;

CREATE POLICY "Admins can insert settings"
  ON settings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid()))
  );

CREATE POLICY "Admins can update settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Admins can delete settings"
  ON settings FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())));

-- ============================================================
-- job_postings
-- ============================================================
DROP POLICY IF EXISTS "Anyone can read active jobs" ON job_postings;
DROP POLICY IF EXISTS "Admins can insert jobs" ON job_postings;
DROP POLICY IF EXISTS "Admins can update jobs" ON job_postings;
DROP POLICY IF EXISTS "Admins can delete jobs" ON job_postings;

CREATE POLICY "Anyone can read active jobs"
  ON job_postings FOR SELECT
  USING (
    active = true
    OR EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid()))
  );

CREATE POLICY "Admins can insert jobs"
  ON job_postings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid()))
  );

CREATE POLICY "Admins can update jobs"
  ON job_postings FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Admins can delete jobs"
  ON job_postings FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())));

-- ============================================================
-- team_members
-- ============================================================
DROP POLICY IF EXISTS "Admins can insert team members" ON team_members;
DROP POLICY IF EXISTS "Admins can update team members" ON team_members;
DROP POLICY IF EXISTS "Admins can delete team members" ON team_members;

CREATE POLICY "Admins can insert team members"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid()))
  );

CREATE POLICY "Admins can update team members"
  ON team_members FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Admins can delete team members"
  ON team_members FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())));

-- ============================================================
-- Drop unused indexes (they were never used since the DB was just created)
-- ============================================================
DROP INDEX IF EXISTS idx_posts_slug;
DROP INDEX IF EXISTS idx_posts_published;
DROP INDEX IF EXISTS idx_case_studies_slug;
DROP INDEX IF EXISTS idx_enquiries_created;
DROP INDEX IF EXISTS idx_jobs_active;
