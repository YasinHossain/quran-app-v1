// app/features/surah/[SurahId]/layout.tsx
'use client';
import Header from '@/app/components/common/Header';
import IconSidebar from '@/app/components/common/IconSidebar';
import SurahListSidebar from '@/app/components/common/SurahListSidebar';
import { AudioProvider } from '@/app/context/AudioContext';

export default function SurahLayout({ children }: { children: React.ReactNode }) {
  return (
    <AudioProvider>
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex flex-grow overflow-hidden">
          <nav aria-label="Primary navigation">
            <IconSidebar />
          </nav>
          <nav aria-label="Surah navigation">
            <SurahListSidebar />
          </nav>
          {children}
        </div>
      </div>
    </AudioProvider>
  );
}
