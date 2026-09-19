import { cn } from "@/lib/utils";

export interface ShareCardProps {
  title: string;
  subtitle?: string;
  bigStat: string;
  bigStatLabel: string;
  bullets?: string[];
  footer?: string;
  accent?: "cyan" | "amber";
  className?: string;
}

const accentStyles = {
  cyan: {
    glow: "text-primary text-glow",
    dot: "bg-primary",
    border: "border-primary/30",
    wash: "from-primary/20 via-transparent to-accent/10",
    grid: "rgba(6, 182, 212, 0.07)",
  },
  amber: {
    glow: "text-accent",
    dot: "bg-accent",
    border: "border-accent/30",
    wash: "from-accent/20 via-transparent to-primary/10",
    grid: "rgba(245, 158, 11, 0.08)",
  },
} as const;

export function ShareCard({
  title,
  subtitle,
  bigStat,
  bigStatLabel,
  bullets,
  footer = "populle.com",
  accent = "cyan",
  className,
}: ShareCardProps) {
  const theme = accentStyles[accent];
  const items = bullets?.slice(0, 3) ?? [];

  return (
    <article
      className={cn(
        "relative flex w-full max-w-sm flex-col overflow-hidden rounded-2xl",
        "aspect-[9/16] min-h-[420px]",
        "glass-panel border",
        theme.border,
        className,
      )}
      style={{
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -10%, hsl(189 94% 43% / 0.18), transparent 55%),
          radial-gradient(ellipse 60% 40% at 100% 100%, hsl(38 92% 50% / 0.12), transparent 50%),
          linear-gradient(160deg, hsl(222 47% 7%) 0%, hsl(224 71% 4%) 50%, hsl(222 47% 6%) 100%),
          linear-gradient(${theme.grid} 1px, transparent 1px),
          linear-gradient(90deg, ${theme.grid} 1px, transparent 1px)
        `,
        backgroundSize: "auto, auto, auto, 28px 28px, 28px 28px",
      }}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80",
          theme.wash,
        )}
      />

      <div className="relative z-10 flex h-full flex-col p-6 sm:p-7">
        {/* Brand */}
        <header className="mb-6 flex items-center gap-2.5">
          <img
            src={`${import.meta.env.BASE_URL}images/logo.png`}
            alt=""
            className="h-7 w-7 object-contain"
            aria-hidden
          />
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Populle
          </span>
        </header>

        {/* Title block */}
        <div className="mb-8 space-y-1.5">
          <h2 className="font-display text-xl font-bold leading-snug text-white sm:text-2xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        {/* Big stat */}
        <div className="mb-8 flex flex-1 flex-col items-center justify-center text-center">
          <p
            className={cn(
              "font-display text-5xl font-bold leading-none tracking-tight sm:text-6xl",
              theme.glow,
              accent === "amber" && "drop-shadow-[0_0_12px_hsl(38_92%_50%_/_0.45)]",
            )}
          >
            {bigStat}
          </p>
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {bigStatLabel}
          </p>
        </div>

        {/* Bullets */}
        {items.length > 0 ? (
          <ul className="mb-6 space-y-2.5">
            {items.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5 text-sm text-foreground/90">
                <span
                  className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", theme.dot)}
                  aria-hidden
                />
                <span className="leading-snug">{bullet}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {/* Footer */}
        <footer className="mt-auto border-t border-white/10 pt-4 text-center">
          <p className="text-xs font-medium tracking-wide text-muted-foreground/70">
            {footer}
          </p>
        </footer>
      </div>
    </article>
  );
}

export default ShareCard;
