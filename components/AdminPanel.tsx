
import React, { useState, useRef } from 'react';
import { Presentation } from '../types';
import { generatePresentationSummary, selectBestMockup } from '../services/geminiService';

interface AdminPanelProps {
  onAdd: (p: Presentation) => void;
  onRemove: (id: string) => void;
  onUpdate: (p: Presentation) => void;
  onClose: () => void;
  categories: string[];
  presentations: Presentation[];
  onAddCategory: (cat: string) => void;
  onRemoveCategory: (cat: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onAdd, 
  onRemove, 
  onUpdate,
  onClose, 
  categories, 
  presentations, 
  onAddCategory, 
  onRemoveCategory 
}) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passError, setPassError] = useState(false);
  
  const [tab, setTab] = useState<'upload' | 'manage' | 'categories'>('upload');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newCatName, setNewCatName] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categories[0] || '',
    driveUrl: '',
  });

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '909080') {
      setIsAdminAuthenticated(true);
      setPassError(false);
    } else {
      setPassError(true);
      setAdminPassword('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!formData.title) {
        setFormData(prev => ({ ...prev, title: selectedFile.name.split('.')[0] }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(10);

    try {
      if (editingId) {
        const existing = presentations.find(p => p.id === editingId);
        if (existing) {
          onUpdate({
            ...existing,
            ...formData
          });
          setEditingId(null);
        }
      } else {
        setUploadProgress(30);
        // Step 1: AI Analysis
        const aiSummary = await generatePresentationSummary(formData.title, formData.description);
        setUploadProgress(60);
        
        // Step 2: Intelligent Mockup Selection from 50+ library
        const thumbnailUrl = await selectBestMockup(formData.title, formData.description);
        setUploadProgress(90);

        const newPresentation: Presentation = {
          id: Date.now().toString(),
          title: formData.title,
          description: aiSummary,
          category: formData.category,
          thumbnailUrl: thumbnailUrl,
          driveUrl: formData.driveUrl,
          isNew: true,
          addedAt: new Date().toLocaleDateString('he-IL')
        };
        onAdd(newPresentation);
      }

      setUploadProgress(100);
      setTimeout(() => {
        setTab('manage');
        setLoading(false);
        setFormData({ title: '', description: '', category: categories[0] || '', driveUrl: '' });
        setFile(null);
      }, 500);
    } catch (err) {
      console.error(err);
      alert("שגיאה בתהליך ההעלאה. נסה שוב.");
      setLoading(false);
    }
  };

  const startEditing = (p: Presentation) => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      description: p.description,
      category: p.category,
      driveUrl: p.driveUrl,
    });
    setTab('upload');
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
        <div className="bg-surface-light w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-white/10">
          <h2 className="text-white text-2xl font-black mb-6 italic">פאנל ניהול</h2>
          <form onSubmit={handleAdminAuth} className="space-y-6">
            <input 
              type="password" 
              className={`w-full bg-black/40 border-2 ${passError ? 'border-primary' : 'border-white/10'} rounded-2xl p-4 text-center text-white focus:outline-none focus:border-primary transition-all`} 
              placeholder="סיסמה" 
              value={adminPassword} 
              onChange={e => setAdminPassword(e.target.value)} 
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-primary py-4 rounded-2xl font-bold text-white shadow-lg">כניסה</button>
              <button type="button" onClick={onClose} className="px-6 bg-white/5 text-gray-400 rounded-2xl">ביטול</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="bg-surface-light w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-white/10 relative">
        
        {loading && (
          <div className="absolute inset-0 z-[120] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-12 text-center">
            <div className="w-full max-w-xs space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <span className="material-icons absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-primary">auto_awesome</span>
              </div>
              <h3 className="text-white text-xl font-bold">ה-AI שלנו מכין את המצגת...</h3>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full transition-all duration-500" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center p-8 bg-surface border-b border-white/5">
          <h2 className="text-white text-2xl font-black">ניהול הספרייה</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><span className="material-icons">close</span></button>
        </div>

        <div className="flex border-b border-white/5 bg-surface/50 p-2 gap-2">
          {['upload', 'manage', 'categories'].map((t) => (
            <button 
              key={t}
              onClick={() => { setTab(t as any); if(t !== 'upload') setEditingId(null); }}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${tab === t ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-white/5'}`}
            >
              {t === 'upload' ? (editingId ? 'עריכה' : 'הוספה') : t === 'manage' ? 'ניהול' : 'קטגוריות'}
            </button>
          ))}
        </div>

        <div className="p-8 overflow-y-auto hide-scrollbar">
          {tab === 'upload' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingId && (
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 rounded-3xl p-8 text-center hover:border-primary/50 cursor-pointer transition-all bg-black/20">
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                  <span className="material-icons text-4xl text-gray-500 mb-2">{file ? 'check_circle' : 'cloud_upload'}</span>
                  <p className="text-white font-bold">{file ? file.name : 'בחר קובץ להעלאה (אופציונלי)'}</p>
                </div>
              )}
              <input required className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary" placeholder="כותרת המצגת" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              <textarea required rows={2} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary" placeholder="על מה המצגת? (ה-AI יבחר מוקאפ לפי זה)" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <input type="url" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary" placeholder="קישור Google Drive" value={formData.driveUrl} onChange={e => setFormData({...formData, driveUrl: e.target.value})} />
              <select className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="submit" className="w-full bg-primary py-5 rounded-2xl font-bold text-white shadow-xl transition-all active:scale-95">
                {editingId ? 'שמור שינויים' : 'פרסם לספרייה'}
              </button>
            </form>
          ) : tab === 'manage' ? (
            <div className="space-y-3">
              {presentations.map(p => (
                <div key={p.id} className="flex gap-4 items-center p-3 bg-white/5 rounded-2xl border border-white/5">
                  <img src={p.thumbnailUrl} className="w-16 h-12 object-cover rounded-lg" alt="" />
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-white text-sm font-bold truncate">{p.title}</h4>
                    <p className="text-primary text-[10px] font-bold uppercase">{p.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditing(p)} className="text-gray-400 hover:text-white"><span className="material-icons">edit</span></button>
                    <button onClick={() => { if(confirm(`למחוק את "${p.title}"?`)) onRemove(p.id); }} className="text-red-500/50 hover:text-red-500"><span className="material-icons">delete</span></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none" placeholder="שם קטגוריה..." value={newCatName} onChange={e => setNewCatName(e.target.value)} />
                <button onClick={() => { if(newCatName) { onAddCategory(newCatName); setNewCatName(''); } }} className="bg-primary px-4 rounded-2xl"><span className="material-icons">add</span></button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {categories.map(cat => (
                  <div key={cat} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group">
                    <span className="text-white font-bold">{cat}</span>
                    <button onClick={() => { if(confirm(`למחוק את "${cat}"?`)) onRemoveCategory(cat); }} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><span className="material-icons">delete</span></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
