const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setAdminPassword() {
  const email = 'krishna.08072005@gmail.com';
  const password = 'KrishnaAdmin2026!';
  console.log(`Setting password for: ${email}...`);

  try {
    // 1. Get user by email to retrieve their ID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const user = users.find(u => u.email === email);
    if (!user) {
      console.error(`ERROR: User ${email} not found! Please run node scripts/create-admin.js first.`);
      process.exit(1);
    }

    // 2. Update user password
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      password: password
    });

    if (error) throw error;

    console.log(`SUCCESS: Password set for ${email}. You can now log in using password credentials!`);
  } catch (error) {
    console.error('ERROR setting password:', error.message);
  }
}

setAdminPassword();
