import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  FolderOpen,
  Globe2,
  List,
  Loader,
  Lock,
  Pencil,
  Plus,
  RefreshCw,
  Tag,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { KnowledgeTopic, Presentation } from '../types';
import { generatePresentationSummary, selectBestMockup } from '../services/geminiService';
import * as gdrive from '../services/googleDriveService';
import * as webKnowledge from '../services/webKnowledgeService';

interface AdminPanelProps {
  onAdd: (p: Presentation) => void;
  onRemove: (id: string) => void;
  onUpdate: (p: Presentation) => void;
  onClose: () => void;
  categories: string[];
  presentations: Presentation[];
  onAddCategory: (cat: string) => void;
  onRemoveCategory: (cat: string) => void;
  onSourcesRefresh: () => void;
}

type Tab = 'upload' | 'manage' | 'categories' | 'drive' | 'monitoring';

const AdminPanel: React.FC<AdminPanelProps> = ({
  onAdd,
  onRemove,
  onUpdate,
  onClose,
  categories,
  presentations,
  onAddCategory,
  onRemoveCategory,
  onSourcesRefresh,
}) => {
  const categoryOptions = categories.length > 0 ? categories : ['כללי'];
  const savedDriveConfig = gdrive.getConfig();

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passError, setPassError] = useState(false);

  const [tab, setTab] = useState<Tab>('upload');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [topicEditingId, setTopicEditingId] = useState<string | null>(null);
  const [knowledgeTopics, setKnowledgeTopics] = useState<KnowledgeTopic[]>(
    webKnowledge.getTopicsConfig()
  );

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categoryOptions[0],
    driveUrl: '',
  });

  const [topicForm, setTopicForm] = useState({
    label: '',
    query: '',
    category: categoryOptions[0],
    maxItems: '6',
  });

  const [driveConfig, setDriveConfig] = useState({
    folderId: savedDriveConfig?.folderId || gdrive.DEFAULT_FOLDER_ID,
    apiKey: savedDriveConfig?.apiKey || '',
  });
  const [driveStatus, setDriveStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [driveError, setDriveError] = useState('');
  const [driveCount, setDriveCount] = useState<{
    presentations: number;
    videos: number;
    images: number;
    topics: number;
  } | null>(null);
  const [drivePreviewTopics, setDrivePreviewTopics] = useState<gdrive.DriveTopicItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetPresentationForm = () => {
    setFormData({
      title: '',
      description: '',
      category: categoryOptions[0],
      driveUrl: '',
    });
    setEditingId(null);
    setFile(null);
  };

  const resetTopicForm = () => {
    setTopicEditingId(null);
    setTopicForm({
      label: '',
      query: '',
      category: categoryOptions[0],
      maxItems: '6',
    });
  };

  const handleAdminAuth = (event: React.FormEvent) => {
    event.preventDefault();

    if (adminPassword === '909080') {
      setIsAdminAuthenticated(true);
      setPassError(false);
      return;
    }

    setPassError(true);
    setAdminPassword('');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    if (!formData.title) {
      setFormData(prev => ({ ...prev, title: selectedFile.name.split('.')[0] }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setUploadProgress(10);

    try {
      if (editingId) {
        const existing = presentations.find(item => item.id === editingId);
        if (existing) {
          onUpdate({ ...existing, ...formData });
        }
      } else {
        setUploadProgress(35);
        const aiSummary = await generatePresentationSummary(formData.title, formData.description);
        setUploadProgress(65);
        const thumbnailUrl = await selectBestMockup(formData.title, formData.description);
        setUploadProgress(90);

        onAdd({
          id: Date.now().toString(),
          title: formData.title,
          description: aiSummary,
          category: formData.category,
          thumbnailUrl,
          driveUrl: formData.driveUrl,
          isNew: true,
          addedAt: new Date().toLocaleDateString('he-IL'),
        });
      }

      setUploadProgress(100);
      setTimeout(() => {
        setLoading(false);
        setTab('manage');
        resetPresentationForm();
      }, 350);
    } catch (error) {
      console.error(error);
      alert('שגיאה בתהליך ההעלאה. נסו שוב.');
      setLoading(false);
    }
  };

  const startEditingPresentation = (presentation: Presentation) => {
    setEditingId(presentation.id);
    setFormData({
      title: presentation.title,
      description: presentation.description,
      category: presentation.category,
      driveUrl: presentation.driveUrl,
    });
    setTab('upload');
  };

  const handleSaveDrive = () => {
    if (!driveConfig.folderId || !driveConfig.apiKey) return;

    gdrive.saveConfig(driveConfig);
    gdrive.clearCache();
    setDriveStatus('idle');
    onSourcesRefresh();
  };

  const handleTestDrive = async () => {
    if (!driveConfig.folderId || !driveConfig.apiKey) return;

    gdrive.saveConfig(driveConfig);
    gdrive.clearCache();
    setDriveStatus('loading');
    setDriveError('');
    setDrivePreviewTopics([]);

    try {
      const result = await gdrive.fetchFromDrive();
      setDriveCount({
        presentations: result.presentations.length,
        videos: result.videos.length,
        images: result.images.length,
        topics: result.topics.length,
      });
      setDrivePreviewTopics(result.topics);
      setDriveStatus('ok');
    } catch (error: any) {
      setDriveStatus('error');
      setDriveError(
        error?.message || 'בדקו ש-Folder ID ו-API Key נכונים וש-Drive API מופעל.'
      );
    }
  };

  const handleClearDrive = () => {
    gdrive.clearConfig();
    setDriveConfig({ folderId: gdrive.DEFAULT_FOLDER_ID, apiKey: '' });
    setDriveStatus('idle');
    setDriveCount(null);
    setDrivePreviewTopics([]);
    onSourcesRefresh();
  };

  const persistTopics = (nextTopics: KnowledgeTopic[]) => {
    setKnowledgeTopics(nextTopics);
    webKnowledge.saveTopicsConfig(nextTopics);
    webKnowledge.clearCache();
    onSourcesRefresh();
  };

  const handleSaveTopic = () => {
    if (!topicForm.label.trim() || !topicForm.query.trim()) return;

    const nextTopic: KnowledgeTopic = {
      id: topicEditingId || `topic_${Date.now()}`,
      label: topicForm.label.trim(),
      query: topicForm.query.trim(),
      category: topicForm.category,
      maxItems: Math.min(12, Math.max(1, Number(topicForm.maxItems) || 6)),
      enabled: true,
    };

    if (topicEditingId) {
      persistTopics(
        knowledgeTopics.map(topic => (topic.id === topicEditingId ? nextTopic : topic))
      );
    } else {
      persistTopics([nextTopic, ...knowledgeTopics]);
    }

    resetTopicForm();
  };

  const handleEditTopic = (topic: KnowledgeTopic) => {
    setTopicEditingId(topic.id);
    setTopicForm({
      label: topic.label,
      query: topic.query,
      category: topic.category,
      maxItems: String(topic.maxItems),
    });
    setTab('monitoring');
  };

  const handleToggleTopic = (topicId: string) => {
    persistTopics(
      knowledgeTopics.map(topic =>
        topic.id === topicId ? { ...topic, enabled: topic.enabled === false } : topic
      )
    );
  };

  const handleDeleteTopic = (topicId: string) => {
    persistTopics(knowledgeTopics.filter(topic => topic.id !== topicId));
    if (topicEditingId === topicId) {
      resetTopicForm();
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        dir="rtl"
      >
        <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl border border-gray-200 animate-scale-in">
          <div className="flex justify-between items-center mb-6">
          <h2 className="text-gray-900 text-xl font-black">ניהול המאגרון</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAdminAuth} className="space-y-4">
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                className={`w-full bg-gray-50 border-2 ${
                  passError ? 'border-red-400' : 'border-gray-200'
                } rounded-2xl p-4 pr-12 text-center text-gray-900 focus:outline-none focus:border-primary/60 transition-all tracking-widest`}
                placeholder="סיסמת ניהול"
                value={adminPassword}
                onChange={event => {
                  setAdminPassword(event.target.value);
                  setPassError(false);
                }}
                autoFocus
              />
            </div>

            {passError && <p className="text-red-500 text-sm font-bold text-center">סיסמה שגויה</p>}

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-2xl font-bold transition-all"
              >
                כניסה
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-2xl font-bold transition-all"
              >
                ביטול
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'upload', label: editingId ? 'עריכה' : 'הוספה', icon: <Upload className="w-3.5 h-3.5" /> },
    { key: 'manage', label: 'ניהול', icon: <List className="w-3.5 h-3.5" /> },
    { key: 'categories', label: 'קטגוריות', icon: <Tag className="w-3.5 h-3.5" /> },
    { key: 'drive', label: 'Google Drive', icon: <FolderOpen className="w-3.5 h-3.5" /> },
    { key: 'monitoring', label: 'מעקב רשת', icon: <Globe2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      dir="rtl"
    >
      <div className="bg-white w-full max-w-3xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-gray-200 relative">
        {loading && (
          <div className="absolute inset-0 z-[120] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-12 text-center">
            <div className="w-full max-w-xs space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              </div>
              <h3 className="text-gray-900 text-lg font-bold">ה-AI מכין את הפריט...</h3>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-white">
          <h2 className="text-gray-900 text-xl font-black">ניהול המאגרון</h2>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-gray-200 bg-gray-50 px-4 pt-2 gap-1 overflow-x-auto hide-scrollbar">
          {tabs.map(item => (
            <button
              key={item.key}
              onClick={() => {
                setTab(item.key);
                if (item.key !== 'upload') {
                  setEditingId(null);
                }
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
                tab === item.key
                  ? 'bg-white text-primary border-primary shadow-sm'
                  : 'text-gray-500 border-transparent hover:text-gray-800 hover:bg-white/60'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {tab === 'upload' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingId && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-primary/50 cursor-pointer transition-all"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600 font-bold text-sm">
                    {file ? file.name : 'בחר קובץ להעלאה (אופציונלי)'}
                  </p>
                </div>
              )}

              <input
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:border-primary transition-all placeholder:text-gray-400"
                placeholder="כותרת הפריט"
                value={formData.title}
                onChange={event => setFormData({ ...formData, title: event.target.value })}
              />

              <textarea
                required
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:border-primary transition-all placeholder:text-gray-400 resize-none"
                placeholder="תיאור קצר לתוכן"
                value={formData.description}
                onChange={event => setFormData({ ...formData, description: event.target.value })}
              />

              <input
                type="url"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:border-primary transition-all placeholder:text-gray-400"
                placeholder="קישור Google Drive"
                value={formData.driveUrl}
                onChange={event => setFormData({ ...formData, driveUrl: event.target.value })}
              />

              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:border-primary transition-all"
                value={formData.category}
                onChange={event => setFormData({ ...formData, category: event.target.value })}
              >
                {categoryOptions.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-bold transition-all shadow-md shadow-primary/20"
              >
                {editingId ? 'שמור שינויים' : 'פרסם לספרייה'}
              </button>
            </form>
          )}

          {tab === 'manage' && (
            <div className="space-y-3">
              {presentations.length === 0 && (
                <p className="text-gray-400 text-center py-10 font-medium">אין פריטים ידניים עדיין</p>
              )}

              {presentations.map(presentation => (
                <div
                  key={presentation.id}
                  className="flex gap-4 items-center p-3 bg-gray-50 rounded-2xl border border-gray-200"
                >
                  <img
                    src={presentation.thumbnailUrl}
                    className="w-16 h-12 object-cover rounded-xl flex-shrink-0"
                    alt=""
                  />
                  <div className="flex-1 overflow-hidden min-w-0">
                    <h4 className="text-gray-900 text-sm font-bold truncate">{presentation.title}</h4>
                    <p className="text-primary text-[11px] font-bold">{presentation.category}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => startEditingPresentation(presentation)}
                      className="p-2 rounded-xl text-gray-400 hover:text-primary hover:bg-primary/8 transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`למחוק את "${presentation.title}"?`)) {
                          onRemove(presentation.id);
                        }
                      }}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'categories' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:border-primary transition-all placeholder:text-gray-400"
                  placeholder="שם קטגוריה חדשה..."
                  value={newCatName}
                  onChange={event => setNewCatName(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' && newCatName.trim()) {
                      onAddCategory(newCatName.trim());
                      setNewCatName('');
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (newCatName.trim()) {
                      onAddCategory(newCatName.trim());
                      setNewCatName('');
                    }
                  }}
                  className="px-4 bg-primary hover:bg-primary-dark text-white rounded-2xl transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {categoryOptions.map(category => (
                  <div
                    key={category}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-200 group"
                  >
                    <span className="text-gray-900 font-bold">{category}</span>
                    <button
                      onClick={() => {
                        if (confirm(`למחוק את "${category}"?`)) {
                          onRemoveCategory(category);
                        }
                      }}
                      className="text-gray-300 group-hover:text-red-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'drive' && (
            <div className="space-y-5">
              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-5 text-white">
                <div className="absolute -top-10 left-0 h-32 w-32 rounded-full bg-cyan-400/15 blur-3xl" />
                <div className="absolute -bottom-10 right-0 h-32 w-32 rounded-full bg-blue-400/15 blur-3xl" />
                <div className="relative">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-200/80 mb-2">
                    Drive Sync
                  </p>
                  <h3 className="text-2xl font-black tracking-tight mb-2">תיקיות ב-Drive הופכות לנושאים במאגרון</h3>
                  <p className="text-sm leading-7 text-slate-200 max-w-2xl">
                    כל תיקייה ראשית בתוך תיקיית השורש תהפוך לנושא מסונכרן. הקבצים שבתוכה ימוינו אוטומטית
                    לפי סוג: מצגות לאזור החומרים, וידאו לאזור הסרטונים, ותמונות לאזור המדיה.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
                    מבנה מומלץ
                  </p>
                  <div className="rounded-2xl bg-white border border-slate-200 p-4 font-mono text-[13px] leading-7 text-slate-700">
                    <div>Root Folder/</div>
                    <div className="pr-4">הנדסה חברתית/</div>
                    <div className="pr-8">סרטונים/</div>
                    <div className="pr-8">תמונות/</div>
                    <div className="pr-4">פישינג/</div>
                    <div className="pr-8">מצגות/</div>
                    <div className="pr-8">קבצים נוספים/</div>
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-600">
                    אפשר להעלות קבצים ישירות לתיקיית הנושא, או להשתמש בתתי-תיקיות פנימיות לסדר.
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
                  <p className="font-black mb-3">מה צריך לעשות בגוגל דרייב:</p>
                  <ol className="list-decimal list-inside space-y-2 font-medium leading-7">
                    <li>ליצור תיקיית שורש אחת שתשמש את המאגרון.</li>
                    <li>לפתוח בתוכה תיקיות נושא ראשיות. כל תיקייה כזו תופיע באתר כנושא.</li>
                    <li>להעלות לכל תיקייה מצגות, סרטונים ותמונות, ישירות או דרך תתי-תיקיות.</li>
                    <li>לשתף את תיקיית השורש עם הרשאת Viewer.</li>
                    <li>להזין כאן את Folder ID ואת ה-API Key של Google Drive API.</li>
                  </ol>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <label className="text-xs font-bold text-gray-600">Folder ID</label>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      מוגדר מראש
                    </span>
                  </div>
                  <input
                    className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-400 font-mono text-sm"
                    placeholder="1zQwHBCZaMG0IqeUhaciXECaTNDNgtjxO"
                    value={driveConfig.folderId}
                    onChange={event =>
                      setDriveConfig(prev => ({ ...prev, folderId: event.target.value.trim() }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">
                    API Key — <span className="text-primary font-black">נדרש כדי להתחבר ל-Drive</span>
                  </label>
                  <input
                    type="password"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:border-primary transition-all placeholder:text-gray-400 font-mono text-sm"
                    placeholder="AIzaSy..."
                    value={driveConfig.apiKey}
                    onChange={event =>
                      setDriveConfig(prev => ({ ...prev, apiKey: event.target.value.trim() }))
                    }
                  />
                </div>
              </div>

              {driveStatus === 'ok' && driveCount && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-emerald-700 text-sm font-bold mb-3">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    חיבור תקין. הסנכרון זיהה נושאים ותכנים מתוך Google Drive.
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="rounded-2xl bg-white border border-emerald-100 p-3 text-center">
                      <div className="text-2xl font-black text-slate-950">{driveCount.topics}</div>
                      <div className="text-xs font-bold text-slate-500">נושאים</div>
                    </div>
                    <div className="rounded-2xl bg-white border border-emerald-100 p-3 text-center">
                      <div className="text-2xl font-black text-slate-950">{driveCount.presentations}</div>
                      <div className="text-xs font-bold text-slate-500">מצגות</div>
                    </div>
                    <div className="rounded-2xl bg-white border border-emerald-100 p-3 text-center">
                      <div className="text-2xl font-black text-slate-950">{driveCount.videos}</div>
                      <div className="text-xs font-bold text-slate-500">סרטונים</div>
                    </div>
                    <div className="rounded-2xl bg-white border border-emerald-100 p-3 text-center">
                      <div className="text-2xl font-black text-slate-950">{driveCount.images}</div>
                      <div className="text-xs font-bold text-slate-500">תמונות</div>
                    </div>
                  </div>
                </div>
              )}

              {driveStatus === 'error' && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{driveError}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleTestDrive}
                  disabled={!driveConfig.folderId || !driveConfig.apiKey || driveStatus === 'loading'}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-3.5 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {driveStatus === 'loading' ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      סורק...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      בדוק חיבור
                    </>
                  )}
                </button>

                <button
                  onClick={handleSaveDrive}
                  disabled={!driveConfig.folderId || !driveConfig.apiKey}
                  className="flex-1 border-2 border-primary text-primary hover:bg-primary/5 py-3.5 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  שמור הגדרות
                </button>
              </div>

              {gdrive.isConfigured() && (
                <button
                  onClick={handleClearDrive}
                  className="w-full text-red-400 hover:text-red-600 text-sm font-bold py-2 transition-colors"
                >
                  נקה הגדרות
                </button>
              )}

              {drivePreviewTopics.length > 0 && (
                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                        נושאים מסונכרנים
                      </p>
                      <h4 className="text-lg font-black text-slate-950">כך התיקיות שלך יופיעו באתר</h4>
                    </div>
                    <div className="text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1">
                      מתעדכן מה-Drive
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {drivePreviewTopics.map(topic => (
                      <div
                        key={topic.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-black text-slate-950">{topic.label}</p>
                            <p className="text-xs text-slate-500 mt-1 leading-6">{topic.description}</p>
                          </div>
                          <div className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600">
                            Topic
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                            {topic.counts.presentations} חומרים
                          </span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                            {topic.counts.videos} סרטונים
                          </span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                            {topic.counts.images} תמונות
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'monitoring' && (
            <div className="space-y-6">
              <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-sm text-sky-900 leading-relaxed">
                <p className="font-bold mb-2">תחומי מעקב ועדכונים מהרשת</p>
                <p className="font-medium">
                  כל נושא מעקב יוצר פיד חדשות חי שמוזן למסך הראשי ולחיפוש. אפשר להגדיר שם,
                  שאילתת חיפוש, קטגוריה וכמות פריטים למשיכה.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <input
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:border-primary transition-all placeholder:text-gray-400"
                  placeholder="שם הנושא, למשל: בינה מלאכותית"
                  value={topicForm.label}
                  onChange={event => setTopicForm(prev => ({ ...prev, label: event.target.value }))}
                />

                <input
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:border-primary transition-all placeholder:text-gray-400"
                  placeholder='שאילתת חיפוש, למשל: "artificial intelligence"'
                  value={topicForm.query}
                  onChange={event => setTopicForm(prev => ({ ...prev, query: event.target.value }))}
                />

                <select
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:border-primary transition-all"
                  value={topicForm.category}
                  onChange={event =>
                    setTopicForm(prev => ({ ...prev, category: event.target.value }))
                  }
                >
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min={1}
                  max={12}
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:border-primary transition-all"
                  placeholder="מספר פריטים"
                  value={topicForm.maxItems}
                  onChange={event =>
                    setTopicForm(prev => ({ ...prev, maxItems: event.target.value }))
                  }
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveTopic}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white py-3.5 rounded-2xl font-bold transition-all"
                >
                  {topicEditingId ? 'שמור נושא' : 'הוסף נושא מעקב'}
                </button>

                {topicEditingId && (
                  <button
                    onClick={resetTopicForm}
                    className="px-5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-2xl font-bold transition-all"
                  >
                    ביטול
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {knowledgeTopics.length === 0 && (
                  <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-200 text-gray-500 font-medium">
                    אין תחומי מעקב מוגדרים עדיין.
                  </div>
                )}

                {knowledgeTopics.map(topic => (
                  <div
                    key={topic.id}
                    className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-gray-900 font-bold">{topic.label}</h4>
                          <span
                            className={`text-[11px] font-bold px-2 py-1 rounded-full ${
                              topic.enabled === false
                                ? 'bg-gray-200 text-gray-600'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {topic.enabled === false ? 'מושהה' : 'פעיל'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 break-words">{topic.query}</p>
                        <p className="text-xs font-bold text-primary mt-2">
                          {topic.category} · עד {topic.maxItems} פריטים
                        </p>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditTopic(topic)}
                          className="p-2 rounded-xl text-gray-400 hover:text-primary hover:bg-white transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleTopic(topic.id)}
                          className="px-3 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-white transition-all"
                        >
                          {topic.enabled === false ? 'הפעל' : 'השהה'}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`למחוק את נושא המעקב "${topic.label}"?`)) {
                              handleDeleteTopic(topic.id);
                            }
                          }}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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
