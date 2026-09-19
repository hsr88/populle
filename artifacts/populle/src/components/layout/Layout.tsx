import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { YearSlider } from './YearSlider';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  hideYearSlider?: boolean;
  /** Edge-to-edge content (no container padding) — for landing / story */
  fullBleed?: boolean;
}

export function Layout({ children, hideYearSlider = false, fullBleed = false }: LayoutProps) {
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

      <main
        className={cn(
          'lg:pl-64 pt-14 lg:pt-0 h-screen overflow-y-auto relative z-10',
          hideYearSlider ? 'pb-0' : 'pb-44 lg:pb-36',
        )}
      >
        <div
          className={cn(
            'h-full',
            fullBleed ? 'w-full' : 'container mx-auto p-3 sm:p-5 lg:p-8',
          )}
        >
          {children}
        </div>
      </main>

      {!hideYearSlider && <YearSlider />}
    </div>
  );
}
