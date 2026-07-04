export interface Hero {
  id: boolean;
  name: string;
  role: string;
  tagline: string;
  photo_url: string | null;
  available: boolean;
  availability_label: string;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  email: string | null;
  leetcode_url: string | null;
  portfolio_url: string | null;
  stat_1_label: string | null;
  stat_1_value: string | null;
  stat_2_label: string | null;
  stat_2_value: string | null;
  stat_3_label: string | null;
  stat_3_value: string | null;
  stat_4_label: string | null;
  stat_4_value: string | null;
  updated_at: string;
}

export interface About {
  id: boolean;
  bio: string;
  education: string;
  location: string;
  current_position: string;
  years_experience: string;
  career_interests: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  logo_url: string | null;
  years: number;
  proficiency: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company_name: string;
  company_logo_url: string | null;
  role: string;
  employment_type: string;
  start_month: string;
  start_year: string;
  end_month: string | null;
  end_year: string | null;
  is_current: boolean;
  description: string;
  achievements: string[];
  tech_stack: string[];
  certificate_url: string | null;
  certificate_file_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  problem_statement: string;
  solution: string;
  architecture: string;
  key_features: string;
  challenges: string;
  tech_stack: string[];
  github_url: string | null;
  demo_url: string | null;
  thumbnail_url: string | null;
  gallery_urls: string[];
  category: string;
  status: string;
  is_featured: boolean;
  display_order: number;
  project_date: string;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_url: string | null;
  preview_image_url: string | null;
  pdf_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: boolean;
  file_url: string;
  original_filename: string;
  file_size: string;
  uploaded_at: string;
}

export interface SeoSettings {
  id: boolean;
  portfolio_title: string;
  meta_description: string;
  keywords: string[];
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  twitter_image_url: string | null;
  favicon_url: string | null;
  analytics_id: string | null;
  robots_txt: string | null;
  updated_at: string;
}

export interface Settings {
  id: boolean;
  accent_color: string;
  animation_intensity: string;
  portfolio_visible: boolean;
  available_for_work: boolean;
  show_availability_badge: boolean;
  maintenance_mode: boolean;
  maintenance_message: string;
  last_updated_at: string;
}

export interface ActivityLog {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  description: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      hero: { Row: Hero; Insert: Partial<Hero>; Update: Partial<Hero> };
      about: { Row: About; Insert: Partial<About>; Update: Partial<About> };
      skills: { Row: Skill; Insert: Partial<Skill>; Update: Partial<Skill> };
      experience: { Row: Experience; Insert: Partial<Experience>; Update: Partial<Experience> };
      projects: { Row: Project; Insert: Partial<Project>; Update: Partial<Project> };
      certificates: { Row: Certificate; Insert: Partial<Certificate>; Update: Partial<Certificate> };
      resume: { Row: Resume; Insert: Partial<Resume>; Update: Partial<Resume> };
      seo_settings: { Row: SeoSettings; Insert: Partial<SeoSettings>; Update: Partial<SeoSettings> };
      settings: { Row: Settings; Insert: Partial<Settings>; Update: Partial<Settings> };
      activity_log: { Row: ActivityLog; Insert: Partial<ActivityLog>; Update: Partial<ActivityLog> };
    };
  };
}
