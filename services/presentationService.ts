import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Presentation } from '../types';
import { INITIAL_PRESENTATIONS, DEFAULT_CATEGORIES } from '../constants';

const STORAGE_KEY_PRES = 'library_v7_data';
const STORAGE_KEY_CATS = 'library_v7_cats';

// --- localStorage helpers ---
function getLocal<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch { return fallback; }
}
function setLocal(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- Presentations ---
export async function fetchPresentations(): Promise<Presentation[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('presentations')
      .select('*')
      .order('added_at', { ascending: false });
    if (!error && data) return data.map(mapFromDb);
  }
  return getLocal(STORAGE_KEY_PRES, INITIAL_PRESENTATIONS);
}

export async function addPresentation(p: Presentation): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('presentations').insert(mapToDb(p));
  }
}

export async function updatePresentation(p: Presentation): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('presentations').update(mapToDb(p)).eq('id', p.id);
  }
}

export async function removePresentation(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('presentations').delete().eq('id', id);
  }
}

// --- Categories ---
export async function fetchCategories(): Promise<string[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('categories')
      .select('name')
      .order('created_at', { ascending: true });
    if (!error && data) return data.map(d => d.name);
  }
  return getLocal(STORAGE_KEY_CATS, DEFAULT_CATEGORIES);
}

export async function addCategory(name: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('categories').insert({ name });
  }
}

export async function removeCategory(name: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('categories').delete().eq('name', name);
  }
}

// --- Sync localStorage (used when Supabase is not configured) ---
export function syncToLocal(presentations: Presentation[], categories: string[]) {
  setLocal(STORAGE_KEY_PRES, presentations);
  setLocal(STORAGE_KEY_CATS, categories);
}

// --- DB mapping (snake_case <-> camelCase) ---
function mapFromDb(row: Record<string, unknown>): Presentation {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    category: row.category as string,
    thumbnailUrl: row.thumbnail_url as string,
    driveUrl: row.drive_url as string,
    isNew: row.is_new as boolean,
    addedAt: row.added_at as string,
  };
}

function mapToDb(p: Presentation): Record<string, unknown> {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    thumbnail_url: p.thumbnailUrl,
    drive_url: p.driveUrl,
    is_new: p.isNew ?? false,
    added_at: p.addedAt,
  };
}
