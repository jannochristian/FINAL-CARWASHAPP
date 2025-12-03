import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  console.log('Make sure you have created a .env file with:');
  console.log('VITE_SUPABASE_URL=your_url');
  console.log('VITE_SUPABASE_ANON_KEY=your_key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);