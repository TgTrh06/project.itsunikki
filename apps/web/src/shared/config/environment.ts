import { z } from 'zod';

const environmentSchema = z.object({
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  VITE_API_BASE_URL: z.string().url().optional(),
});
const environment = environmentSchema.parse(import.meta.env);
export const publicEnvironment = { supabaseUrl: environment.VITE_SUPABASE_URL, supabaseAnonKey: environment.VITE_SUPABASE_ANON_KEY, apiBaseUrl: environment.VITE_API_BASE_URL };
