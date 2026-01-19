/**
 * Abundance Recode - Navigation Types
 *
 * Type definitions for all navigation routes
 */

import { NavigatorScreenParams } from '@react-navigation/native';

// Root stack params
export type RootStackParamList = {
  Welcome: undefined;
  Onboarding: undefined;
  RhythmScheduler: { fromOnboarding?: boolean };
  Main: NavigatorScreenParams<MainTabParamList>;
  MeditationPlayer: { meditationId: string; duration: 5 | 8 | 12 };
  JournalEntry: { entryId?: string; type?: 'gratitude' | 'freeform' | 'identity' | 'reflection' };
  MentorChat: undefined;
  IdentityExercise: { exerciseId: string };
  ArticleDetail: { articleId: string };
  VoiceSelector: undefined;
  Paywall: undefined;
  Settings: undefined;
  Profile: undefined;
};

// Main tab params
export type MainTabParamList = {
  Home: undefined;
  Meditations: undefined;
  Journal: undefined;
  Progress: undefined;
};

// Meditation stack params
export type MeditationStackParamList = {
  MeditationLibrary: undefined;
  MeditationDetail: { meditationId: string };
  SoundPlayer: undefined;
};

// Journal stack params
export type JournalStackParamList = {
  JournalList: undefined;
  GratitudeJournal: undefined;
  ShiftBoard: undefined;
  PracticesLibrary: undefined;
};

// Progress stack params
export type ProgressStackParamList = {
  ProgressHome: undefined;
  StreakDetails: undefined;
  LearnGrow: undefined;
  Audiobooks: undefined;
};

// Declare global types for navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
