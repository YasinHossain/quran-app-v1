// app/features/page/[pageId]/layout.tsx
import Header from '@/app/components/common/Header';
import IconSidebar from '@/app/components/common/IconSidebar';
import SurahListSidebar from '@/app/components/common/SurahListSidebar';
import { AudioProvider } from '@/app/context/AudioContext';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <AudioProvider>
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex flex-grow overflow-hidden">
          <IconSidebar />
          <SurahListSidebar />
          {children}
        </div>
      </div>
    </AudioProvider>
  );
}
