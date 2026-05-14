'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { speak } from '@/lib/speech';
import Image from 'next/image';

interface Note {
  id: number;
  type: 'left' | 'right';
  targetTime: number; // The timestamp when it should hit the target
  y: number; // Current Y position (0 to 100)
  hit: boolean;
  missed: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
}

const TARGET_Y = 85; 
const NOTE_SPEED = 0.05; // pixels per ms
const HIT_WINDOW = 12; // slightly more forgiving for kids
const BPM = 128;
const BEAT_INTERVAL = 60000 / BPM; // ms per beat (468.75ms)

export default function DanceStage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [feedback, setFeedback] = useState<{text: string, color: string, id: number} | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [spinSide, setSpinSide] = useState<'left'|'right'|null>(null);
  
  const requestRef = useRef<number>(null);
  const startTimeRef = useRef<number>(null);
  const notesRef = useRef<Note[]>([]);
  const nextBeatTimeRef = useRef<number>(0);

  // VUI Welcome
  useEffect(() => {
    const timer = setTimeout(() => {
      speak("Welcome to the Dance Stage! Ready to tap along to the beat?");
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Sync state to ref for game loop
  useEffect(() => {
    notesRef.current = notes;
  }, [notes]);

  const addFeedback = (text: string, color: string) => {
    setFeedback({ text, color, id: Date.now() });
    speak(text.replace('!', ''));
  };

  const spawnConfetti = (type: 'left' | 'right') => {
    const startX = type === 'left' ? 25 : 75; // percentage
    const newParticles = Array.from({length: 6}).map((_, i) => ({
      id: Date.now() + i,
      x: startX + (Math.random() * 10 - 5),
      y: TARGET_Y,
      color: ['bg-pink-500', 'bg-cyan-500', 'bg-yellow-400', 'bg-purple-500'][Math.floor(Math.random() * 4)]
    }));
    setParticles(p => [...p, ...newParticles]);
    
    // Cleanup particles after 1s
    setTimeout(() => {
      setParticles(p => p.filter(part => !newParticles.find(n => n.id === part.id)));
    }, 1000);
  };

  const spawnNote = useCallback((elapsed: number) => {
    const lookahead = TARGET_Y / NOTE_SPEED; 
    const currentTimeToTarget = elapsed + lookahead;

    // Spawn notes on beats
    while (nextBeatTimeRef.current < currentTimeToTarget) {
      if (Math.random() > 0.3) {
        const newNote: Note = {
          id: Date.now() + Math.random(),
          type: Math.random() > 0.5 ? 'left' : 'right',
          targetTime: nextBeatTimeRef.current,
          y: 0,
          hit: false,
          missed: false
        };
        setNotes(prev => [...prev, newNote]);
      }
      nextBeatTimeRef.current += BEAT_INTERVAL;
    }
  }, []);

  const updateGameRef = useRef<(time: number) => void>(null);

  useEffect(() => {
    updateGameRef.current = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;

      spawnNote(elapsed);

      setNotes(prevNotes => {
        let comboLost = false;

        const updatedNotes = prevNotes.map(note => {
          if (note.hit || note.missed) return note;

          const newY = (elapsed - (note.targetTime - (TARGET_Y / NOTE_SPEED))) * NOTE_SPEED;
          
          if (newY > TARGET_Y + HIT_WINDOW) {
            comboLost = true;
            return { ...note, y: newY, missed: true };
          }
          return { ...note, y: newY };
        }).filter(note => note.y < 120);

        if (comboLost) {
          setCombo(0);
          addFeedback("Miss!", "text-red-500");
          speak("Oops!");
        }

        return updatedNotes;
      });

      requestRef.current = requestAnimationFrame((t) => updateGameRef.current?.(t));
    };
  });

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = null;
      nextBeatTimeRef.current = BEAT_INTERVAL * 4; // Start spawning after 4 beats
      requestRef.current = requestAnimationFrame((t) => updateGameRef.current?.(t));
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying]);

  const hitNote = (type: 'left' | 'right') => {
    if (!isPlaying) return;

    let hit = false;
    let timingScore = 0;

    setNotes(prev => prev.map(note => {
      if (!note.hit && !note.missed && note.type === type) {
        const diff = Math.abs(note.y - TARGET_Y);
        if (diff <= HIT_WINDOW) {
          hit = true;
          if (diff <= 4) {
             timingScore = 150;
             addFeedback("Perfect!", "text-purple-400");
          } else if (diff <= 8) {
             timingScore = 100;
             addFeedback("Great!", "text-cyan-400");
          } else {
             timingScore = 50;
             addFeedback("Good!", "text-green-400");
          }
          return { ...note, hit: true };
        }
      }
      return note;
    }));

    if (hit) {
      setCombo(c => c + 1);
      setScore(s => s + timingScore + (combo * 10));
      spawnConfetti(type);
      
      setSpinSide(type);
      setTimeout(() => setSpinSide(null), 300);
    } else {
       setCombo(0);
       addFeedback("Oops!", "text-gray-500");
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setCombo(0);
    setNotes([]);
    setFeedback(null);
    speak("3, 2, 1, Go!");
  };

  return (
    <div className="min-h-full flex flex-col bg-gray-950 w-full relative overflow-hidden select-none pb-28">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-gray-950 to-gray-950 pointer-events-none" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />

      {/* Header */}
      <div className="pt-12 px-6 flex justify-between items-end z-10">
        <div>
           <div className="text-gray-400 text-sm font-black uppercase tracking-widest">Score</div>
           <div className="text-4xl font-display font-black text-white drop-shadow-md">{score}</div>
        </div>
        <div className="text-right">
           <div className="text-gray-400 text-sm font-black uppercase tracking-widest">Combo</div>
           <div className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 drop-shadow-md">
             {combo > 0 ? `${combo}x` : '-'}
           </div>
        </div>
      </div>

      <div className="flex-1 relative w-full mt-4 border-y-4 border-fuchsia-500/30 bg-gray-900/30 overflow-hidden">
        
        {/* Background Image inside play area */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/images/backgrounds/glitter_glow_jungle.png" 
            alt="Jungle" 
            fill 
            className="object-cover opacity-20" 
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>

        {/* Target Zones (The "Tap Zone") */}
        <div className="absolute left-0 w-full h-24 border-y-4 border-fuchsia-400/50 bg-fuchsia-500/10 shadow-[0_0_20px_rgba(217,70,239,0.3)] z-10" style={{ top: `${TARGET_Y}%`, transform: 'translateY(-50%)' }} />

        {/* Lanes */}
        <div className="absolute inset-0 flex z-20">
          <motion.div 
            className="flex-1 border-r-2 border-white/10 relative flex items-end justify-center pb-8" 
            onClick={() => hitNote('left')}
            animate={spinSide === 'left' ? { rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <div className="w-24 h-24 bg-cyan-500/20 rounded-full border-4 border-cyan-400/50 flex items-center justify-center backdrop-blur-sm shadow-[0_0_20px_rgba(6,182,212,0.4)]">
               <span className="text-4xl">👈</span>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-70 text-[10px] font-black text-cyan-200 pointer-events-none uppercase tracking-widest">Tap Here</div>
          </motion.div>
          <motion.div 
            className="flex-1 relative flex items-end justify-center pb-8" 
            onClick={() => hitNote('right')}
            animate={spinSide === 'right' ? { rotate: [0, -15, 15, 0], scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <div className="w-24 h-24 bg-pink-500/20 rounded-full border-4 border-pink-400/50 flex items-center justify-center backdrop-blur-sm shadow-[0_0_20px_rgba(236,72,153,0.4)]">
               <span className="text-4xl">👉</span>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-70 text-[10px] font-black text-pink-200 pointer-events-none uppercase tracking-widest">Tap Here</div>
          </motion.div>
        </div>

        {/* Notes (Beat-Bugs / Fireflies) */}
        {notes.map(note => {
          if (note.hit || note.missed) return null;
          const isLeft = note.type === 'left';
          return (
            <div
              key={note.id}
              className={`absolute w-16 h-16 pointer-events-none flex items-center justify-center drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] z-30
                ${isLeft ? 'left-1/4 -translate-x-1/2' : 'left-3/4 -translate-x-1/2'}
              `}
              style={{ top: `${note.y}%`, transform: 'translate(-50%, -50%)', willChange: 'top' }}
            >
               <span className="text-5xl animate-pulse">🐛</span>
            </div>
          );
        })}

        {/* Confetti Particles */}
        <AnimatePresence>
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ y: `${p.y}%`, x: `${p.x}%`, scale: 1, opacity: 1 }}
              animate={{ y: `${p.y - 20}%`, x: `${p.x + (Math.random()*10 - 5)}%`, scale: 0, opacity: 0, rotate: 180 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`absolute w-3 h-3 ${p.color} rounded-full z-40 pointer-events-none`}
            />
          ))}
        </AnimatePresence>

        {/* Feedback text */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: 1, scale: 1.5, y: -40, rotate: [0, -5, 5, 0] }}
              exit={{ opacity: 0, scale: 2, y: -80 }}
              className={`absolute top-[40%] left-1/2 -translate-x-1/2 font-display text-4xl font-black tracking-widest pointer-events-none drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] z-50 ${feedback.color}`}
            >
              {feedback.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 z-50 bg-gray-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-6">
            <span className="text-8xl drop-shadow-[0_0_30px_rgba(236,72,153,0.8)] animate-bounce inline-block" role="img" aria-label="Music">🎵</span>
          </div>
          <h2 className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 mb-4 drop-shadow-md">Dance Stage</h2>
          <p className="text-gray-300 font-bold mb-10 max-w-xs text-lg">Tap the left or right side when the Beat-Bugs hit the Tap Zone!</p>
          <button 
            onClick={startGame}
            style={{ minWidth: '200px', minHeight: '80px' }}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black text-xl py-4 px-10 rounded-full shadow-[0_0_40px_rgba(236,72,153,0.5)] transition-all transform hover:scale-110 active:scale-95 border-4 border-pink-300"
          >
             <span className="text-3xl">▶️</span> START BEAT
          </button>
        </div>
      )}
    </div>
  );
}
