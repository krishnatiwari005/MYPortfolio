import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const createClient = () => createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
export default supabase;
