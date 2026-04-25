/*
  # Team Member Profiles & User Management

  ## Summary
  Extends the team_members table with richer profile fields and creates
  an admin_invites table for managing who can log in to the CMS.

  ## Changes to team_members
  - `bio` (text) - Full biography shown on individual profile page
  - `image_url` (text) - Primary photo URL
  - `hover_image_url` (text) - Secondary/hover photo URL (like the live site flip cards)
  - `linkedin_url` (text) - LinkedIn profile link
  - `slug` (text, unique) - URL-friendly identifier for profile pages
  - `featured` (boolean) - Whether to display prominently

  ## New Tables
  - `admin_invites` - Tracks invited CMS users with email and role
    so admins can invite others without needing direct DB access

  ## Security
  - admin_invites: RLS enabled, only admins can manage
  - team_members: existing RLS stays; new columns inherit existing policies
*/

-- Add missing columns to team_members
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'bio') THEN
    ALTER TABLE team_members ADD COLUMN bio text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'image_url') THEN
    ALTER TABLE team_members ADD COLUMN image_url text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'hover_image_url') THEN
    ALTER TABLE team_members ADD COLUMN hover_image_url text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'linkedin_url') THEN
    ALTER TABLE team_members ADD COLUMN linkedin_url text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'slug') THEN
    ALTER TABLE team_members ADD COLUMN slug text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'featured') THEN
    ALTER TABLE team_members ADD COLUMN featured boolean DEFAULT false;
  END IF;
END $$;

-- Create unique index on slug if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'team_members' AND indexname = 'team_members_slug_idx'
  ) THEN
    CREATE UNIQUE INDEX team_members_slug_idx ON team_members(slug) WHERE slug != '';
  END IF;
END $$;

-- Admin invites table
CREATE TABLE IF NOT EXISTS admin_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'editor',
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  accepted_at timestamptz
);

ALTER TABLE admin_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view invites"
  ON admin_invites FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid()))
  );

CREATE POLICY "Admins can insert invites"
  ON admin_invites FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid()))
  );

CREATE POLICY "Admins can update invites"
  ON admin_invites FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Admins can delete invites"
  ON admin_invites FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = (SELECT auth.uid()))
  );
