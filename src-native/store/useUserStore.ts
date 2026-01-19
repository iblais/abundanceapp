/**
 * Abundance Recode - User Store
 *
 * Manages user authentication state and profile data
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  isPremium: boolean;
  premiumExpiresAt?: string;
  voicePreference: 'masculine' | 'feminine' | 'neutral';
  onboardingComplete: boolean;
}

export interface UserSettings {
  notifications: {
    morningReminder: boolean;
    eveningReminder: boolean;
    streakReminders: boolean;
    milestones: boolean;
  };
  dailyRhythm: {
    morningTime: string; // HH:MM format
    eveningTime: string;
    activeDays: number[]; // 0-6 for Sun-Sat
  };
  preferences: {
    themeMode: 'dark' | 'light' | 'system';
    hapticFeedback: boolean;
    backgroundSounds: boolean;
  };
}

interface UserState {
  // User data
  user: UserProfile | null;
  settings: UserSettings;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: UserProfile | null) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  setSettings: (settings: UserSettings) => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
  setLoading: (loading: boolean) => void;
  completeOnboarding: () => void;
  upgradeToPremium: (expiresAt: string) => void;
  setVoicePreference: (voice: 'masculine' | 'feminine' | 'neutral') => void;
  logout: () => void;
}

const defaultSettings: UserSettings = {
  notifications: {
    morningReminder: true,
    eveningReminder: true,
    streakReminders: true,
    milestones: true,
  },
  dailyRhythm: {
    morningTime: '07:00',
    eveningTime: '21:00',
    activeDays: [0, 1, 2, 3, 4, 5, 6], // All days
  },
  preferences: {
    themeMode: 'dark',
    hapticFeedback: true,
    backgroundSounds: true,
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      settings: defaultSettings,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      setSettings: (settings) => set({ settings }),

      updateSettings: (updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...updates,
            notifications: {
              ...state.settings.notifications,
              ...(updates.notifications || {}),
            },
            dailyRhythm: {
              ...state.settings.dailyRhythm,
              ...(updates.dailyRhythm || {}),
            },
            preferences: {
              ...state.settings.preferences,
              ...(updates.preferences || {}),
            },
          },
        })),

      setLoading: (isLoading) => set({ isLoading }),

      completeOnboarding: () =>
        set((state) => ({
          user: state.user
            ? { ...state.user, onboardingComplete: true }
            : null,
        })),

      upgradeToPremium: (expiresAt) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, isPremium: true, premiumExpiresAt: expiresAt }
            : null,
        })),

      setVoicePreference: (voice) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, voicePreference: voice }
            : null,
        })),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          settings: defaultSettings,
        }),
    }),
    {
      name: 'abundance-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        settings: state.settings,
      }),
    }
  )
);

export default useUserStore;
