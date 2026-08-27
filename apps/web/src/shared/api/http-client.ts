import { publicEnvironment } from '../config/environment';
export async function apiRequest(path: string, accessToken: string, init?: RequestInit) {
  if (!publicEnvironment.apiBaseUrl) throw new Error('The tracker API is not configured for this deployment.');
  const response = await fetch(`${publicEnvironment.apiBaseUrl}${path}`, { ...init, headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', ...init?.headers } });
  if (!response.ok) throw new Error('We could not save your change. Try again shortly.');
  return response.status === 204 ? undefined : response.json();
}
