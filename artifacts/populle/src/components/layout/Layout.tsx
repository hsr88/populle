import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { YearSlider } from './YearSlider';

interface LayoutProps {
  children: ReactNode;
  hideYearSlider?: boolean;
}

export function Layout({ children, hideYearSlider = false }: LayoutProps) {
  return (
    <div
      className="min-h-screen w-full bg-background text-foreground overflow-hidden relative"
      style={{
        backgroundImage: `url('${import.meta.env.BASE_URL}images/space-bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-background/80 mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      <Sidebar />

      {/* Desktop: left sidebar (w-64), Mobile: top bar (h-14) */}
      <main className={`lg:pl-64 pt-14 lg:pt-0 h-screen overflow-y-auto relative z-10 ${hideYearSlider ? 'pb-8' : 'pb-44 lg:pb-36'}`}>
        <div className="container mx-auto p-3 sm:p-5 lg:p-8 h-full">
          {children}
        </div>
      </main>

      {!hideYearSlider && <YearSlider />}
    </div>
  );
}
