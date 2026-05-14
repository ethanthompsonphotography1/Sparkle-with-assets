'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { speak } from '@/lib/speech';

export default function StarlightStable() {
  const [stats, setStats] = useState({
    energy: 80,
    happiness: 90,
    cleanliness: 60,
    hunger: 40 // 100 means full
  });

  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [activeFact, setActiveFact] = useState<string | null>(null);

  useEffect(() => {
    // Voice prompt when entering the zone
    const timer = setTimeout(() => {
      speak("Welcome to the Starlight Stable! Time to take care of your Neon-Saur.");
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Passive decay
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        energy: Math.max(0, prev.energy - 1),
        happiness: Math.max(0, prev.happiness - (prev.hunger < 30 ? 2 : 1)), // loses happiness faster if hungry
        cleanliness: Math.max(0, prev.cleanliness - 0.5),
        hunger: Math.max(0, prev.hunger - 1),
      }));
    }, 5000); // Every 5 seconds for demo purposes
    return () => clearInterval(interval);
  }, []);

  const handleAction = (action: string) => {
    if (activeAction) return;

    setActiveAction(action);
    if(action === 'feed') speak("Yummy snack!");
    if(action === 'wash') speak("Scrub scrub!");
    if(action === 'pet') speak("Good dinosaur!");
    if(action === 'sleep') speak("Night night.");

    setTimeout(() => {
      setStats(prev => {
        const newStats = { ...prev };
        switch(action) {
          case 'feed':
            newStats.hunger = Math.min(100, prev.hunger + 40);
            newStats.happiness = Math.min(100, prev.happiness + 5);
            newStats.energy = Math.min(100, prev.energy + 10);
            break;
          case 'wash':
            newStats.cleanliness = 100;
            newStats.happiness = Math.min(100, prev.happiness + 10);
            break;
          case 'pet':
            newStats.happiness = Math.min(100, prev.happiness + 20);
            break;
          case 'sleep':
            newStats.energy = 100;
            newStats.hunger = Math.max(0, prev.hunger - 20);
            break;
        }
        return newStats;
      });
      setActiveAction(null);
    }, 2000);
  };

  const getStatusColor = (val: number) => {
    if (val > 60) return 'bg-cyan-400';
    if (val > 30) return 'bg-yellow-400';
    return 'bg-pink-500'; // Critical (Neon Pink)
  };

  return (
    <div className="min-h-full flex flex-col items-center bg-gray-950 p-6 pt-12 w-full relative overflow-y-auto overflow-x-hidden pb-32">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image 
          src="/assets/images/backgrounds/glitter_glow_jungle.png" 
          alt="Glitter Glow Jungle" 
          fill 
          className="object-cover opacity-40 mix-blend-screen" 
          onError={(e) => {
             e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/80" />
      </div>

      {/* Background Ambience */}
      <div className={`absolute inset-0 pointer-events-none transition-colors duration-2000 ${activeAction === 'sleep' ? 'bg-indigo-950/90 backdrop-blur-md z-20' : 'bg-transparent'}`} />

      {activeAction === 'sleep' && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
           <span className="text-9xl animate-pulse drop-shadow-[0_0_40px_rgba(191,219,254,0.8)]" role="img" aria-label="moon">🌙</span>
        </div>
      )}

      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full flex justify-between items-end mb-10 z-10"
      >
        <div>
           <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-md">
             Starlight Stable
           </h1>
           <p className="text-gray-300 font-bold text-sm mt-1 drop-shadow-sm">Nurture your Neon-Saur</p>
        </div>
      </motion.div>

      {/* Facts Buttons */}
      <div className="absolute top-12 right-6 z-20 flex flex-col gap-2">
        <button 
          onClick={() => {
            const fact = 'Ancient stories from China (Qilin) describe multi-colored scales and dragon-like heads.';
            setActiveFact(fact);
            speak(fact);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 border-2 border-indigo-400 text-white p-3 rounded-full shadow-lg backdrop-blur-sm"
          style={{ minWidth: '60px', minHeight: '60px' }}
        >
          <span className="text-xl leading-none">🐉</span>
        </button>
        <button 
          onClick={() => {
            const fact = 'Unicorns were likely inspired by real animals like the Elasmotherium (a giant shaggy rhino with one massive horn).';
            setActiveFact(fact);
            speak(fact);
          }}
          className="bg-teal-600 hover:bg-teal-500 border-2 border-teal-400 text-white p-3 rounded-full shadow-lg backdrop-blur-sm"
          style={{ minWidth: '60px', minHeight: '60px' }}
        >
          <span className="text-xl leading-none">🦏</span>
        </button>
      </div>

      <AnimatePresence>
        {activeFact && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-24 left-6 right-6 z-40 bg-gray-900 border-4 border-fuchsia-500 shadow-2xl rounded-3xl p-6 flex gap-4 items-start"
          >
            <div className="flex-1 text-lg text-white font-bold leading-tight">
              {activeFact}
            </div>
            <button 
              onClick={() => setActiveFact(null)} 
              className="p-3 rounded-full bg-red-500 hover:bg-red-400 border-2 border-red-300 text-white font-black"
              style={{ minWidth: '50px', minHeight: '50px' }}
            >
               X
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Board */}
      <div className="w-full grid grid-cols-2 gap-4 mb-4 z-10">
        <StatBar emoji="💖" label="Happiness" value={stats.happiness} color={getStatusColor(stats.happiness)} />
        <StatBar emoji="🍗" label="Fullness" value={stats.hunger} color={getStatusColor(stats.hunger)} />
        <StatBar emoji="⚡" label="Energy" value={stats.energy} color={getStatusColor(stats.energy)} />
        <StatBar emoji="✨" label="Cleanliness" value={stats.cleanliness} color={getStatusColor(stats.cleanliness)} />
      </div>

      {/* Subject Scene */}
      <div className="flex-1 w-full relative flex items-center justify-center mb-6 z-10 min-h-[300px]">
        <div className="absolute inset-x-0 bottom-10 h-32 bg-fuchsia-900/30 blur-2xl rounded-[100px]" />
        
        {/* The Horse via Image Tag */}
        <motion.div 
          animate={
            activeAction === 'feed' ? { y: [0, -20, 0], scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.5 } } :
            activeAction === 'pet' ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 0.8 } } :
            activeAction === 'sleep' ? { y: [0, 10, 0], transition: { repeat: Infinity, duration: 2 } } :
            { y: [0, -10, 0], transition: { repeat: Infinity, duration: 3 } } // idle
          }
          className="relative w-64 h-64"
        >
          <Image
             src="/assets/images/characters/luna_rex.png"
             alt="Luna-Rex"
             fill
             className="object-contain drop-shadow-[0_0_40px_rgba(217,70,239,0.5)]"
             unoptimized
             onError={(e) => {
                 const target = e.currentTarget;
                 target.onerror = null;
                 target.src = "https://picsum.photos/seed/lunarex/400/400";
             }}
          />

          {/* Action effects */}
          <AnimatePresence>
            {activeAction === 'wash' && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-[-20%] flex flex-wrap items-center justify-center gap-4 pointer-events-none"
              >
                {[...Array(8)].map((_, i) => (
                  <span key={i} className="text-3xl animate-bounce" style={{ animationDuration: `${1 + Math.random()}s`, animationDelay: `${Math.random()}s` }}>🫧</span>
                ))}
              </motion.div>
            )}
            {activeAction === 'pet' && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0 }} 
                animate={{ opacity: 1, y: -40, scale: 1.5 }} 
                exit={{ opacity: 0, scale: 2 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none"
              >
                 <span className="text-6xl drop-shadow-[0_0_10px_rgba(236,72,153,1)]">💖</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dirt overlay - visual representation using CSS filters if actual image, or just a brown overlay */}
          {stats.cleanliness < 100 && (
            <div className="absolute inset-10 bg-[url('https://www.transparenttextures.com/patterns/mud-texture.png')] mix-blend-multiply opacity-50 rounded-[40px] pointer-events-none transition-opacity duration-1000" style={{ opacity: Math.max(0, 1 - (stats.cleanliness / 100)) }} />
          )}
        </motion.div>
      </div>

      {/* Actions (Large Touch Targets) */}
      <div className="w-full flex justify-between gap-3 z-10">
        <ActionButton emoji="🍕" label="Feed" onClick={() => handleAction('feed')} disabled={!!activeAction} active={activeAction === 'feed'} />
        <ActionButton emoji="🧼" label="Wash" onClick={() => handleAction('wash')} disabled={!!activeAction} active={activeAction === 'wash'} />
        <ActionButton emoji="🎀" label="Pet" onClick={() => handleAction('pet')} disabled={!!activeAction} active={activeAction === 'pet'} />
        <ActionButton emoji="💤" label="Sleep" onClick={() => handleAction('sleep')} disabled={!!activeAction} active={activeAction === 'sleep'} />
      </div>
    </div>
  );
}

function StatBar({ emoji, label, value, color }: { emoji: string, label: string, value: number, color: string }) {
  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-[24px] p-4 shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
           <span className="text-lg leading-none">{emoji}</span>
           <span className="text-xs font-black tracking-widest uppercase text-gray-200">{label}</span>
        </div>
        <span className="text-sm font-black text-gray-100">{Math.round(value)}%</span>
      </div>
      <div className="h-3 w-full bg-gray-950 rounded-full overflow-hidden shadow-inner border border-gray-800">
        <motion.div 
          className={`h-full rounded-full ${color} shadow-[0_0_15px_inherit]`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", bounce: 0, duration: 1 }}
        />
      </div>
    </div>
  );
}

function ActionButton({ emoji, label, onClick, disabled, active }: { emoji: string, label: string, onClick: () => void, disabled: boolean, active: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ minWidth: '80px', minHeight: '80px' }}
      className={`relative flex-1 flex flex-col items-center justify-center p-2 rounded-3xl transition-all shadow-xl
        ${active ? 'bg-fuchsia-600 scale-95 border-4 border-fuchsia-300' : 'bg-gray-800 border-b-4 border-gray-900 hover:bg-gray-700 hover:-translate-y-1'}
        ${disabled && !active ? 'opacity-50 cursor-not-allowed border-none translate-y-1' : ''}
      `}
    >
      <span className={`text-4xl mb-1 drop-shadow-md ${active ? 'animate-bounce' : ''}`} role="img" aria-label={label}>{emoji}</span>
      <span className="text-[11px] font-black tracking-widest text-white uppercase drop-shadow-sm">{label}</span>
    </button>
  );
}
