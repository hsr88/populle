import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";

export function LoadingScreen({ message = "Loading data..." }: { message?: string }) {
  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center space-y-6">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        className="relative"
      >
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        <Globe2 className="w-16 h-16 text-primary relative z-10" />
      </motion.div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, yoyo: Infinity }}
        className="text-primary font-display font-medium tracking-widest uppercase text-sm"
      >
        {message}
      </motion.p>
    </div>
  );
}

export function ErrorState({ error, retry }: { error: Error | null, retry?: () => void }) {
  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-6">
        <span className="text-2xl">⚠️</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Failed to load data</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        {error?.message || "There was an error communicating with the API. Please try again."}
      </p>
      {retry && (
        <button 
          onClick={retry}
          className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 font-medium"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
