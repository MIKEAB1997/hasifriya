
import React from 'react';
import { Presentation } from '../types';
import PdfViewer from './PdfViewer';

interface PresentationModalProps {
  presentation: Presentation | null;
  onClose: () => void;
}

const PresentationModal: React.FC<PresentationModalProps> = ({ presentation, onClose }) => {
  if (!presentation) return null;

  const isPdf = presentation.driveUrl.endsWith('.pdf') || presentation.driveUrl.includes('/pdfs/');
  const hasValidLink = presentation.driveUrl && presentation.driveUrl !== '#' && presentation.driveUrl.trim() !== '';

  // Google Drive embed helper
  const getEmbedLink = (url: string) => {
    if (!url || !url.includes('drive.google.com')) return url;
    let embedUrl = url;
    if (embedUrl.includes('/view')) embedUrl = embedUrl.replace('/view', '/preview');
    else if (embedUrl.includes('/edit')) embedUrl = embedUrl.replace('/edit', '/preview');
    else if (!embedUrl.includes('/preview')) {
      const parts = embedUrl.split('?');
      embedUrl = parts[0] + (parts[0].endsWith('/') ? '' : '/') + 'preview';
      if (parts[1]) embedUrl += '?' + parts[1];
    }
    return embedUrl;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black/95 backdrop-blur-xl transition-all duration-300">
      <div className="bg-background w-full h-full sm:h-auto sm:max-w-6xl sm:max-h-[98vh] sm:rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(234,42,51,0.2)] animate-in fade-in slide-in-from-bottom-4 duration-500 border border-white/10">

        {/* כותרת */}
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-surface/30">
          <div className="flex flex-col gap-1 overflow-hidden">
            <h2 className="text-white font-black text-xl sm:text-3xl truncate tracking-tight">{presentation.title}</h2>
            <div className="flex items-center gap-2">
               <span className="bg-primary/20 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">{presentation.category}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-all p-3 bg-white/5 rounded-full hover:bg-white/10">
            <span className="material-icons text-2xl">close</span>
          </button>
        </div>

        {/* תוכן המצגת */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-0 sm:p-8 space-y-8">

          {/* נגן המצגת */}
          {isPdf && hasValidLink ? (
            <PdfViewer url={presentation.driveUrl} title={presentation.title} />
          ) : hasValidLink ? (
            <div className="relative w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5 group">
               <div className="aspect-[16/9] w-full relative">
                  <iframe
                    src={getEmbedLink(presentation.driveUrl)}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="autoplay"
                    title={presentation.title}
                    loading="lazy"
                  ></iframe>
               </div>
            </div>
          ) : (
            <div className="relative w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5">
               <div className="aspect-[16/9] w-full relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/20 gap-6 p-12 text-center">
                     <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center">
                        <span className="material-icons text-6xl text-gray-700">description</span>
                     </div>
                     <div className="space-y-2">
                        <p className="text-white font-bold text-xl">הצגת תוכן</p>
                        <p className="text-gray-500 max-w-sm">לא הוגדר קישור תקין. פנה למנהל המערכת.</p>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* פרטים ופעולות */}
          <div className="px-6 py-4 sm:p-0">
            <div className="flex flex-col lg:flex-row gap-8">

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                   <span className="material-icons text-lg">auto_awesome</span>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">תקציר הידע</h4>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed font-light italic">"{presentation.description}"</p>
              </div>

              {/* כפתורי פעולה */}
              {hasValidLink && (
                <div className="flex flex-col sm:flex-row lg:flex-col gap-4 sm:w-auto lg:w-72">
                  {isPdf ? (
                    <a href={presentation.driveUrl} download target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-3 bg-primary hover:bg-red-700 text-white font-bold py-5 px-8 rounded-2xl transition-all shadow-xl shadow-primary/20 active:scale-95">
                      <span className="material-icons">download</span>
                      <span>הורדת המצגת</span>
                    </a>
                  ) : (
                    <>
                      <a href={presentation.driveUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-3 bg-primary hover:bg-red-700 text-white font-bold py-5 px-8 rounded-2xl transition-all shadow-xl shadow-primary/20 active:scale-95">
                        <span className="material-icons">open_in_new</span>
                        <span>צפייה ב-Google Drive</span>
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-8 text-gray-500">
               <div className="flex items-center gap-2">
                  <span className="material-icons text-sm opacity-50">lock_outline</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">תוכן פנימי מאובטח</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="material-icons text-sm opacity-50">verified_user</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">זמין לצוות העובדים</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationModal;
