import { publicEnvironment } from '../config/environment';
export async function apiRequest(path: string, accessToken: string, init?: RequestInit) {
  if (!publicEnvironment.apiBaseUrl) throw new Error('The local API address is not configured.');
  const response = await fetch(`${publicEnvironment.apiBaseUrl}${path}`, { ...init, headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', ...init?.headers } });
  if (!response.ok) throw new Error('The request could not be completed. Check your local API and try again.');
  return response.status === 204 ? undefined : response.json();
}
