import React, { useEffect, useRef, useState, useCallback } from 'react';

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

interface PdfViewerProps {
  url: string;
  title: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url, title }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const renderTaskRef = useRef<any>(null);

  // Load PDF
  useEffect(() => {
    let cancelled = false;
    const loadPdf = async () => {
      setLoading(true);
      try {
        // Dynamic import for pdf.js
        const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.min.mjs' as any);
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.worker.min.mjs';

        const doc = await pdfjsLib.getDocument(url).promise;
        if (!cancelled) {
          setPdfDoc(doc);
          setTotalPages(doc.numPages);
          setCurrentPage(1);
          setLoading(false);
        }
      } catch (err) {
        console.error('PDF load error:', err);
        setLoading(false);
      }
    };
    loadPdf();
    return () => { cancelled = true; };
  }, [url]);

  // Render page
  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current || rendering) return;
    setRendering(true);

    try {
      // Cancel previous render
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }

      const page = await pdfDoc.getPage(pageNum);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const viewport = page.getViewport({ scale: scale * 2 }); // 2x for retina
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${viewport.width / 2}px`;
      canvas.style.height = `${viewport.height / 2}px`;

      const renderTask = page.render({ canvasContext: ctx, viewport });
      renderTaskRef.current = renderTask;
      await renderTask.promise;
    } catch (err: any) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('Render error:', err);
      }
    }
    setRendering(false);
  }, [pdfDoc, scale, rendering]);

  useEffect(() => {
    if (pdfDoc) renderPage(currentPage);
  }, [pdfDoc, currentPage, scale]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const zoomIn = () => setScale(s => Math.min(s + 0.25, 3));
  const zoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));
  const resetZoom = () => setScale(1);

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToPage(currentPage + 1); // RTL
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToPage(currentPage - 1); // RTL
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentPage, totalPages]);

  if (loading) {
    return (
      <div className="aspect-[16/9] w-full flex items-center justify-center bg-black/50 rounded-3xl">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto relative">
            <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-400 font-bold">טוען מצגת...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5 group ${isFullscreen ? 'flex flex-col' : ''}`}>
      {/* Canvas area */}
      <div className={`${isFullscreen ? 'flex-1' : 'aspect-[16/9]'} w-full relative overflow-auto flex items-center justify-center bg-[#0a0a0a]`}>
        <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />

        {/* Side navigation arrows */}
        <button
          onClick={() => goToPage(currentPage + 1)} // RTL: left = next
          disabled={currentPage >= totalPages}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-primary/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all disabled:opacity-0 backdrop-blur-sm"
        >
          <span className="material-icons">chevron_left</span>
        </button>
        <button
          onClick={() => goToPage(currentPage - 1)} // RTL: right = prev
          disabled={currentPage <= 1}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-primary/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all disabled:opacity-0 backdrop-blur-sm"
        >
          <span className="material-icons">chevron_right</span>
        </button>
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface/90 backdrop-blur-sm border-t border-white/5">
        {/* Page navigation */}
        <div className="flex items-center gap-2">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/10 transition-all">
            <span className="material-icons text-lg">navigate_next</span>
          </button>
          <span className="text-white text-sm font-bold min-w-[80px] text-center" dir="ltr">
            {currentPage} / {totalPages}
          </span>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/10 transition-all">
            <span className="material-icons text-lg">navigate_before</span>
          </button>
        </div>

        {/* Page slider */}
        <input
          type="range"
          min={1}
          max={totalPages}
          value={currentPage}
          onChange={(e) => goToPage(Number(e.target.value))}
          className="flex-1 mx-4 h-1 accent-primary cursor-pointer"
          dir="ltr"
        />

        {/* Zoom & fullscreen */}
        <div className="flex items-center gap-1">
          <button onClick={zoomOut} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-all">
            <span className="material-icons text-lg">remove</span>
          </button>
          <button onClick={resetZoom} className="text-gray-300 text-xs font-bold min-w-[45px] text-center hover:text-primary transition-all">
            {Math.round(scale * 100)}%
          </button>
          <button onClick={zoomIn} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-all">
            <span className="material-icons text-lg">add</span>
          </button>
          <div className="w-px h-5 bg-white/10 mx-1"></div>
          <button onClick={toggleFullscreen} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-all">
            <span className="material-icons text-lg">{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
