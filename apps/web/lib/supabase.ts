import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | undefined;
export function supabase() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('your-project')) return undefined;
  client = createClient(url, key);
  return client;
}

export async function apiRequest(path: string, accessToken: string, init?: RequestInit) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('The local API address is not configured.');
  const response = await fetch(`${base}${path}`, { ...init, headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', ...init?.headers } });
  if (!response.ok) throw new Error('The request could not be completed. Check your local API and try again.');
  return response.status === 204 ? undefined : response.json();
}
