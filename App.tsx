
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Presentation } from './types';
import { INITIAL_PRESENTATIONS, DEFAULT_CATEGORIES } from './constants';
import { isSupabaseConfigured } from './services/supabaseClient';
import * as svc from './services/presentationService';
import PresentationRow from './components/PresentationRow';
import PresentationModal from './components/PresentationModal';
import AdminPanel from './components/AdminPanel';

const AUTH_KEY = 'hasifriya_auth';

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  });
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState(false);

  const [presentations, setPresentations] = useState<Presentation[]>(INITIAL_PRESENTATIONS);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [selectedPresentation, setSelectedPresentation] = useState<Presentation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    (async () => {
      const [pres, cats] = await Promise.all([
        svc.fetchPresentations(),
        svc.fetchCategories()
      ]);
      setPresentations(pres);
      setCategories(cats);
    })();
  }, []);

  // Sync to localStorage when Supabase is not configured
  useEffect(() => {
    if (!isSupabaseConfigured) {
      svc.syncToLocal(presentations, categories);
    }
  }, [presentations, categories]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authCode === '9090') {
      setIsAuthorized(true);
      sessionStorage.setItem(AUTH_KEY, 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
      setAuthCode('');
    }
  };

  const filteredPresentations = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return presentations;
    return presentations.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }, [presentations, searchQuery]);

  const categorizedPresentations = useMemo(() => {
    const map: Record<string, Presentation[]> = {};
    categories.forEach(cat => map[cat] = []);
    filteredPresentations.forEach(p => {
      if (map[p.category]) map[p.category].push(p);
      else (map['כללי'] = map['כללי'] || []).push(p);
    });
    return map;
  }, [filteredPresentations, categories]);

  const addPresentation = useCallback((p: Presentation) => {
    setPresentations(prev => [p, ...prev]);
    svc.addPresentation(p);
  }, []);

  const removePresentation = useCallback((id: string) => {
    setPresentations(prev => prev.filter(p => p.id !== id));
    svc.removePresentation(id);
  }, []);

  const updatePresentation = useCallback((updated: Presentation) => {
    setPresentations(prev => prev.map(p => p.id === updated.id ? updated : p));
    svc.updatePresentation(updated);
  }, []);

  const addCategory = useCallback((cat: string) => {
    setCategories(prev => prev.includes(cat) ? prev : [...prev, cat]);
    svc.addCategory(cat);
  }, []);

  const removeCategory = useCallback((cat: string) => {
    setCategories(prev => prev.length <= 1 ? prev : prev.filter(c => c !== cat));
    svc.removeCategory(cat);
  }, []);

  const totalCount = presentations.length;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-sm">
          <div className="mb-14">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="material-icons text-primary text-4xl">menu_book</span>
            </div>
            <h1 className="bg-gradient-to-r from-primary via-red-400 to-primary bg-clip-text text-transparent text-5xl font-black tracking-tight mb-3">הספרייה</h1>
            <p className="text-gray-500 text-base">הזינו קוד גישה כדי להיכנס למאגר</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-5">
            <input
              type="password"
              className={`w-full bg-surface border-2 ${authError ? 'border-primary' : 'border-white/10'} rounded-2xl p-5 text-center text-3xl font-mono text-white focus:outline-none focus:border-primary/60 transition-all tracking-[0.5em]`}
              placeholder="----"
              value={authCode}
              onChange={(e) => { setAuthCode(e.target.value); setAuthError(false); }}
              autoFocus
              maxLength={6}
            />
            {authError && <p className="text-primary text-sm font-bold">קוד שגוי, נסו שנית</p>}
            <button type="submit" className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">כניסה</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white flex flex-col max-w-5xl mx-auto relative overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="material-icons text-primary text-lg">menu_book</span>
          </div>
          <span className="text-white font-extrabold text-xl tracking-tight">הספרייה</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`p-2.5 rounded-xl transition-all ${isSearchOpen ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <span className="material-icons text-xl">search</span>
          </button>
          <button
            className="p-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setIsAdminOpen(true)}
          >
            <span className="material-icons text-xl">settings</span>
          </button>
        </div>
      </header>

      <main className="flex-1 pt-8 pb-16">
        {/* Hero */}
        <div className="px-6 mb-12">
          <div className="max-w-3xl mx-auto relative bg-gradient-to-br from-surface to-black border border-white/5 rounded-3xl p-10 md:p-14">
            <div className="absolute top-6 left-6 w-16 h-16 bg-primary/5 rounded-full blur-2xl"></div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white leading-tight">
              כל הידע ב<span className="text-primary">קליק</span> אחד
            </h2>
            <p className="text-gray-400 text-lg max-w-lg">
              מאגר המצגות וההעשרה של הארגון. {totalCount} מצגות זמינות עבורכם בכל זמן ומכל מקום.
            </p>
          </div>
        </div>

        {/* Search */}
        {isSearchOpen && (
          <div className="px-6 mb-10">
            <div className="relative max-w-2xl mx-auto">
              <span className="material-icons absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">search</span>
              <input
                autoFocus
                className="w-full bg-surface pr-12 pl-5 py-4 rounded-2xl text-base border border-white/10 focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-600"
                placeholder="חיפוש לפי שם, תיאור או קטגוריה..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col gap-10">
          {categories.map(category => (
            categorizedPresentations[category]?.length > 0 && (
              <PresentationRow key={category} title={category} presentations={categorizedPresentations[category]} onSelect={setSelectedPresentation} />
            )
          ))}
          {filteredPresentations.length === 0 && (
            <div className="text-center py-24">
              <span className="material-icons text-5xl text-gray-700 mb-4 block">search_off</span>
              <p className="text-gray-500 text-lg">לא נמצאו מצגות שתואמות לחיפוש</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-white/5 text-center">
        <p className="text-gray-600 text-xs">הספרייה - מאגר מצגות פנימי</p>
      </footer>

      <PresentationModal presentation={selectedPresentation} onClose={() => setSelectedPresentation(null)} />

      {isAdminOpen && (
        <AdminPanel
          categories={categories}
          presentations={presentations}
          onAddCategory={addCategory}
          onRemoveCategory={removeCategory}
          onAdd={addPresentation}
          onRemove={removePresentation}
          onUpdate={updatePresentation}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
