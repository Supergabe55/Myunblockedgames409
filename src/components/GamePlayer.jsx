import React, { useRef, useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  ExternalLink, 
  Heart, 
  Code, 
  Check, 
  HelpCircle,
  EyeOff
} from 'lucide-react';

export const GamePlayer = ({
  game,
  isFavorite,
  onBack,
  onToggleFavorite,
  onOpenCloak
}) => {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Extract src from iframe string if needed, or use embedUrl
  const getIframeSrc = () => {
    let src = game.embedUrl;
    if (!src && game.iframe) {
      const match = game.iframe.match(/src=["']([^"']+)["']/);
      src = match ? match[1] : '';
    }
    if (src && src.startsWith('/') && !src.startsWith('//')) {
      src = '.' + src;
    }
    return src || '';
  };

  const iframeSrc = getIframeSrc();

  // Handle Fullscreen change
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  // Open in stealth blank window
  const openInAboutBlank = () => {
    const win = window.open('about:blank', '_blank');
    if (!win) {
      alert('Popup was blocked. Please allow popups for unblocked game viewing.');
      return;
    }
    win.document.title = 'Google Docs';
    win.document.body.style.margin = '0';
    win.document.body.style.height = '100vh';
    win.document.body.style.overflow = 'hidden';
    win.document.body.style.background = '#090d16';

    const iframe = win.document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.margin = '0';
    const resolvedUrl = new URL(iframeSrc, window.location.href).href;
    iframe.src = resolvedUrl;
    iframe.allowFullscreen = true;
    win.document.body.appendChild(iframe);
  };

  const copyIframeCode = () => {
    navigator.clipboard.writeText(game.iframe).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto w-full pb-10">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Games Catalog</span>
          </button>
          
          <div className="h-4 w-px bg-slate-800" />

          <div>
            <h1 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              {game.title}
            </h1>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>{game.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{game.rating || 4.8} ★</span>
            </div>
          </div>
        </div>

        {/* Player controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={(e) => onToggleFavorite(e, game.id)}
            title={isFavorite ? "Remove favorite" : "Add to favorites"}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
              isFavorite 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={handleReload}
            title="Reload game frame"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={openInAboutBlank}
            title="Open in about:blank (Stealth unblocked tab)"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-medium transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>about:blank</span>
          </button>

          <button
            onClick={copyIframeCode}
            title="Copy stored iframe tag from JSON"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-medium transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{copiedCode ? 'Copied' : 'JSON Iframe'}</span>
          </button>

          <button
            onClick={onOpenCloak}
            title="Stealth tab disguise"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-medium transition-colors"
          >
            <EyeOff className="w-3.5 h-3.5 text-sky-400" />
            <span>Tab Cloak</span>
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-slate-950 font-semibold text-xs transition-colors shadow-sm"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Main Iframe Gaming Container */}
      <div 
        ref={containerRef}
        className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl transition-all ${
          isFullscreen ? 'h-screen w-screen rounded-none border-none p-0' : 'aspect-[16/10] min-h-[460px] max-h-[720px]'
        }`}
      >
        <iframe
          ref={iframeRef}
          src={iframeSrc}
          title={game.title}
          className="w-full h-full border-0 block"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
        />
      </div>

      {/* Game Details & Controls panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* About & description */}
        <div className="md:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
          <h2 className="text-base font-bold text-slate-100 mb-2">
            About {game.title}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {game.description}
          </p>

          {/* Tags */}
          {game.tags && game.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 font-medium">
              <span className="text-slate-500">Categories:</span>
              {game.tags.map((tag, idx) => (
                <React.Fragment key={tag}>
                  <span>{tag}</span>
                  {idx < game.tags.length - 1 && <span aria-hidden="true">·</span>}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Controls & Quick Info */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
              Controls & Keybinds
            </h3>
            <p className="text-xs text-slate-300 font-medium bg-slate-950/60 border border-slate-800 p-3 rounded-lg leading-relaxed">
              {game.controls || 'Arrow Keys / WASD, Space to trigger, Mouse to interact.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>JSON ID: {game.id}</span>
            <span className="text-emerald-400">Offline Iframe Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
