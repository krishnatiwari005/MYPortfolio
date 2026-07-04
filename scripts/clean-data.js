const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanDatabase() {
  console.log('Cleaning database...');
  try {
    // 1. Delete all dynamic list table rows
    console.log('Truncating dynamic list tables...');
    await supabase.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('experience').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('certificates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('resume').delete().eq('id', true);
    await supabase.from('activity_log').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 2. Reset Hero Singleton to empty values
    console.log('Resetting Hero info...');
    await supabase.from('hero').upsert({
      id: true,
      name: 'Your Name',
      role: 'Full Stack Engineer',
      tagline: 'Welcome to my professional developer portfolio.',
      photo_url: null,
      available: true,
      availability_label: 'Available for work',
      github_url: '',
      linkedin_url: '',
      twitter_url: '',
      email: '',
      leetcode_url: '',
      portfolio_url: '',
      stat_1_label: '',
      stat_1_value: '',
      stat_2_label: '',
      stat_2_value: '',
      stat_3_label: '',
      stat_3_value: '',
      stat_4_label: '',
      stat_4_value: '',
    });

    // 3. Reset About Singleton
    console.log('Resetting About details...');
    await supabase.from('about').upsert({
      id: true,
      bio: '<p>Write a brief bio about your professional background, goals, and interests here.</p>',
      education: 'Your Education',
      location: 'Your Location',
      current_position: 'Your Current Position',
      years_experience: '0+',
      career_interests: 'Software Development',
    });

    // 4. Reset SEO Settings Singleton
    console.log('Resetting SEO configurations...');
    await supabase.from('seo_settings').upsert({
      id: true,
      portfolio_title: 'My Portfolio',
      meta_description: 'Welcome to my professional developer portfolio CMS website.',
      keywords: ['Portfolio', 'Developer', 'Software'],
      og_title: 'My Portfolio',
      og_description: 'Welcome to my professional developer portfolio CMS website.',
      og_image_url: null,
      twitter_image_url: null,
      favicon_url: null,
      analytics_id: null,
      robots_txt: 'User-agent: *\nAllow: /',
    });

    // 5. Reset Settings Singleton
    console.log('Resetting global App Settings...');
    await supabase.from('settings').upsert({
      id: true,
      accent_color: 'violet',
      animation_intensity: 'medium',
      portfolio_visible: true,
      available_for_work: true,
      show_availability_badge: true,
      maintenance_mode: false,
      maintenance_message: 'Pardon the intrusion, we are currently performing maintenance. Please check back later!',
      last_updated_at: new Date().toISOString(),
    });

    console.log('SUCCESS: All sample data cleared! Database is clean and ready for your custom data.');
  } catch (error) {
    console.error('ERROR during database cleanup:', error);
  }
}

cleanDatabase();
