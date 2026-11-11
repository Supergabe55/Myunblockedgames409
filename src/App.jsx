import React, { useState, useEffect, useMemo } from 'react';
import defaultGamesData from './data/games.json';
import { Header } from './components/Header.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { JsonManagerModal } from './components/JsonManagerModal.jsx';
import { StealthCloakModal } from './components/StealthCloakModal.jsx';
import { FakeDocsPanicOverlay } from './components/FakeDocsPanicOverlay.jsx';
import { 
  Search, 
  Gamepad2, 
  FolderOpen
} from 'lucide-react';

export default function App() {
  const [games, setGames] = useState(() => {
    try {
      const saved = localStorage.getItem('novaplay_games_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load games from localStorage, using default seed:', e);
    }
    return defaultGamesData;
  });

  const [selectedGame, setSelectedGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('novaplay_favorites');
      return saved ? JSON.parse(saved) : ['tetra-blocks', 'retro-snake'];
    } catch {
      return ['tetra-blocks', 'retro-snake'];
    }
  });

  const [recentGames, setRecentGames] = useState(() => {
    try {
      const saved = localStorage.getItem('novaplay_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCloak, setActiveCloak] = useState(() => {
    return localStorage.getItem('novaplay_cloak') || 'none';
  });

  const [isPanicActive, setIsPanicActive] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isCloakModalOpen, setIsCloakModalOpen] = useState(false);

  // Sync games to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('novaplay_games_v1', JSON.stringify(games));
    } catch (e) {
      console.error('Failed to save games to localStorage:', e);
    }
  }, [games]);

  // Sync favorites
  useEffect(() => {
    try {
      localStorage.setItem('novaplay_favorites', JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  // Sync recent games
  useEffect(() => {
    try {
      localStorage.setItem('novaplay_recent', JSON.stringify(recentGames));
    } catch (e) {}
  }, [recentGames]);

  // Apply tab cloak
  useEffect(() => {
    localStorage.setItem('novaplay_cloak', activeCloak);
    const favicon = document.querySelector("link[rel*='icon']") || document.createElement('link');
    favicon.type = 'image/x-icon';
    favicon.rel = 'shortcut icon';

    if (activeCloak === 'google-classroom') {
      document.title = 'Home - Classes';
      favicon.href = 'https://ssl.gstatic.com/classroom/favicon.png';
    } else if (activeCloak === 'google-docs') {
      document.title = 'Untitled document - Google Docs';
      favicon.href = 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico';
    } else if (activeCloak === 'canvas') {
      document.title = 'Dashboard - Instructure Canvas';
      favicon.href = 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico';
    } else if (activeCloak === 'wikipedia') {
      document.title = 'Photosynthesis - Wikipedia';
      favicon.href = 'https://en.wikipedia.org/static/favicon/wikipedia.ico';
    } else {
      document.title = 'NovaPlay Unblocked Games';
      favicon.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎮</text></svg>';
    }
    document.getElementsByTagName('head')[0].appendChild(favicon);
  }, [activeCloak]);

  // Panic hotkey: press `~` or Escape to toggle instant panic cover
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsPanicActive(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    // Add to recents
    setRecentGames(prev => [game.id, ...prev.filter(id => id !== game.id)].slice(0, 8));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = (e, gameId) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(gameId) ? prev.filter(id => id !== gameId) : [...prev, gameId]
    );
  };

  const handleAddGame = (newGame) => {
    setGames(prev => [newGame, ...prev]);
    setSelectedGame(newGame);
  };

  const handleUpdateGames = (newGames) => {
    setGames(newGames);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset all games to the default 8 offline unblocked games? Custom added games will be removed.')) {
      setGames(defaultGamesData);
      localStorage.removeItem('novaplay_games_v1');
      setSelectedGame(null);
    }
  };

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      // Category filter
      if (activeCategory === 'favorites') {
        if (!favorites.includes(game.id)) return false;
      } else if (activeCategory !== 'all') {
        if (game.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = game.title.toLowerCase().includes(q);
        const inDesc = game.description.toLowerCase().includes(q);
        const inCat = game.category.toLowerCase().includes(q);
        const inTags = game.tags?.some(t => t.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inCat && !inTags) return false;
      }

      return true;
    });
  }, [games, activeCategory, searchQuery, favorites]);

  // Spotlight featured game
  const featuredGame = useMemo(() => {
    return games.find(g => g.featured) || games[0];
  }, [games]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Panic Emergency Overlay */}
      {isPanicActive && (
        <FakeDocsPanicOverlay onDismiss={() => setIsPanicActive(false)} />
      )}

      {/* Top Bar Navigation */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (selectedGame) setSelectedGame(null);
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenJsonManager={() => setIsJsonModalOpen(true)}
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        onLogoClick={() => {
          setSelectedGame(null);
          setActiveCategory('all');
          setSearchQuery('');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {selectedGame ? (
          /* Active Game View with Iframe */
          <GamePlayer
            game={selectedGame}
            isFavorite={favorites.includes(selectedGame.id)}
            onBack={() => setSelectedGame(null)}
            onToggleFavorite={handleToggleFavorite}
            onOpenCloak={() => setIsCloakModalOpen(true)}
          />
        ) : (
          /* Catalog View */
          <div className="space-y-8">
            {/* Hero / Featured Spotlight Banner */}
            {activeCategory === 'all' && !searchQuery && featuredGame && (
              <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 p-6 md:p-8 overflow-hidden shadow-2xl">
                <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 max-w-2xl">
                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold mb-3 tracking-wide">
                    <span>FEATURED UNBLOCKED TITLE</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-400">{featuredGame.category}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="font-mono text-amber-400">★ {featuredGame.rating || 4.9}</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
                    {featuredGame.title}
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-xl">
                    {featuredGame.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleSelectGame(featuredGame)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-sky-500/20 transition-all hover:scale-105"
                    >
                      <Gamepad2 className="w-4 h-4" />
                      <span>PLAY NOW IN IFRAME</span>
                    </button>
                    
                    <button
                      onClick={() => setIsJsonModalOpen(true)}
                      className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs rounded-xl border border-slate-700/60 transition-colors"
                    >
                      View JSON Record
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-xl">
              {/* Category Segmented Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-950/80 rounded-lg border border-slate-800/80 shrink-0">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'Arcade', label: 'Arcade' },
                  { id: 'Puzzle', label: 'Puzzle' },
                  { id: 'Action', label: 'Action' },
                  { id: 'favorites', label: `Favorites (${favorites.length})` }
                ].map((tab) => {
                  const isActive = activeCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategory(tab.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                        isActive
                          ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Instant Search input */}
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search games, tags, or genres..."
                  className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Games Grid section header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <span>
                    {activeCategory === 'favorites' 
                      ? 'Favorite Games' 
                      : (activeCategory === 'all' ? 'All Unblocked Games' : `${activeCategory} Games`)}
                  </span>
                  <span className="text-xs font-mono font-normal text-slate-400">
                    ({filteredGames.length})
                  </span>
                </h2>
                <div className="text-xs text-slate-400 mt-0.5">
                  Stored as standalone secure iframes in JSON
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="hidden sm:inline">Hotkey: <code className="text-sky-400 font-mono bg-slate-900 px-1 py-0.5 rounded border border-slate-800">~</code> for emergency docs</span>
              </div>
            </div>

            {/* Grid of Game Cards */}
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredGames.map(game => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorite={favorites.includes(game.id)}
                    onSelect={handleSelectGame}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="text-center py-16 px-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
                <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-200 mb-1">
                  No games found
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5 leading-relaxed">
                  {searchQuery 
                    ? `No matches found for "${searchQuery}". Try different keywords or clear your search.`
                    : 'There are no games in this category yet.'}
                </p>
                <div className="flex items-center justify-center gap-3">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors"
                  >
                    + Add Custom Game
                  </button>
                </div>
              </div>
            )}

            {/* Stored Iframe Architecture Info Strip */}
            <div className="mt-12 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                  <FolderOpen className="w-4 h-4" />
                  <span>JSON-Driven Iframe Engine</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Zero Network Dependencies · Sandboxed Offline Iframes
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Each title is encoded with its corresponding <code className="text-sky-300 font-mono">&lt;iframe&gt;</code> HTML element and configuration in <code className="text-slate-300 font-mono">games.json</code>. You can export, edit, or add external game iframes at any time.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsJsonModalOpen(true)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-medium transition-colors"
                >
                  Inspect games.json
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-xs font-semibold transition-colors shadow-sm"
                >
                  Add Custom Iframe
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 px-4 sm:px-8 py-5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">NovaPlay Unblocked</span>
            <span>·</span>
            <span>Iframe JSON Database</span>
            <span>·</span>
            <span className="font-mono text-emerald-400">Offline Ready</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button 
              onClick={() => setIsCloakModalOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              Tab Disguise
            </button>
            <span>·</span>
            <button 
              onClick={() => setIsJsonModalOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              JSON Raw
            </button>
            <span>·</span>
            <button 
              onClick={handleResetToDefault}
              className="hover:text-rose-400 transition-colors"
            >
              Reset Seed
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      <JsonManagerModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
        onUpdateGames={handleUpdateGames}
        onResetToDefault={handleResetToDefault}
      />

      <StealthCloakModal
        isOpen={isCloakModalOpen}
        onClose={() => setIsCloakModalOpen(false)}
        activeCloak={activeCloak}
        onSelectCloak={(preset) => setActiveCloak(preset)}
        onTriggerPanic={() => setIsPanicActive(true)}
      />
    </div>
  );
}
