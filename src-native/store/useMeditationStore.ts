/**
 * Abundance Flow - Meditation Store
 *
 * Manages meditation playback state and library
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type MeditationCategory =
  | 'gratitude'
  | 'confidence'
  | 'calm'
  | 'focus'
  | 'abundance'
  | 'identity'
  | 'sleep'
  | 'morning'
  | 'evening';

export type MeditationDuration = 5 | 8 | 12;

export interface Meditation {
  id: string;
  title: string;
  description: string;
  category: MeditationCategory;
  durations: MeditationDuration[];
  audioFiles: {
    5?: string;
    8?: string;
    12?: string;
  };
  coverImage?: string;
  isPremium: boolean;
  tags: string[];
}

export interface PlaybackState {
  meditation: Meditation | null;
  selectedDuration: MeditationDuration;
  isPlaying: boolean;
  currentPosition: number; // in seconds
  totalDuration: number;
  backgroundSound: string | null;
  volume: number;
}

interface MeditationState {
  // Library
  meditations: Meditation[];
  favorites: string[];
  recentlyPlayed: string[];
  completedMeditations: string[];

  // Playback
  playback: PlaybackState;

  // Actions
  setMeditations: (meditations: Meditation[]) => void;
  toggleFavorite: (id: string) => void;
  addToRecentlyPlayed: (id: string) => void;
  markCompleted: (id: string) => void;

  // Playback actions
  startMeditation: (meditation: Meditation, duration: MeditationDuration) => void;
  pauseMeditation: () => void;
  resumeMeditation: () => void;
  stopMeditation: () => void;
  setPosition: (position: number) => void;
  setBackgroundSound: (sound: string | null) => void;
  setVolume: (volume: number) => void;

  // Getters
  getMeditationsByCategory: (category: MeditationCategory) => Meditation[];
  getFavorites: () => Meditation[];
  getRecentlyPlayed: () => Meditation[];
}

const initialPlayback: PlaybackState = {
  meditation: null,
  selectedDuration: 5,
  isPlaying: false,
  currentPosition: 0,
  totalDuration: 0,
  backgroundSound: null,
  volume: 1,
};

export const useMeditationStore = create<MeditationState>()(
  persist(
    (set, get) => ({
      // Initial state
      meditations: [],
      favorites: [],
      recentlyPlayed: [],
      completedMeditations: [],
      playback: initialPlayback,

      // Set meditations library
      setMeditations: (meditations) => set({ meditations }),

      // Toggle favorite
      toggleFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((fav) => fav !== id)
            : [...state.favorites, id],
        }));
      },

      // Add to recently played
      addToRecentlyPlayed: (id) => {
        set((state) => {
          const filtered = state.recentlyPlayed.filter((r) => r !== id);
          return {
            recentlyPlayed: [id, ...filtered].slice(0, 10), // Keep last 10
          };
        });
      },

      // Mark meditation as completed
      markCompleted: (id) => {
        set((state) => ({
          completedMeditations: state.completedMeditations.includes(id)
            ? state.completedMeditations
            : [...state.completedMeditations, id],
        }));
      },

      // Start a meditation
      startMeditation: (meditation, duration) => {
        get().addToRecentlyPlayed(meditation.id);
        set({
          playback: {
            ...get().playback,
            meditation,
            selectedDuration: duration,
            isPlaying: true,
            currentPosition: 0,
            totalDuration: duration * 60,
          },
        });
      },

      // Pause
      pauseMeditation: () => {
        set((state) => ({
          playback: { ...state.playback, isPlaying: false },
        }));
      },

      // Resume
      resumeMeditation: () => {
        set((state) => ({
          playback: { ...state.playback, isPlaying: true },
        }));
      },

      // Stop
      stopMeditation: () => {
        const currentMeditation = get().playback.meditation;
        if (currentMeditation) {
          get().markCompleted(currentMeditation.id);
        }
        set({ playback: initialPlayback });
      },

      // Set position
      setPosition: (position) => {
        set((state) => ({
          playback: { ...state.playback, currentPosition: position },
        }));
      },

      // Set background sound
      setBackgroundSound: (sound) => {
        set((state) => ({
          playback: { ...state.playback, backgroundSound: sound },
        }));
      },

      // Set volume
      setVolume: (volume) => {
        set((state) => ({
          playback: { ...state.playback, volume },
        }));
      },

      // Get meditations by category
      getMeditationsByCategory: (category) => {
        return get().meditations.filter((m) => m.category === category);
      },

      // Get favorite meditations
      getFavorites: () => {
        const state = get();
        return state.meditations.filter((m) =>
          state.favorites.includes(m.id)
        );
      },

      // Get recently played
      getRecentlyPlayed: () => {
        const state = get();
        return state.recentlyPlayed
          .map((id) => state.meditations.find((m) => m.id === id))
          .filter(Boolean) as Meditation[];
      },
    }),
    {
      name: 'abundance-meditation-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favorites: state.favorites,
        recentlyPlayed: state.recentlyPlayed,
        completedMeditations: state.completedMeditations,
      }),
    }
  )
);

export default useMeditationStore;
