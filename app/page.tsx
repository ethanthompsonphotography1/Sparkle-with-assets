'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { speak } from '@/lib/speech';

export default function SparkleCloset() {
  const [horseColor, setHorseColor] = useState('hue-rotate-0');
  const [accessory, setAccessory] = useState<'none' | 'crown' | 'star'>('none');

  useEffect(() => {
    // Voice prompt when entering the zone
    const timer = setTimeout(() => {
      speak("Welcome to the Sparkle Closet! Let's dress up your Neon-Saur!");
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const colorFilters = [
    { id: 'neon-pink', filter: 'hue-rotate-0', preview: 'bg-pink-500', label: 'Neon Pink' },
    { id: 'cyber-blue', filter: 'hue-rotate-[220deg]', preview: 'bg-cyan-400', label: 'Cyber Blue' },
    { id: 'acid-green', filter: 'hue-rotate-[100deg]', preview: 'bg-lime-400', label: 'Acid Green' },
    { id: 'electric-purple', filter: 'hue-rotate-[280deg]', preview: 'bg-fuchsia-500', label: 'Electric Purple' }
  ];

  return (
    <div className="min-h-full flex flex-col items-center bg-gray-950 p-6 pt-12 overflow-y-auto w-full relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/assets/images/backgrounds/glitter_glow_jungle.png" 
          alt="Glitter Glow Jungle" 
          fill 
          className="object-cover opacity-30" 
          onError={(e) => {
             // Fallback to gradient if image is missing
             e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-950" />
      </div>

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-3 mb-10 z-10"
      >
        <span className="text-4xl" role="img" aria-label="sparkles">✨</span>
        <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 drop-shadow-[0_2px_10px_rgba(236,72,153,0.5)]">
          Sparkle Closet
        </h1>
      </motion.div>

      {/* Horse Preview using real asset path (fallback to standard Image with picsum if needed or just stylized span if image fails) */}
      <motion.div 
        layout
        className="relative w-64 h-64 mb-12 z-10 flex items-center justify-center rounded-3xl border-4 border-fuchsia-400/50 shadow-[0_0_50px_rgba(236,72,153,0.3)] bg-indigo-900/40 backdrop-blur-sm overflow-hidden"
      >
        <motion.div 
          className={`relative w-48 h-48 transition-all duration-500 ${horseColor}`}
          layout
        >
          <Image
             src="/assets/images/characters/luna_rex.png"
             alt="Luna-Rex"
             fill
             className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
             unoptimized
             onError={(e) => {
                 // Fallback placeholder logic
                 const target = e.currentTarget;
                 target.onerror = null; // prevent infinite loop
                 target.src = "https://picsum.photos/seed/lunarex/400/400";
             }}
          />
          
          <AnimatePresence>
            {accessory === 'crown' && (
              <motion.div 
                initial={{ y: -20, opacity: 0, scale: 0.5 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0, scale: 0.5 }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-6xl drop-shadow-[0_0_15px_rgba(250,204,21,1)] z-20"
              >
                👑
              </motion.div>
            )}

            {accessory === 'star' && (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl drop-shadow-[0_0_15px_rgba(250,204,21,1)] z-20"
              >
                ⭐
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </motion.div>

      {/* Controls */}
      <div className="w-full max-w-sm space-y-10 z-10 pb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            <h2 className="text-xl font-bold font-display text-gray-100">Coat Color</h2>
          </div>
          <div className="flex justify-between gap-2">
            {colorFilters.map(c => (
              <button 
                key={c.id}
                onClick={() => setHorseColor(c.filter)}
                className={`w-[72px] h-[72px] rounded-full ${c.preview} transition-transform ${horseColor === c.filter ? 'scale-110 ring-4 ring-white shadow-[0_0_20px_inherit]' : 'hover:scale-105 opacity-80'}`}
                aria-label={c.label}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold font-display text-gray-100 flex items-center gap-2">
             <span className="text-2xl">💎</span> Accessories
          </h2>
          <div className="flex justify-between gap-4">
            <button 
              onClick={() => setAccessory('none')}
              className={`flex-1 h-[80px] rounded-3xl text-xl font-bold transition-transform ${
                accessory === 'none' ? 'bg-gray-200 text-gray-900 scale-105 shadow-xl' : 'bg-gray-800 text-gray-400 hover:scale-105'
              }`}
            >
              None
            </button>
            <button 
              onClick={() => setAccessory('crown')}
              className={`flex-1 h-[80px] rounded-3xl text-3xl font-medium transition-transform flex items-center justify-center gap-2 ${
                accessory === 'crown' ? 'bg-yellow-500 border-4 border-yellow-300 scale-105 shadow-[0_0_20px_rgba(234,179,8,0.5)]' : 'bg-gray-800 hover:scale-105'
              }`}
            >
              👑
            </button>
            <button 
              onClick={() => setAccessory('star')}
              className={`flex-1 h-[80px] rounded-3xl text-3xl font-medium transition-transform flex items-center justify-center gap-2 ${
                accessory === 'star' ? 'bg-cyan-500 border-4 border-cyan-300 scale-105 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'bg-gray-800 hover:scale-105'
              }`}
            >
              ⭐
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
