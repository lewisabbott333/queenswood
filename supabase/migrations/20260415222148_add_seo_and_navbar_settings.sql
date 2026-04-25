/*
  # Add SEO and Navbar Colour Settings

  1. New Settings Added
    - `seo_site_name` — brand name used in title templates
    - `seo_default_description` — fallback meta description
    - `seo_og_image` — default Open Graph share image URL
    - `seo_twitter_handle` — Twitter/X handle e.g. @queenswood
    - `seo_google_site_verification` — Google Search Console verification code
    - `seo_canonical_base_url` — base canonical URL e.g. https://wearequeenswood.com
    - `nav_bg_color` — navbar background colour (hex) when scrolled
    - `nav_text_color` — navbar link text colour (hex)
    - `nav_accent_color` — navbar active/hover accent colour (hex)

  2. Security
    - Uses existing RLS on settings table (no changes needed)

  3. Notes
    - All values have safe empty defaults so they don't break the site if unset
    - Existing settings are unaffected
*/

INSERT INTO settings (key, value, updated_at)
VALUES
  ('seo_site_name',              'Queenswood Engagement',                           now()),
  ('seo_default_description',    'Queenswood is a specialist community and stakeholder engagement consultancy working exclusively within the UK infrastructure sector — from HS2 and National Highways to Thames Water and Crossrail.', now()),
  ('seo_og_image',               '',                                                now()),
  ('seo_twitter_handle',         '@queenswood',                                     now()),
  ('seo_google_site_verification','',                                               now()),
  ('seo_canonical_base_url',     'https://wearequeenswood.com',                    now()),
  ('nav_bg_color',               '#0d0f14',                                         now()),
  ('nav_text_color',             '#a8b2c1',                                         now()),
  ('nav_accent_color',           '#fff100',                                         now())
ON CONFLICT (key) DO NOTHING;
