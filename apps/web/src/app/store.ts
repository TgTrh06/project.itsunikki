import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';
import type { Section } from '../entities/navigation';
interface AppState { section: Section; session: Session | null; notice: string; setSection: (section: Section) => void; setSession: (session: Session | null) => void; setNotice: (notice: string) => void; }
export const useAppStore = create<AppState>((set) => ({ section: 'Today', session: null, notice: '', setSection: (section) => set({ section }), setSession: (session) => set({ session }), setNotice: (notice) => set({ notice }) }));
