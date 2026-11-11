import React, { useState } from 'react';
import { X, Play, Code, AlertCircle, Check } from 'lucide-react';

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('');
  const [rawIframe, setRawIframe] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleIframeChange = (val) => {
    setRawIframe(val);
    setError('');

    // Try extracting src attribute
    let src = '';
    if (val.trim().startsWith('<iframe')) {
      const match = val.match(/src=["']([^"']+)["']/i);
      if (match) {
        src = match[1];
      }
    } else if (val.trim().startsWith('http://') || val.trim().startsWith('https://') || val.trim().startsWith('/')) {
      src = val.trim();
    }
    setPreviewSrc(src);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Game title is required.');
      return;
    }

    if (!rawIframe.trim()) {
      setError('Please provide an <iframe> code or game URL.');
      return;
    }

    // Build standard iframe tag if bare URL was provided
    let finalIframe = rawIframe.trim();
    let embedUrl = previewSrc;

    if (!finalIframe.startsWith('<iframe')) {
      embedUrl = finalIframe;
      finalIframe = `<iframe src="${finalIframe}" title="${title.trim()}" class="w-full h-full border-0 rounded-xl" allowfullscreen sandbox="allow-scripts allow-same-origin allow-modals"></iframe>`;
    }

    const newId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `custom-game-${Date.now()}`;

    const newGame = {
      id: newId,
      title: title.trim(),
      category: category,
      description: description.trim() || 'Custom community-added game.',
      controls: controls.trim() || 'Keyboard and mouse controls',
      tags: [category, 'Custom'],
      rating: 5.0,
      plays: 1,
      featured: false,
      accentColor: '#38bdf8',
      icon: 'Gamepad2',
      embedUrl: embedUrl,
      iframe: finalIframe
    };

    onAddGame(newGame);
    onClose();
    // Reset form
    setTitle('');
    setDescription('');
    setControls('');
    setRawIframe('');
    setPreviewSrc('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-slate-100">
              Add New Game (Iframe)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Iframe Snippet or Game URL *
            </label>
            <textarea
              rows={3}
              value={rawIframe}
              onChange={(e) => handleIframeChange(e.target.value)}
              placeholder='<iframe src="https://example.com/game" width="100%" height="100%" ...></iframe>'
              className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-sky-500 transition-colors resize-none"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Paste the complete <code className="text-sky-400">&lt;iframe&gt;</code> HTML tag or a direct HTTPS URL. This will be stored directly into the games JSON.
            </p>
          </div>

          {/* Live Preview Box */}
          {previewSrc && (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
                <span className="flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  Live Iframe Sandbox Preview
                </span>
                <span className="text-[10px] text-slate-500 font-mono truncate max-w-xs">{previewSrc}</span>
              </div>
              <div className="w-full h-44 rounded-lg border border-slate-800 bg-slate-950 overflow-hidden relative">
                <iframe
                  src={previewSrc}
                  title="Game preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-modals"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Game Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Retro Space Blaster"
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
              >
                <option value="Arcade">Arcade</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Action">Action</option>
                <option value="Classic">Classic</option>
                <option value="Retro">Retro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of what the game is about..."
              className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Controls & Keybinds
            </label>
            <input
              type="text"
              value={controls}
              onChange={(e) => setControls(e.target.value)}
              placeholder="e.g. WASD to move, Space to shoot"
              className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-500 hover:bg-sky-400 rounded-lg transition-colors shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Save Game to JSON</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
