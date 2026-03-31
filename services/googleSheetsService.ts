
// ─────────────────────────────────────────────────────────────
// Google Sheets integration – auto-sync presentations from a
// public Google Sheet. No server required.
//
// Setup for admin:
//   1. Create a Google Sheet with columns:
//      id | title | description | category | driveUrl | thumbnailUrl | author | isNew | addedAt
//   2. Go to Google Cloud Console → create project → enable Sheets API
//   3. Create API key (no OAuth needed for public sheets)
//   4. Share the Sheet: "Anyone with the link can view"
//   5. Enter Sheet ID + API key in Admin Panel → Google Drive tab
// ─────────────────────────────────────────────────────────────

import { Presentation } from '../types';

const CONFIG_KEY = 'hasifriya_gsheets_config';
const CACHE_KEY = 'hasifriya_gsheets_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export interface GSheetsConfig {
  sheetId: string;
  apiKey: string;
  sheetName?: string; // default: "Sheet1"
}

export interface GSheetsCache {
  data: Partial<Presentation>[];
  fetchedAt: number;
}

export const getConfig = (): GSheetsConfig | null => {
  try {
    return JSON.parse(localStorage.getItem(CONFIG_KEY) || 'null');
  } catch {
    return null;
  }
};

export const saveConfig = (config: GSheetsConfig) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  localStorage.removeItem(CACHE_KEY); // Invalidate cache on config change
};

export const clearConfig = () => {
  localStorage.removeItem(CONFIG_KEY);
  localStorage.removeItem(CACHE_KEY);
};

const getCache = (): GSheetsCache | null => {
  try {
    const raw = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (!raw) return null;
    if (Date.now() - raw.fetchedAt > CACHE_TTL) return null;
    return raw;
  } catch {
    return null;
  }
};

const setCache = (data: Partial<Presentation>[]) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data, fetchedAt: Date.now() }));
};

export const fetchPresentationsFromSheets = async (): Promise<Partial<Presentation>[]> => {
  const config = getConfig();
  if (!config?.sheetId || !config?.apiKey) return [];

  // Check cache first
  const cache = getCache();
  if (cache) return cache.data;

  const sheetName = encodeURIComponent(config.sheetName || 'Sheet1');
  const range = `${sheetName}!A:J`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.sheetId}/values/${range}?key=${config.apiKey}`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${resp.status}`);
    }
    const data = await resp.json();
    const rows: string[][] = data.values || [];
    if (rows.length < 2) return [];

    const headers = rows[0].map((h: string) => h.trim().toLowerCase());
    const result: Partial<Presentation>[] = rows.slice(1)
      .filter(row => row.some(cell => cell?.trim()))
      .map(row => {
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => { obj[h] = (row[i] || '').trim(); });
        return {
          id: obj['id'] || `gs_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          title: obj['title'] || obj['כותרת'] || '',
          description: obj['description'] || obj['תיאור'] || '',
          category: obj['category'] || obj['קטגוריה'] || 'כללי',
          driveUrl: obj['driveurl'] || obj['drive url'] || obj['drive_url'] || obj['קישור'] || '',
          thumbnailUrl: obj['thumbnailurl'] || obj['thumbnail'] || obj['thumbnail_url'] || '',
          author: obj['author'] || obj['מחבר'] || '',
          isNew: obj['isnew'] === 'true' || obj['is_new'] === 'true',
          addedAt: obj['addedat'] || obj['added_at'] || obj['תאריך'] || new Date().toLocaleDateString('he-IL'),
        } as Partial<Presentation>;
      })
      .filter(p => p.title); // Skip rows with no title

    setCache(result);
    return result;
  } catch (e: any) {
    console.warn('Google Sheets fetch failed:', e?.message || e);
    return [];
  }
};

export const isConfigured = (): boolean => {
  const c = getConfig();
  return !!(c?.sheetId && c?.apiKey);
};
