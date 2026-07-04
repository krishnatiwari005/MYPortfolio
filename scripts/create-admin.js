const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  const email = 'krishna.08072005@gmail.com';
  console.log(`Creating verified admin user for: ${email}...`);

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      email_confirm: true, // Mark email as confirmed instantly (no verification link required)
      user_metadata: { role: 'admin' }
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`User ${email} already exists in Supabase!`);
      } else {
        throw error;
      }
    } else {
      console.log(`SUCCESS: User ${email} has been created and pre-confirmed! User ID:`, data.user.id);
    }
  } catch (error) {
    console.error('ERROR creating user:', error.message);
  }
}

createAdminUser();
