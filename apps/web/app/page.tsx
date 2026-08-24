'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { apiRequest, supabase } from '../lib/supabase';

type Section = 'Today' | 'Tasks' | 'Habits' | 'Workouts' | 'Nutrition' | 'Review' | 'Settings';
const sections: Section[] = ['Today', 'Tasks', 'Habits', 'Workouts', 'Nutrition', 'Review', 'Settings'];

export default function Home() {
  const client = useMemo(() => supabase(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [section, setSection] = useState<Section>('Today');
  const [notice, setNotice] = useState('');
  const isPreview = typeof window !== 'undefined' && window.location.hostname !== 'localhost';

  useEffect(() => {
    if (!client) return;
    void client.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: subscription } = client.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => subscription.subscription.unsubscribe();
  }, [client]);

  if (!client) return <ConfigurationNotice />;
  if (!session) return <AuthPanel client={client} onNotice={setNotice} notice={notice} />;
  return <Workspace section={section} setSection={setSection} session={session} isPreview={isPreview} notice={notice} setNotice={setNotice} onSignOut={() => void client.auth.signOut()} />;
}

function ConfigurationNotice() {
  return <main className="centered"><section className="auth-card"><p className="eyebrow">Itsunikki preview</p><h1>Local setup required</h1><p>This preview intentionally has no account connection. Add the public Supabase variables locally to test sign-in and the NestJS API.</p><code>Copy .env.example to .env.local</code></section></main>;
}

function AuthPanel({ client, onNotice, notice }: { client: NonNullable<ReturnType<typeof supabase>>; onNotice: (value: string) => void; notice: string }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in'); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); onNotice(''); const result = mode === 'sign-in' ? await client.auth.signInWithPassword({ email, password }) : await client.auth.signUp({ email, password }); setBusy(false); onNotice(result.error ? 'We could not complete that request. Check your details and try again.' : mode === 'sign-up' ? 'Check your email to confirm your account, then sign in.' : 'Signed in successfully.'); }
  return <main className="centered"><section className="auth-card" aria-labelledby="welcome-title"><p className="eyebrow">Private daily tracker</p><h1 id="welcome-title">A clearer day, in one place.</h1><p>Tasks, habits, workouts, and food records stay scoped to your account.</p><form onSubmit={submit}><label>Email<input autoComplete="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label><label>Password<input autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required /></label><button disabled={busy}>{busy ? 'Working…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}</button></form>{notice && <p role="status" className="notice">{notice}</p>}<button className="text-button" onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}>{mode === 'sign-in' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}</button></section></main>;
}

function Workspace({ section, setSection, session, isPreview, notice, setNotice, onSignOut }: { section: Section; setSection: (section: Section) => void; session: Session; isPreview: boolean; notice: string; setNotice: (value: string) => void; onSignOut: () => void }) {
  return <main className="workspace"><aside><a className="brand" href="#today">itsunikki</a><nav aria-label="Workspace">{sections.map((item) => <button key={item} className={item === section ? 'nav-current' : ''} onClick={() => setSection(item)}>{item}</button>)}</nav><button className="text-button signout" onClick={onSignOut}>Sign out</button></aside><section className="content"><header><div><p className="eyebrow">Personal workspace</p><h1>{section}</h1></div><p className="account">{session.user.email}</p></header>{isPreview && <p className="banner" role="status">Preview mode: sign-in and tracker data are available only with your local NestJS API.</p>}<SectionContent section={section} token={session.access_token} notice={notice} setNotice={setNotice} /></section><nav className="mobile-nav" aria-label="Workspace">{sections.slice(0, 5).map((item) => <button key={item} aria-current={item === section ? 'page' : undefined} onClick={() => setSection(item)}>{item}</button>)}</nav></main>;
}

function SectionContent({ section, token, notice, setNotice }: { section: Section; token: string; notice: string; setNotice: (value: string) => void }) {
  const config: Record<Exclude<Section, 'Today' | 'Review' | 'Settings'>, { endpoint: string; title: string; fields: string[] }> = { Tasks: { endpoint: '/tasks', title: 'Add a task', fields: ['title', 'dueDate'] }, Habits: { endpoint: '/habits', title: 'Add a habit', fields: ['name', 'target'] }, Workouts: { endpoint: '/workouts', title: 'Log a workout', fields: ['activity', 'durationMinutes'] }, Nutrition: { endpoint: '/foods', title: 'Add food entry', fields: ['name', 'kcal'] } };
  if (section === 'Today') return <EmptyState title="Nothing needs your attention yet." body="When you add a task, habit, workout, or food entry, today’s progress will appear here." />;
  if (section === 'Review') return <EmptyState title="Your history will build here." body="Choose a day or week once you have saved records to review." />;
  if (section === 'Settings') return <ProfileForm token={token} onNotice={setNotice} notice={notice} />;
  const current = config[section];
  return <EntryForm title={current.title} endpoint={current.endpoint} fields={current.fields} token={token} onNotice={setNotice} notice={notice} />;
}

function EmptyState({ title, body }: { title: string; body: string }) { return <section className="empty-state"><h2>{title}</h2><p>{body}</p></section>; }
function ProfileForm({ token, onNotice, notice }: { token: string; onNotice: (value: string) => void; notice: string }) { const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone); async function submit(e: FormEvent) { e.preventDefault(); try { await apiRequest('/profile', token, { method: 'PATCH', body: JSON.stringify({ timezone }) }); onNotice('Timezone saved. Future daily boundaries use this setting.'); } catch (error) { onNotice(error instanceof Error ? error.message : 'Could not save timezone.'); } } return <section className="form-panel"><h2>Profile settings</h2><p>Your timezone defines due dates, daily totals, and history boundaries.</p><form onSubmit={submit}><label>Timezone<input value={timezone} onChange={(e) => setTimezone(e.target.value)} required /></label><button>Save timezone</button></form>{notice && <p role="status" className="notice">{notice}</p>}</section>; }
function EntryForm({ title, endpoint, fields, token, onNotice, notice }: { title: string; endpoint: string; fields: string[]; token: string; onNotice: (value: string) => void; notice: string }) { const [values, setValues] = useState<Record<string, string>>({}); async function submit(e: FormEvent) { e.preventDefault(); const data: Record<string, unknown> = { ...values }; if (endpoint === '/tasks') { data.dueDate = values.dueDate; data.recurrence = 'none'; } if (endpoint === '/habits') { data.target = Number(values.target); data.frequency = 'daily'; } if (endpoint === '/workouts') { data.durationMinutes = Number(values.durationMinutes); data.performedAt = new Date().toISOString(); } if (endpoint === '/foods') { Object.assign(data, { kcal: Number(values.kcal), carbohydrates: 0, fat: 0, protein: 0, meal: 'snack', occurredAt: new Date().toISOString() }); } try { await apiRequest(endpoint, token, { method: 'POST', body: JSON.stringify(data) }); setValues({}); onNotice('Saved. Your dashboard will refresh when it loads data.'); } catch (error) { onNotice(error instanceof Error ? error.message : 'Could not save this entry.'); } } return <section className="form-panel"><h2>{title}</h2><p>Saved records stay private to your account.</p><form onSubmit={submit}>{fields.map((field) => <label key={field}>{field === 'dueDate' ? 'Due date' : field === 'durationMinutes' ? 'Minutes' : field[0].toUpperCase() + field.slice(1)}<input type={field === 'dueDate' ? 'datetime-local' : field === 'target' || field === 'durationMinutes' || field === 'kcal' ? 'number' : 'text'} min={field === 'target' || field === 'durationMinutes' || field === 'kcal' ? 0 : undefined} value={values[field] ?? ''} onChange={(e) => setValues({ ...values, [field]: e.target.value })} required /></label>)}<button>Save entry</button></form>{notice && <p role="status" className="notice">{notice}</p>}</section>; }
