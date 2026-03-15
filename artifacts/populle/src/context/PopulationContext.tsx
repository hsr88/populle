import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GetCountryPopulationVariant } from '@workspace/api-client-react';
import { getPlaybackStep } from '@/lib/timeUtils';

interface PopulationContextType {
  year: number;
  setYear: (year: number) => void;
  variant: GetCountryPopulationVariant;
  setVariant: (variant: GetCountryPopulationVariant) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
}

const PopulationContext = createContext<PopulationContextType | undefined>(undefined);

export function PopulationProvider({ children }: { children: ReactNode }) {
  const [year, setYear] = useState<number>(2026);
  const [variant, setVariant] = useState<GetCountryPopulationVariant>('medium');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Auto-playback logic
  useEffect(() => {
    if (!isPlaying) return;

    const intervalId = setInterval(() => {
      setYear((prev) => {
        if (prev >= 2100) {
          setIsPlaying(false);
          return 2100;
        }
        return prev + getPlaybackStep(prev);
      });
    }, 150); // Speed of playback

    return () => clearInterval(intervalId);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying((p) => !p);

  return (
    <PopulationContext.Provider 
      value={{ year, setYear, variant, setVariant, isPlaying, setIsPlaying, togglePlay }}
    >
      {children}
    </PopulationContext.Provider>
  );
}

export function usePopulationState() {
  const context = useContext(PopulationContext);
  if (context === undefined) {
    throw new Error('usePopulationState must be used within a PopulationProvider');
  }
  return context;
}
