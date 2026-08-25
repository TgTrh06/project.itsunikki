import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { publicEnvironment } from '../config/environment';
let client: SupabaseClient | undefined;
export function getSupabaseClient() {
  if (client) return client;
  if (!publicEnvironment.supabaseUrl || !publicEnvironment.supabaseAnonKey || publicEnvironment.supabaseUrl.includes('your-project')) return undefined;
  client = createClient(publicEnvironment.supabaseUrl, publicEnvironment.supabaseAnonKey);
  return client;
}
