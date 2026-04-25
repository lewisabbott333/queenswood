import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  hero_image?: string;
  category: string;
  author: string;
  published_at: string;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  created_at: string;
  updated_at: string;
};

export type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  client: string;
  sector: string;
  hero_image?: string;
  summary: string;
  body: string;
  stats?: Record<string, any>;
  published_at: string;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  created_at: string;
  updated_at: string;
};

export type JobPosting = {
  id: string;
  title: string;
  type: string;
  location?: string;
  department?: string;
  description: string;
  salary?: string;
  active: boolean;
  posted_at: string;
  meta_title?: string;
  meta_description?: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image_url?: string;
  hover_image_url?: string;
  bio?: string;
  linkedin_url?: string;
  slug?: string;
  featured?: boolean;
  order_index?: number;
};

export type AdminInvite = {
  id: string;
  email: string;
  role: string;
  invited_by?: string;
  created_at: string;
  accepted_at?: string;
};

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  subject?: string;
  read: boolean;
  created_at: string;
};

export type Settings = {
  id: string;
  key: string;
  value: string;
  updated_at: string;
};
