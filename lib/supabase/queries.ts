import { createClient } from './server';
import { Hero, About, Skill, Experience, Project, Certificate, Resume, SeoSettings, Settings } from '@/types/database';

export async function getHero(): Promise<Hero | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('hero').select('*').eq('id', true).maybeSingle();
  if (error) console.error('Error fetching hero:', error);
  return data;
}

export async function getAbout(): Promise<About | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('about').select('*').eq('id', true).maybeSingle();
  if (error) console.error('Error fetching about:', error);
  return data;
}

export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) console.error('Error fetching skills:', error);
  return data ?? [];
}

export async function getExperience(): Promise<Experience[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) console.error('Error fetching experience:', error);
  return data ?? [];
}

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) console.error('Error fetching projects:', error);
  return data ?? [];
}

export async function getCertificates(): Promise<Certificate[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) console.error('Error fetching certificates:', error);
  return data ?? [];
}

export async function getResume(): Promise<Resume | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('resume').select('*').eq('id', true).maybeSingle();
  if (error) console.error('Error fetching resume:', error);
  return data;
}

export async function getSeoSettings(): Promise<SeoSettings | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('seo_settings').select('*').eq('id', true).maybeSingle();
  if (error) console.error('Error fetching SEO settings:', error);
  return data;
}

export async function getSettings(): Promise<Settings | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('settings').select('*').eq('id', true).maybeSingle();
  if (error) console.error('Error fetching settings:', error);
  return data;
}

export async function getActivityLogs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) console.error('Error fetching activity logs:', error);
  return data ?? [];
}
