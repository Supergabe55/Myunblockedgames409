import React from 'react';
import { 
  Play, 
  Heart, 
  Gamepad2, 
  Boxes, 
  Activity, 
  Layers, 
  Grid3X3, 
  Flame, 
  ShieldAlert, 
  Rocket, 
  Star 
} from 'lucide-react';

const iconMap = {
  Gamepad2: <Gamepad2 className="w-8 h-8" />,
  Boxes: <Boxes className="w-8 h-8" />,
  Activity: <Activity className="w-8 h-8" />,
  Layers: <Layers className="w-8 h-8" />,
  Grid3X3: <Grid3X3 className="w-8 h-8" />,
  Flame: <Flame className="w-8 h-8" />,
  ShieldAlert: <ShieldAlert className="w-8 h-8" />,
  Rocket: <Rocket className="w-8 h-8" />,
};

export const GameCard = ({
  game,
  isFavorite,
  onSelect,
  onToggleFavorite,
}) => {
  const icon = (game.icon && iconMap[game.icon]) || <Gamepad2 className="w-8 h-8" />;
  const formattedPlays = game.plays 
    ? (game.plays > 1000 ? `${(game.plays / 1000).toFixed(1)}k` : game.plays)
    : 'New';

  return (
    <div 
      onClick={() => onSelect(game)}
      className="group relative flex flex-col justify-between bg-slate-900/90 dark:bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 rounded-xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/5 cursor-pointer"
    >
      <div>
        {/* Top visual banner / icon thumbnail */}
        <div 
          className="relative w-full h-36 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-slate-800/80 group-hover:border-slate-700/80 transition-colors"
          style={{
            background: `radial-gradient(circle at center, ${game.accentColor || '#0ea5e9'}22 0%, #090d16 100%)`
          }}
        >
          {/* Accent radial glow */}
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg"
            style={{ 
              backgroundColor: `${game.accentColor || '#0ea5e9'}20`,
              color: game.accentColor || '#38bdf8' 
            }}
          >
            {icon}
          </div>

          {/* Quick Play hover overlay */}
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <span className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-slate-950 font-semibold text-xs rounded-lg shadow-lg">
              <Play className="w-3.5 h-3.5 fill-current" />
              PLAY NOW
            </span>
          </div>

          {/* Favorite toggle top right */}
          <button
            onClick={(e) => onToggleFavorite(e, game.id)}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="absolute top-2.5 right-2.5 p-2 rounded-md bg-slate-950/60 hover:bg-slate-950 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} 
            />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-100 group-hover:text-sky-400 transition-colors tracking-tight line-clamp-1">
          {game.title}
        </h3>

        {/* Unboxed Metadata Discipline */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 mb-2 font-medium">
          <span className="text-sky-400/90">{game.category}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="tabular-nums font-mono">{game.rating || 4.8}</span>
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="tabular-nums font-mono">{formattedPlays} plays</span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {game.description}
        </p>
      </div>

      {/* Card Footer / controls preview */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span className="truncate max-w-[200px]" title={game.controls || 'Keyboard / Mouse'}>
          {game.controls ? game.controls.split('·')[0] : 'Mouse & Keyboard'}
        </span>
        <span className="text-sky-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          Launch →
        </span>
      </div>
    </div>
  );
};
