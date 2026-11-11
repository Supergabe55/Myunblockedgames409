import React from 'react';
import { Plus, EyeOff, FileCode } from 'lucide-react';

export const Header = ({
  activeCategory,
  onSelectCategory,
  onOpenAddModal,
  onOpenJsonManager,
  onOpenCloakModal,
  onLogoClick,
}) => {
  const navLinks = [
    { id: 'all', label: 'All Games' },
    { id: 'Arcade', label: 'Arcade' },
    { id: 'Puzzle', label: 'Puzzle' },
    { id: 'Action', label: 'Action' },
    { id: 'favorites', label: 'Favorites' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
      {/* Zone 1: Single text element wordmark */}
      <div 
        onClick={onLogoClick}
        className="flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 group select-none"
      >
        <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
          <span className="font-bold text-base leading-none">N</span>
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-100 group-hover:text-sky-400 transition-colors">
          NovaPlay Games
        </span>
      </div>

      {/* Zone 2: 4-5 concise single-line nav links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        {navLinks.map((link) => {
          const isActive = activeCategory === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onSelectCategory(link.id)}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-100 relative py-1 ${
                isActive ? 'text-sky-400 font-semibold' : 'text-slate-400'
              }`}
            >
              {link.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1 primary action (+ quick utility buttons) */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenCloakModal}
          title="Tab Cloak & Panic Setting"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
        >
          <EyeOff className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenJsonManager}
          title="JSON Catalog Manager"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
        >
          <FileCode className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-sky-500/20"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Game</span>
        </button>
      </div>
    </header>
  );
};
