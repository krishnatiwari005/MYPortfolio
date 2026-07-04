const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  console.log('Checking Supabase Storage buckets...');
  
  try {
    // 1. Get list of buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      throw listError;
    }
    
    const bucketName = 'portfolio-assets';
    const exists = buckets.some(b => b.id === bucketName);
    
    if (exists) {
      console.log(`Bucket "${bucketName}" already exists. Ensuring it is public...`);
      const { data, error: updateError } = await supabase.storage.updateBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      });
      if (updateError) throw updateError;
      console.log(`Successfully updated bucket "${bucketName}" to be public.`);
    } else {
      console.log(`Bucket "${bucketName}" does not exist. Creating it now...`);
      const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      });
      if (createError) throw createError;
      console.log(`Successfully created public bucket "${bucketName}".`);
    }
    
    console.log('\n======================================================');
    console.log('STORAGE BUCKET READY!');
    console.log('======================================================');
    console.log('\nTo resolve the "new row violates row-level security policy" error,');
    console.log('you need to set up Row-Level Security (RLS) policies for Supabase Storage.');
    console.log('Since RLS policies for storage must be executed via SQL, please copy and run');
    console.log('the following SQL query in the SQL Editor in your Supabase Dashboard:\n');
    
    console.log(`-- Enable RLS on storage.objects (usually enabled by default)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. Allow public select access to the portfolio-assets bucket
CREATE POLICY "Public Read Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-assets');

-- 2. Allow authenticated users to upload/insert files
CREATE POLICY "Authenticated Insert Access" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'portfolio-assets' 
    AND auth.role() = 'authenticated'
  );

-- 3. Allow authenticated users to update their files
CREATE POLICY "Authenticated Update Access" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'portfolio-assets' 
    AND auth.role() = 'authenticated'
  );

-- 4. Allow authenticated users to delete files
CREATE POLICY "Authenticated Delete Access" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'portfolio-assets' 
    AND auth.role() = 'authenticated'
  );`);
    console.log('\n======================================================');

  } catch (error) {
    console.error('ERROR setting up storage:', error.message || error);
  }
}

setupStorage();
