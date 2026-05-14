'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', emoji: '🎀', label: 'Closet' },
    { href: '/dance', emoji: '🎵', label: 'Dance' },
    { href: '/stable', emoji: '🧸', label: 'Stable' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-indigo-950/90 backdrop-blur-md rounded-t-[40px] border-t-4 border-fuchsia-500/50 pb-safe shadow-[0_-10px_40px_rgba(192,38,211,0.3)]">
      <div className="flex justify-around items-center h-28 w-full max-w-md mx-auto px-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`relative flex flex-col items-center justify-center p-2 rounded-3xl transition-transform ${
                isActive ? 'scale-110' : 'hover:scale-105 opacity-70'
              }`}
              style={{ minWidth: '106px', minHeight: '106px' /* 80pt target */ }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-fuchsia-500/20 rounded-3xl border-2 border-fuchsia-400"
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              )}
              <span className="text-5xl mb-1 relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" role="img" aria-label={link.label}>
                {link.emoji}
              </span>
              <span className={`text-sm font-black tracking-widest uppercase relative z-10 ${isActive ? 'text-fuchsia-300' : 'text-indigo-300'}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
