import React, { useEffect, useState } from 'react';
import { BrainCircuit, ChevronLeft, ChevronRight, Download, ExternalLink, FileText, X } from 'lucide-react';
import { Presentation } from '../types';
import PdfViewer from './PdfViewer';
import Quiz from './Quiz';
import WorldScene, { WorldSceneVariant } from './WorldScene';

type ThemeKey = 'neutral' | 'cyber' | 'phishing' | 'espionage' | 'cloud';

interface PresentationModalProps {
  presentation: Presentation | null;
  onClose: () => void;
  themeKey?: ThemeKey;
  sceneVariant?: WorldSceneVariant;
}

const MODAL_THEME: Record<
  ThemeKey,
  {
    overlay: string;
    shell: string;
    header: string;
    title: string;
    chip: string;
    divider: string;
    toggleWrap: string;
    toggleActive: string;
    toggleIdle: string;
    primaryAction: string;
    secondaryAction: string;
    close: string;
    slideStage: string;
    stageOverlay: string;
    slideFooter: string;
    dotActive: string;
    dotIdle: string;
    quizWrap: string;
    emptyWrap: string;
    emptyIcon: string;
    emptyTitle: string;
    emptyText: string;
    description: string;
  }
> = {
  neutral: {
    overlay: 'bg-black/70',
    shell: 'bg-white/94 border-gray-200',
    header: 'bg-white/84',
    title: 'text-gray-900',
    chip: 'bg-primary/10 text-primary border border-primary/20',
    divider: 'border-gray-200',
    toggleWrap: 'bg-surface-light border border-gray-200',
    toggleActive: 'bg-white text-gray-900 shadow-sm border border-gray-200',
    toggleIdle: 'text-gray-500 hover:text-gray-700',
    primaryAction: 'bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20',
    secondaryAction: 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200',
    close: 'bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-700',
    slideStage: 'bg-gray-950',
    stageOverlay: 'bg-black/35',
    slideFooter: 'bg-white border-t border-gray-200',
    dotActive: 'bg-primary',
    dotIdle: 'bg-gray-300 hover:bg-gray-400',
    quizWrap: 'bg-surface-light',
    emptyWrap: 'bg-surface-light',
    emptyIcon: 'bg-gray-100 text-gray-300',
    emptyTitle: 'text-gray-900',
    emptyText: 'text-gray-500',
    description: 'bg-surface-light border-t border-gray-200 text-gray-500',
  },
  cyber: {
    overlay: 'bg-[#010503]/82',
    shell: 'bg-[#07120c]/92 border-emerald-400/15',
    header: 'bg-[#08130d]/84',
    title: 'text-emerald-50',
    chip: 'bg-emerald-500/10 text-emerald-200 border border-emerald-400/20',
    divider: 'border-emerald-500/12',
    toggleWrap: 'bg-emerald-500/8 border border-emerald-500/14',
    toggleActive: 'bg-emerald-400 text-slate-950 shadow-sm',
    toggleIdle: 'text-emerald-100/68 hover:text-white',
    primaryAction: 'bg-emerald-500/12 hover:bg-emerald-500/20 text-emerald-100 border border-emerald-400/20',
    secondaryAction: 'bg-white/5 hover:bg-white/10 text-emerald-50 border border-white/10',
    close: 'bg-emerald-500/10 hover:bg-emerald-500/18 text-emerald-100/70 hover:text-white',
    slideStage: 'bg-[#02110a]',
    stageOverlay: 'bg-emerald-950/22',
    slideFooter: 'bg-[#08130d] border-t border-emerald-500/12',
    dotActive: 'bg-emerald-400',
    dotIdle: 'bg-emerald-100/18 hover:bg-emerald-100/30',
    quizWrap: 'bg-[#08130d]',
    emptyWrap: 'bg-[#08130d]',
    emptyIcon: 'bg-emerald-500/10 text-emerald-200/35',
    emptyTitle: 'text-emerald-50',
    emptyText: 'text-emerald-100/70',
    description: 'bg-[#08130d] border-t border-emerald-500/12 text-emerald-100/72',
  },
  phishing: {
    overlay: 'bg-[#090501]/82',
    shell: 'bg-[#1b1107]/92 border-amber-300/15',
    header: 'bg-[#1a1007]/84',
    title: 'text-amber-50',
    chip: 'bg-amber-500/10 text-amber-100 border border-amber-300/20',
    divider: 'border-amber-500/12',
    toggleWrap: 'bg-amber-500/8 border border-amber-500/14',
    toggleActive: 'bg-amber-300 text-slate-950 shadow-sm',
    toggleIdle: 'text-amber-100/70 hover:text-white',
    primaryAction: 'bg-amber-500/12 hover:bg-amber-500/20 text-amber-100 border border-amber-300/20',
    secondaryAction: 'bg-white/5 hover:bg-white/10 text-amber-50 border border-white/10',
    close: 'bg-amber-500/10 hover:bg-amber-500/18 text-amber-100/70 hover:text-white',
    slideStage: 'bg-[#1a1007]',
    stageOverlay: 'bg-amber-950/22',
    slideFooter: 'bg-[#1a1007] border-t border-amber-500/12',
    dotActive: 'bg-amber-300',
    dotIdle: 'bg-amber-100/18 hover:bg-amber-100/30',
    quizWrap: 'bg-[#1a1007]',
    emptyWrap: 'bg-[#1a1007]',
    emptyIcon: 'bg-amber-500/10 text-amber-200/35',
    emptyTitle: 'text-amber-50',
    emptyText: 'text-amber-100/70',
    description: 'bg-[#1a1007] border-t border-amber-500/12 text-amber-100/72',
  },
  espionage: {
    overlay: 'bg-[#04050a]/84',
    shell: 'bg-[#121725]/92 border-violet-300/15',
    header: 'bg-[#0f1320]/84',
    title: 'text-slate-50',
    chip: 'bg-violet-500/10 text-violet-100 border border-violet-300/20',
    divider: 'border-violet-500/12',
    toggleWrap: 'bg-violet-500/8 border border-violet-500/14',
    toggleActive: 'bg-violet-400 text-white shadow-sm',
    toggleIdle: 'text-slate-200/72 hover:text-white',
    primaryAction: 'bg-violet-500/12 hover:bg-violet-500/20 text-violet-100 border border-violet-300/20',
    secondaryAction: 'bg-white/5 hover:bg-white/10 text-slate-100 border border-white/10',
    close: 'bg-violet-500/10 hover:bg-violet-500/18 text-violet-100/70 hover:text-white',
    slideStage: 'bg-[#080b14]',
    stageOverlay: 'bg-violet-950/20',
    slideFooter: 'bg-[#0f1320] border-t border-violet-500/12',
    dotActive: 'bg-violet-400',
    dotIdle: 'bg-slate-100/18 hover:bg-slate-100/28',
    quizWrap: 'bg-[#0f1320]',
    emptyWrap: 'bg-[#0f1320]',
    emptyIcon: 'bg-violet-500/10 text-violet-200/35',
    emptyTitle: 'text-slate-50',
    emptyText: 'text-slate-200/70',
    description: 'bg-[#0f1320] border-t border-violet-500/12 text-slate-200/72',
  },
  cloud: {
    overlay: 'bg-[#031019]/82',
    shell: 'bg-[#0d1d2a]/92 border-sky-300/15',
    header: 'bg-[#0d1d2a]/84',
    title: 'text-sky-50',
    chip: 'bg-sky-500/10 text-sky-100 border border-sky-300/20',
    divider: 'border-sky-500/12',
    toggleWrap: 'bg-sky-500/8 border border-sky-500/14',
    toggleActive: 'bg-sky-300 text-slate-950 shadow-sm',
    toggleIdle: 'text-sky-100/70 hover:text-white',
    primaryAction: 'bg-sky-500/12 hover:bg-sky-500/20 text-sky-100 border border-sky-300/20',
    secondaryAction: 'bg-white/5 hover:bg-white/10 text-sky-50 border border-white/10',
    close: 'bg-sky-500/10 hover:bg-sky-500/18 text-sky-100/70 hover:text-white',
    slideStage: 'bg-[#06131e]',
    stageOverlay: 'bg-sky-950/20',
    slideFooter: 'bg-[#0d1d2a] border-t border-sky-500/12',
    dotActive: 'bg-sky-300',
    dotIdle: 'bg-sky-100/18 hover:bg-sky-100/28',
    quizWrap: 'bg-[#0d1d2a]',
    emptyWrap: 'bg-[#0d1d2a]',
    emptyIcon: 'bg-sky-500/10 text-sky-200/35',
    emptyTitle: 'text-sky-50',
    emptyText: 'text-sky-100/70',
    description: 'bg-[#0d1d2a] border-t border-sky-500/12 text-sky-100/72',
  },
};

const PresentationModal: React.FC<PresentationModalProps> = ({
  presentation,
  onClose,
  themeKey = 'neutral',
  sceneVariant = 'neutral',
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content');
  const [currentSlide, setCurrentSlide] = useState(0);
  const theme = MODAL_THEME[themeKey];

  useEffect(() => {
    setActiveTab('content');
    setCurrentSlide(0);
  }, [presentation?.id]);

  useEffect(() => {
    if (!presentation) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (activeTab !== 'content') return;

      const slides = presentation.slides;
      if (!slides) return;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        setCurrentSlide(index => Math.min(index + 1, slides.length - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        setCurrentSlide(index => Math.max(index - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [presentation, activeTab, onClose]);

  if (!presentation) return null;

  const hasSlides = presentation.slides && presentation.slides.length > 0;
  const hasQuiz = presentation.quiz && presentation.quiz.length > 0;
  const isPdf = presentation.driveUrl && (presentation.driveUrl.endsWith('.pdf') || presentation.driveUrl.includes('/pdfs/'));
  const hasValidLink = presentation.driveUrl && presentation.driveUrl !== '#' && presentation.driveUrl.trim() !== '';

  const getEmbedLink = (url: string) => {
    if (!url || !url.includes('drive.google.com')) return url;

    let embedUrl = url;
    if (embedUrl.includes('/view')) embedUrl = embedUrl.replace('/view', '/preview');
    else if (embedUrl.includes('/edit')) embedUrl = embedUrl.replace('/edit', '/preview');
    else if (!embedUrl.includes('/preview')) {
      const parts = embedUrl.split('?');
      embedUrl = parts[0] + (parts[0].endsWith('/') ? '' : '/') + 'preview';
      if (parts[1]) embedUrl += `?${parts[1]}`;
    }

    return embedUrl;
  };

  const totalSlides = hasSlides ? presentation.slides!.length : 0;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-0 backdrop-blur-xl sm:p-4 ${theme.overlay}`} dir="rtl">
      <div className={`relative flex h-full w-full flex-col overflow-hidden border shadow-2xl animate-scale-in sm:h-[92vh] sm:max-w-6xl sm:rounded-[2rem] ${theme.shell}`}>
        <div className="absolute inset-x-0 top-0 h-56 overflow-hidden">
          <WorldScene variant={sceneVariant} mode="panel" className="opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-transparent" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_26%)]" />

        <div className={`relative z-10 flex items-center justify-between border-b p-5 flex-shrink-0 ${theme.header} ${theme.divider}`}>
          <div className="flex min-w-0 flex-1 items-center gap-4 overflow-hidden">
            <div className="min-w-0">
              <h2 className={`truncate text-lg font-black tracking-tight sm:text-2xl ${theme.title}`}>{presentation.title}</h2>
              <div className="mt-1 flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${theme.chip}`}>{presentation.category}</span>
                {presentation.author && (
                  <span className="text-xs font-medium text-white/45">{presentation.author}</span>
                )}
              </div>
            </div>
          </div>

          <div className="mr-4 flex flex-shrink-0 items-center gap-3">
            {hasQuiz && (
              <div className={`flex rounded-xl p-1 ${theme.toggleWrap}`}>
                <button
                  onClick={() => setActiveTab('content')}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                    activeTab === 'content' ? theme.toggleActive : theme.toggleIdle
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">מצגת</span>
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                    activeTab === 'quiz' ? theme.toggleActive : theme.toggleIdle
                  }`}
                >
                  <BrainCircuit className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">תרגול</span>
                </button>
              </div>
            )}

            {hasValidLink &&
              (isPdf ? (
                <a
                  href={presentation.driveUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hidden items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors sm:flex ${theme.primaryAction}`}
                >
                  <Download className="h-3.5 w-3.5" />
                  הורד PDF
                </a>
              ) : (
                <a
                  href={presentation.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hidden items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors sm:flex ${theme.secondaryAction}`}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  פתח
                </a>
              ))}

            <div className={`h-8 w-px ${theme.divider} border-r`} />
            <button onClick={onClose} className={`rounded-full p-2.5 transition-colors ${theme.close}`}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative z-10 flex-grow overflow-hidden">
          {activeTab === 'quiz' && hasQuiz ? (
            <div className={`h-full overflow-y-auto custom-scroll ${theme.quizWrap}`}>
              <Quiz questions={presentation.quiz!} />
            </div>
          ) : (
            <div className="flex h-full flex-col">
              {hasSlides ? (
                <div className={`flex flex-grow flex-col ${theme.slideStage}`}>
                  <div className="relative flex flex-grow items-center justify-center p-4">
                    <div className={`absolute inset-0 ${theme.stageOverlay}`} />
                    <img
                      src={presentation.slides![currentSlide].imageUrl}
                      alt={`שקף ${currentSlide + 1}`}
                      className="relative z-10 max-h-full max-w-full rounded-xl border border-white/10 object-contain shadow-2xl"
                      referrerPolicy="no-referrer"
                    />

                    <button
                      onClick={() => setCurrentSlide(index => Math.min(index + 1, totalSlides - 1))}
                      disabled={currentSlide === totalSlides - 1}
                      className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white disabled:cursor-not-allowed disabled:opacity-20"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => setCurrentSlide(index => Math.max(index - 1, 0))}
                      disabled={currentSlide === 0}
                      className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white disabled:cursor-not-allowed disabled:opacity-20"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>

                  <div className={`flex h-16 items-center justify-between px-6 flex-shrink-0 ${theme.slideFooter}`}>
                    <span className="text-sm font-bold text-white/65">
                      {currentSlide + 1} / {totalSlides}
                    </span>
                    <div className="hide-scrollbar flex max-w-xs gap-1.5 overflow-x-auto">
                      {presentation.slides!.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`h-2 flex-none rounded-full transition-all ${
                            index === currentSlide ? `w-7 ${theme.dotActive}` : `w-2 ${theme.dotIdle}`
                          }`}
                        />
                      ))}
                    </div>
                    <span className="hidden text-xs text-white/40 sm:block">← → לניווט</span>
                  </div>
                </div>
              ) : isPdf && hasValidLink ? (
                <PdfViewer url={presentation.driveUrl} title={presentation.title} />
              ) : hasValidLink ? (
                <div className="flex-grow bg-gray-100">
                  <iframe
                    src={getEmbedLink(presentation.driveUrl)}
                    className="h-full w-full border-0"
                    allow="autoplay"
                    title={presentation.title}
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className={`flex flex-grow flex-col items-center justify-center gap-6 p-12 text-center ${theme.emptyWrap}`}>
                  <div className={`flex h-20 w-20 items-center justify-center rounded-full ${theme.emptyIcon}`}>
                    <FileText className="h-10 w-10" />
                  </div>
                  <div>
                    <p className={`mb-2 text-lg font-bold ${theme.emptyTitle}`}>תוכן המצגת אינו זמין כרגע</p>
                    <p className={`text-sm ${theme.emptyText}`}>פנה למנהל המערכת להוספת הקובץ</p>
                  </div>
                </div>
              )}

              <div className={`flex-shrink-0 p-5 sm:p-6 ${theme.description}`}>
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <p className="flex-1 text-sm italic leading-relaxed">
                    "{presentation.description}"
                  </p>
                  <div className="flex flex-shrink-0 gap-3">
                    {hasValidLink && isPdf && (
                      <a
                        href={presentation.driveUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all sm:hidden ${theme.primaryAction}`}
                      >
                        <Download className="h-4 w-4" />
                        הורד
                      </a>
                    )}
                    {hasQuiz && (
                      <button
                        onClick={() => setActiveTab('quiz')}
                        className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${theme.primaryAction}`}
                      >
                        <BrainCircuit className="h-4 w-4" />
                        בדוק את עצמך
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PresentationModal;
