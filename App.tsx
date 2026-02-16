
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Presentation } from './types';
import { INITIAL_PRESENTATIONS, DEFAULT_CATEGORIES } from './constants';
import { isSupabaseConfigured } from './services/supabaseClient';
import * as svc from './services/presentationService';
import PresentationRow from './components/PresentationRow';
import PresentationModal from './components/PresentationModal';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
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

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
        <div className="w-full max-w-sm">
          <div className="mb-12">
            <h1 className="bg-gradient-to-r from-primary via-red-400 to-primary bg-clip-text text-transparent text-6xl font-black tracking-tighter mb-4 italic">הספרייה</h1>
            <p className="text-gray-400 text-lg font-medium">המקום שלכם לצמוח ולהצליח</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              className={`w-full bg-surface border-2 ${authError ? 'border-primary animate-shake' : 'border-white/10'} rounded-2xl p-5 text-center text-3xl font-mono text-white focus:outline-none focus:border-primary transition-all shadow-inner`}
              placeholder="****"
              value={authCode}
              onChange={(e) => { setAuthCode(e.target.value); setAuthError(false); }}
              autoFocus
            />
            <button type="submit" className="w-full bg-primary hover:bg-red-700 text-white font-bold py-5 rounded-2xl shadow-xl transition-all active:scale-95">כניסה</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white flex flex-col max-w-4xl mx-auto relative overflow-x-hidden shadow-2xl border-x border-white/5">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent font-black text-3xl tracking-tighter italic">הספרייה</span>
        </div>
        <div className="flex items-center gap-4">
          <button className={`${isSearchOpen ? 'text-primary' : 'text-gray-400'} p-2`} onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <span className="material-icons text-2xl">search</span>
          </button>
          <button className="text-gray-400 hover:text-primary w-10 h-10 bg-white/5 rounded-xl border border-white/10" onClick={() => setIsAdminOpen(true)}>
            <span className="material-icons text-xl">settings</span>
          </button>
        </div>
      </header>

      <main className="flex-1 pt-6 pb-12">
        <div className="px-6 mb-16">
          <div className="max-w-2xl mx-auto relative bg-black/40 backdrop-blur-2xl border border-primary/30 rounded-[3rem] p-12 text-center shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight italic">כל הידע ב<span className="text-primary italic">קליק</span> אחד!</h2>
            <p className="text-gray-300 text-xl font-light">מאגר המצגות וההעשרה של הארגון זמין עבורכם בכל זמן ומכל מקום.</p>
          </div>
        </div>

        {isSearchOpen && (
          <div className="px-6 mb-8 animate-in slide-in-from-top-2 duration-300">
            <input autoFocus className="w-full bg-surface p-5 rounded-3xl text-lg border border-white/10 focus:outline-none focus:border-primary transition-all shadow-2xl" placeholder="חפש מצגת..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        )}

        <div className="flex flex-col gap-12">
          {categories.map(category => (
            categorizedPresentations[category]?.length > 0 && (
              <PresentationRow key={category} title={category} presentations={categorizedPresentations[category]} onSelect={setSelectedPresentation} />
            )
          ))}
          {filteredPresentations.length === 0 && (
            <div className="text-center py-20 text-gray-500"><p>לא מצאנו מצגות שתואמות לחיפוש...</p></div>
          )}
        </div>
      </main>

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
