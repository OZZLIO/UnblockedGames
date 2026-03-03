/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Gamepad2, 
  Search, 
  Maximize2, 
  ArrowLeft, 
  Shield, 
  ExternalLink,
  Info,
  LayoutGrid,
  Zap
} from "lucide-react";

interface Game {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
}

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [proxyUrl, setProxyUrl] = useState("");
  const [isProxyMode, setIsProxyMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/games")
      .then(res => res.json())
      .then(data => {
        setGames(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch games:", err);
        setLoading(false);
      });
  }, []);

  const filteredGames = games.filter(game => 
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProxySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (proxyUrl) {
      setIsProxyMode(true);
      setSelectedGame({
        id: "proxy",
        name: "Proxy Browser",
        description: `Browsing: ${proxyUrl}`,
        thumbnail: "",
        category: "Utility"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#000000] font-sans selection:bg-[#00FF00] selection:text-[#000000]">
      {/* Header */}
      <header className="border-b-2 border-[#000000] sticky top-0 bg-[#FFFFFF] z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              setSelectedGame(null);
              setIsProxyMode(false);
            }}
          >
            <div className="w-12 h-12 bg-[#000000] flex items-center justify-center group-hover:bg-[#00FF00] transition-colors duration-200">
              <Zap className="text-[#00FF00] group-hover:text-[#000000] w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Nexus Games</h1>
          </div>

          <div className="hidden md:flex items-center gap-8 uppercase text-xs font-bold tracking-widest">
            <button className="hover:text-[#00FF00] transition-colors">Popular</button>
            <button className="hover:text-[#00FF00] transition-colors">New</button>
            <button className="hover:text-[#00FF00] transition-colors">Categories</button>
            <div className="h-8 w-[2px] bg-[#000000]"></div>
            <div className="flex items-center gap-2 text-[#00FF00] bg-[#000000] px-3 py-1">
              <Shield size={14} />
              <span>SECURE</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Hero / Search */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="inline-block border-2 border-[#000000] px-4 py-1 bg-[#00FF00] font-bold text-xs uppercase tracking-widest">
                    Unblocked & Fast
                  </div>
                  <h2 className="text-7xl font-black uppercase leading-[0.85] tracking-tighter">
                    Play Without <br />
                    <span className="text-[#00FF00] stroke-black stroke-2" style={{ WebkitTextStroke: '2px black' }}>Limits.</span>
                  </h2>
                  <p className="text-xl font-medium max-w-md">
                    Access your favorite games and browse the web securely through our high-speed proxy network.
                  </p>
                </div>

                <div className="space-y-4 border-4 border-[#000000] p-8 bg-[#F5F5F5]">
                  <h3 className="text-xl font-black uppercase flex items-center gap-2">
                    <Search size={24} /> Search Games
                  </h3>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Type game name..."
                      className="w-full bg-white border-2 border-[#000000] p-4 font-bold focus:outline-none focus:bg-[#00FF00] transition-colors"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="pt-4 border-t-2 border-[#000000]">
                    <h3 className="text-xl font-black uppercase flex items-center gap-2 mb-4">
                      <ExternalLink size={24} /> Web Proxy
                    </h3>
                    <form onSubmit={handleProxySubmit} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="https://google.com"
                        className="flex-1 bg-white border-2 border-[#000000] p-4 font-bold focus:outline-none focus:bg-[#00FF00] transition-colors"
                        value={proxyUrl}
                        onChange={(e) => setProxyUrl(e.target.value)}
                      />
                      <button 
                        type="submit"
                        className="bg-[#000000] text-[#00FF00] px-8 font-black uppercase hover:bg-[#00FF00] hover:text-[#000000] transition-colors"
                      >
                        Go
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Games Grid */}
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b-4 border-[#000000] pb-4">
                  <h3 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
                    <LayoutGrid size={32} /> Featured Games
                  </h3>
                  <div className="flex gap-2">
                    {["All", "Multiplayer", "Puzzle", "Sandbox"].map(cat => (
                      <button 
                        key={cat}
                        className="px-4 py-1 border-2 border-[#000000] font-bold text-xs uppercase hover:bg-[#00FF00] transition-colors"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-64 bg-[#F5F5F5] border-4 border-[#000000] animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredGames.map((game, idx) => (
                      <motion.div 
                        key={game.id}
                        whileHover={{ y: -10 }}
                        className="group cursor-pointer"
                        onClick={() => setSelectedGame(game)}
                      >
                        <div className="relative border-4 border-[#000000] overflow-hidden bg-[#000000]">
                          <img 
                            src={game.thumbnail} 
                            alt={game.name}
                            className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-4 left-4 bg-[#00FF00] text-[#000000] px-3 py-1 font-black text-xs uppercase border-2 border-[#000000]">
                            0{idx + 1}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#FFFFFF] border-t-4 border-[#000000] transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-xl font-black uppercase tracking-tight">{game.name}</h4>
                              <span className="text-[10px] font-bold bg-[#000000] text-[#FFFFFF] px-2 py-0.5 uppercase">{game.category}</span>
                            </div>
                            <p className="text-sm font-medium line-clamp-1 opacity-70">{game.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[100] bg-[#FFFFFF] flex flex-col"
            >
              {/* Player Header */}
              <div className="h-16 border-b-4 border-[#000000] flex items-center justify-between px-6 bg-[#FFFFFF]">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      setSelectedGame(null);
                      setIsProxyMode(false);
                    }}
                    className="p-2 border-2 border-[#000000] hover:bg-[#00FF00] transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h3 className="font-black uppercase tracking-tight text-xl">{selectedGame.name}</h3>
                    <p className="text-[10px] font-bold uppercase opacity-50">{selectedGame.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 px-4 py-1 border-2 border-[#000000] bg-[#F5F5F5] font-bold text-xs uppercase">
                    <Info size={14} />
                    <span>High Performance Mode Active</span>
                  </div>
                  <button className="p-2 border-2 border-[#000000] hover:bg-[#00FF00] transition-colors">
                    <Maximize2 size={20} />
                  </button>
                </div>
              </div>

              {/* Iframe Container */}
              <div className="flex-1 bg-[#000000] relative">
                <iframe 
                  src={isProxyMode ? `/proxy/${proxyUrl}` : `/api/games/${selectedGame.id}/iframe`}
                  className="w-full h-full border-none"
                  title={selectedGame.name}
                  allow="fullscreen; autoplay; gamepad"
                />
              </div>

              {/* Player Footer */}
              <div className="h-12 border-t-4 border-[#000000] flex items-center justify-center px-6 bg-[#00FF00]">
                <p className="text-xs font-black uppercase tracking-[0.2em]">
                  Nexus Engine v4.0 // Connection: Stable // Latency: 12ms
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-[#000000] py-12 mt-24 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="text-[#00FF00] fill-black" size={24} />
              <h4 className="text-2xl font-black uppercase">Nexus</h4>
            </div>
            <p className="text-sm font-medium">
              The ultimate destination for unblocked gaming and secure web browsing. Built for speed, privacy, and performance.
            </p>
          </div>
          
          <div className="space-y-4">
            <h5 className="font-black uppercase text-xs tracking-widest">Navigation</h5>
            <ul className="space-y-2 text-sm font-bold uppercase">
              <li className="hover:text-[#00FF00] cursor-pointer">Home</li>
              <li className="hover:text-[#00FF00] cursor-pointer">Games Library</li>
              <li className="hover:text-[#00FF00] cursor-pointer">Proxy Settings</li>
              <li className="hover:text-[#00FF00] cursor-pointer">Support</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-black uppercase text-xs tracking-widest">Status</h5>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase">
                <span>Network</span>
                <span className="text-[#00FF00]">Operational</span>
              </div>
              <div className="w-full h-2 bg-[#000000]">
                <div className="w-[98%] h-full bg-[#00FF00]"></div>
              </div>
              <p className="text-[10px] font-medium opacity-50 uppercase">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
