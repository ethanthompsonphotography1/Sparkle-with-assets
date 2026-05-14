import type {Metadata} from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css'; // Global styles
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'Starlight Stable: Neon-Saur Adventures',
  description: 'A neon-themed horse nurturing and rhythm game app.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body className={`bg-gray-950 text-gray-50 min-h-[100dvh] flex flex-col font-sans ${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
        <main className="flex-1 overflow-y-auto pb-20 w-full max-w-md mx-auto shadow-2xl shadow-purple-900/20 bg-gray-900/50">
          {children}
        </main>
        <Navigation />
      </body>
    </html>
  );
}
