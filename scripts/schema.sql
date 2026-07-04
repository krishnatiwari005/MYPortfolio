-- Database initialization schema for Personal Portfolio CMS

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Hero (singleton table, enforced by a rule or primary key)
create table if not exists hero (
  id bool primary key default true,
  name text not null default 'Jane Doe',
  role text not null default 'Full Stack Developer',
  tagline text not null default 'Building robust, elegant digital experiences.',
  photo_url text,
  available boolean not null default true,
  availability_label text not null default 'Available for work',
  github_url text,
  linkedin_url text,
  twitter_url text,
  email text,
  leetcode_url text,
  portfolio_url text,
  stat_1_label text,
  stat_1_value text,
  stat_2_label text,
  stat_2_value text,
  stat_3_label text,
  stat_3_value text,
  stat_4_label text,
  stat_4_value text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint hero_singleton check (id = true)
);

-- 2. About (singleton table)
create table if not exists about (
  id bool primary key default true,
  bio text not null default '<p>Tell us about yourself.</p>',
  education text not null default 'B.S. Computer Science',
  location text not null default 'San Francisco, CA',
  current_position text not null default 'Software Engineer',
  years_experience text not null default '5',
  career_interests text not null default 'Distributed systems, AI, web performance',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint about_singleton check (id = true)
);

-- 3. Skills
create table if not exists skills (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null, -- Frontend, Backend, Devops, Mobile, etc.
  logo_url text,
  years numeric(3,1) not null default 1.0,
  proficiency integer not null default 80 check (proficiency >= 0 and proficiency <= 100),
  display_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Experience
create table if not exists experience (
  id uuid primary key default uuid_generate_v4(),
  company_name text not null,
  company_logo_url text,
  role text not null,
  employment_type text not null default 'Full-time',
  start_month text not null,
  start_year text not null,
  end_month text,
  end_year text,
  is_current boolean not null default false,
  description text not null default '',
  achievements text[] not null default '{}',
  tech_stack text[] not null default '{}',
  certificate_url text,
  certificate_file_url text,
  display_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Projects
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  short_description text not null default '',
  description text not null default '',
  problem_statement text not null default '',
  solution text not null default '',
  architecture text not null default '',
  key_features text not null default '',
  challenges text not null default '',
  tech_stack text[] not null default '{}',
  github_url text,
  demo_url text,
  thumbnail_url text,
  gallery_urls text[] not null default '{}',
  category text not null,
  status text not null default 'Completed', -- Completed, In Progress, Maintenance
  is_featured boolean not null default false,
  display_order integer not null default 0,
  project_date text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Certificates
create table if not exists certificates (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  issuer text not null,
  issue_date text not null,
  credential_url text,
  preview_image_url text,
  pdf_url text,
  display_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Resume (singleton or single active record)
create table if not exists resume (
  id bool primary key default true,
  file_url text not null,
  original_filename text not null,
  file_size text not null,
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint resume_singleton check (id = true)
);

-- 8. SEO Settings (singleton)
create table if not exists seo_settings (
  id bool primary key default true,
  portfolio_title text not null default 'Developer Portfolio',
  meta_description text not null default 'Welcome to my portfolio.',
  keywords text[] not null default '{}',
  og_title text,
  og_description text,
  og_image_url text,
  twitter_image_url text,
  favicon_url text,
  analytics_id text,
  robots_txt text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint seo_settings_singleton check (id = true)
);

-- 9. Settings (singleton)
create table if not exists settings (
  id bool primary key default true,
  accent_color text not null default '#4F46E5',
  animation_intensity text not null default 'normal',
  portfolio_visible boolean not null default true,
  available_for_work boolean not null default true,
  show_availability_badge boolean not null default true,
  maintenance_mode boolean not null default false,
  maintenance_message text not null default 'Under maintenance. Check back soon.',
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint settings_singleton check (id = true)
);

-- 10. Activity Log
create table if not exists activity_log (
  id uuid primary key default uuid_generate_v4(),
  entity_type text not null,
  entity_id text not null,
  action text not null,
  description text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table hero enable row level security;
alter table about enable row level security;
alter table skills enable row level security;
alter table experience enable row level security;
alter table projects enable row level security;
alter table certificates enable row level security;
alter table resume enable row level security;
alter table seo_settings enable row level security;
alter table settings enable row level security;
alter table activity_log enable row level security;

-- Setup RLS Policies: Public Select, Authenticated Edit
-- Hero
create policy "Public read hero" on hero for select using (true);
create policy "Admin write hero" on hero for all using (auth.role() = 'authenticated');

-- About
create policy "Public read about" on about for select using (true);
create policy "Admin write about" on about for all using (auth.role() = 'authenticated');

-- Skills
create policy "Public read skills" on skills for select using (true);
create policy "Admin write skills" on skills for all using (auth.role() = 'authenticated');

-- Experience
create policy "Public read experience" on experience for select using (true);
create policy "Admin write experience" on experience for all using (auth.role() = 'authenticated');

-- Projects
create policy "Public read projects" on projects for select using (true);
create policy "Admin write projects" on projects for all using (auth.role() = 'authenticated');

-- Certificates
create policy "Public read certificates" on certificates for select using (true);
create policy "Admin write certificates" on certificates for all using (auth.role() = 'authenticated');

-- Resume
create policy "Public read resume" on resume for select using (true);
create policy "Admin write resume" on resume for all using (auth.role() = 'authenticated');

-- SEO Settings
create policy "Public read seo_settings" on seo_settings for select using (true);
create policy "Admin write seo_settings" on seo_settings for all using (auth.role() = 'authenticated');

-- Settings
create policy "Public read settings" on settings for select using (true);
create policy "Admin write settings" on settings for all using (auth.role() = 'authenticated');

-- Activity Log
-- No public read access to logs, authenticated access only
create policy "Admin write activity_log" on activity_log for all using (auth.role() = 'authenticated');
