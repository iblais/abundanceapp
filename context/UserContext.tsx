/**
 * User Context - Global state management for user data
 * Handles onboarding status, preferences, and persistence
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserState {
  onboardingComplete: boolean;
  rhythmSet: boolean;
  displayName: string;
  isPremium: boolean;
  voicePreference: 'masculine' | 'feminine' | 'neutral';
  morningTime: string;
  eveningTime: string;
  selectedDays: number[];
  alignmentScore: number;
  streak: number;
  sessionsCompleted: number;
}

interface UserContextType {
  user: UserState;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
  completeOnboarding: () => void;
  setRhythm: (morning: string, evening: string, days: number[]) => void;
  updateAlignmentScore: (score: number) => void;
}

const defaultUser: UserState = {
  onboardingComplete: false,
  rhythmSet: false,
  displayName: 'Abundance Seeker',
  isPremium: false,
  voicePreference: 'neutral',
  morningTime: '07:00',
  eveningTime: '21:00',
  selectedDays: [0, 1, 2, 3, 4, 5, 6],
  alignmentScore: 75,
  streak: 0,
  sessionsCompleted: 0,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserState>(defaultUser);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('abundanceUser');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser({ ...defaultUser, ...parsed });
      } catch (e) {
        console.error('Failed to parse saved user data:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save user data to localStorage when it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('abundanceUser', JSON.stringify(user));
    }
  }, [user, isLoaded]);

  const completeOnboarding = () => {
    setUser(prev => ({ ...prev, onboardingComplete: true }));
  };

  const setRhythm = (morning: string, evening: string, days: number[]) => {
    setUser(prev => ({
      ...prev,
      morningTime: morning,
      eveningTime: evening,
      selectedDays: days,
      rhythmSet: true,
    }));
  };

  const updateAlignmentScore = (score: number) => {
    setUser(prev => ({ ...prev, alignmentScore: score }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, completeOnboarding, setRhythm, updateAlignmentScore }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
