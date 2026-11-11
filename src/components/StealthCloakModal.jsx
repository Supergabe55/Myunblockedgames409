import React from 'react';
import { X, EyeOff, AlertTriangle, Check } from 'lucide-react';

const presets = [
  {
    id: 'none',
    name: 'Standard Portal',
    title: 'NovaPlay Unblocked Games',
    subtitle: 'Original branding and title',
    icon: '🎮'
  },
  {
    id: 'google-classroom',
    name: 'Google Classroom',
    title: 'Home - Classes',
    subtitle: 'Disguises browser tab as Google Classroom',
    icon: '🏫'
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    subtitle: 'Disguises tab as an active Google Docs essay',
    icon: '📄'
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard - Instructure Canvas',
    subtitle: 'Disguises tab as school Canvas portal',
    icon: '🎓'
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    title: 'Photosynthesis - Wikipedia',
    subtitle: 'Disguises tab as an encyclopedia article',
    icon: '📚'
  }
];

export const StealthCloakModal = ({
  isOpen,
  onClose,
  activeCloak,
  onSelectCloak,
  onTriggerPanic,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Tab Cloaking & Stealth
              </h2>
              <p className="text-[11px] text-slate-400">
                Disguise tab title and icon to blend in on school or library networks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset choices */}
        <div className="p-6 space-y-2.5">
          {presets.map(p => {
            const isSelected = activeCloak === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  onSelectCloak(p.id);
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                  isSelected 
                    ? 'bg-sky-500/10 border-sky-500/50 text-slate-100' 
                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{p.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-200">{p.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-[260px]">
                      Tab: "{p.title}"
                    </div>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border border-slate-700" />
                )}
              </button>
            );
          })}

          {/* Quick Panic Button card */}
          <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Panic Hotkey (Press ` or ~ key)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Instantly hides games and toggles a fake Google Docs essay.
              </p>
            </div>
            <button
              onClick={() => {
                onTriggerPanic();
                onClose();
              }}
              className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-lg transition-colors shrink-0 shadow-sm"
            >
              Panic Now
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-slate-800 bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
