import { Link, useLocation } from 'wouter';
import { Globe2, Map, Building2, LineChart, PieChart, Brain, Info, HelpCircle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/', label: '3D Globe', icon: Globe2 },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/cities', label: 'Cities', icon: Building2 },
  { href: '/compare', label: 'Compare', icon: LineChart },
  { href: '/stats', label: 'Dashboard', icon: PieChart },
  { href: '/quiz', label: 'Quiz', icon: Brain },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-64 h-screen fixed left-0 top-0 glass-panel border-r border-y-0 border-l-0 z-40 flex-col py-6">
        <div className="flex items-center lg:px-6 mb-12">
          <img
            src={`${import.meta.env.BASE_URL}images/logo.png`}
            alt="Populle Logo"
            className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
            style={{ mixBlendMode: 'screen' }}
          />
          <span className="ml-3 font-bold text-xl text-white tracking-wide">POPULLE</span>
        </div>

        <nav className="flex-1 flex flex-col gap-2 px-3 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            return (
              <div key={item.href}>
                <Link href={item.href} className="outline-none">
                  <div
                    className={cn(
                      "relative flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer transition-all duration-300 group",
                      isActive ? "text-white" : "text-muted-foreground hover:text-white hover:bg-white/5"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-desktop"
                        className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-xl"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className={cn("w-6 h-6 relative z-10 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                    <span className="relative z-10 font-medium">{item.label}</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Information */}
        <div className="px-3 mb-4">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-medium mb-2 px-3">
            Information
          </div>
          <nav className="flex flex-col gap-1">
            <Link href="/about" className="outline-none">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors text-sm">
                <Info className="w-4 h-4" />
                <span>About</span>
              </div>
            </Link>
            <Link href="/faq" className="outline-none">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors text-sm">
                <HelpCircle className="w-4 h-4" />
                <span>FAQ</span>
              </div>
            </Link>
            <Link href="/privacy" className="outline-none">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors text-sm">
                <Shield className="w-4 h-4" />
                <span>Privacy</span>
              </div>
            </Link>
          </nav>
        </div>

        {/* Footer info */}
        <div className="mt-auto px-4 space-y-3">
          <div className="border-t border-white/8 pt-3">
            <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
              <span className="text-white/60 font-semibold block mb-1">About Populle</span>
              An interactive visualization of world population from 10,000 BCE to 2100 CE — explore historical trends, compare countries, and see where humanity is headed.
            </p>
          </div>
          <div className="border-t border-white/8 pt-3">
            <a 
              href="https://ko-fi.com/hsr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] text-primary hover:text-primary/80 transition-colors"
            >
              <span>☕</span> Support the author
            </a>
          </div>
          <div className="border-t border-white/8 pt-2">
            <p className="text-[10px] text-muted-foreground/40">© Populle.com by <a href="https://github.com/hsr88" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">hsr</a></p>
          </div>
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass-panel border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={`${import.meta.env.BASE_URL}images/logo.png`}
            alt="Populle Logo"
            className="w-7 h-7 object-contain drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]"
            style={{ mixBlendMode: 'screen' }}
          />
          <span className="font-bold text-base text-white tracking-wide">POPULLE</span>
        </div>
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className="outline-none">
                <div className={cn(
                  "relative p-2 rounded-lg transition-colors",
                  isActive ? "text-primary bg-primary/15" : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-mobile"
                      className="absolute inset-0 bg-primary/15 rounded-lg"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon className="w-5 h-5 relative z-10" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
