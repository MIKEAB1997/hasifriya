import { createClient } from '@supabase/supabase-js';

// Access Environment Variables configured in Vercel / .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing. The application will fall back to local mock data where configured. Please check your .env file or Vercel environment variables.');
}

// Export the singleton supabase client instance
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder_key'
);

/**
 * Example usage:
 * 
 * import { supabase } from './lib/supabase';
 * 
 * export const fetchPresentations = async () => {
 *   const { data, error } = await supabase.from('presentations').select('*');
 *   if (error) throw error;
 *   return data;
 * };
 */
