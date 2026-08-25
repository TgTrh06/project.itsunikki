import { useEffect } from 'react';
import { useAppStore } from './store';
import { AuthPanel } from '../features/auth/AuthPanel';
import { Workspace } from '../features/workspace/Workspace';
import { getSupabaseClient } from '../shared/lib/supabase';

export function App() {
  const client = getSupabaseClient(); const session = useAppStore((state) => state.session); const setSession = useAppStore((state) => state.setSession);
  useEffect(() => { if (!client) return; void client.auth.getSession().then(({ data }) => setSession(data.session)); const { data } = client.auth.onAuthStateChange((_event, next) => setSession(next)); return () => data.subscription.unsubscribe(); }, [client, setSession]);
  if (!client) return <main className="centered"><section className="auth-card"><p className="eyebrow">Itsunikki preview</p><h1>Local setup required</h1><p>This preview intentionally has no account connection. Add the public Supabase variables locally to test sign-in and the NestJS API.</p><code>Copy .env.example to .env</code></section></main>;
  if (!session) return <AuthPanel client={client} />;
  return <Workspace session={session} preview={window.location.hostname !== 'localhost'} onSignOut={() => void client.auth.signOut()} />;
}
