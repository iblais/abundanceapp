/**
 * Abundance Flow - Progress Store
 *
 * Manages user progress, streaks, and alignment scores
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  alignmentScore: number;
  meditationsCompleted: number;
  journalEntriesCount: number;
  quickShiftsCompleted: number;
  moodEntries: MoodEntry[];
  practicesCompleted: string[]; // IDs of completed practices
}

export interface MoodEntry {
  timestamp: string;
  mood: 'elevated' | 'positive' | 'neutral' | 'low' | 'struggling';
  note?: string;
}

export interface Streak {
  type: 'meditation' | 'journal' | 'overall';
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string;
}

interface ProgressState {
  // Progress data
  dailyProgress: Record<string, DailyProgress>;
  streaks: {
    meditation: Streak;
    journal: Streak;
    overall: Streak;
  };
  totalMeditations: number;
  totalJournalEntries: number;
  totalPracticeMinutes: number;

  // Today's data
  todayScore: number;

  // Actions
  getTodayProgress: () => DailyProgress;
  updateTodayProgress: (updates: Partial<DailyProgress>) => void;
  completeMeditation: (durationMinutes: number) => void;
  addJournalEntry: () => void;
  completeQuickShift: () => void;
  completePractice: (practiceId: string) => void;
  addMoodEntry: (mood: MoodEntry['mood'], note?: string) => void;
  calculateAlignmentScore: () => number;
  updateStreaks: () => void;
  getProgressHistory: (days: number) => DailyProgress[];
  getWeeklyStats: () => { averageScore: number; totalPractices: number };
}

const getTodayKey = () => new Date().toISOString().split('T')[0];

const createEmptyDailyProgress = (date: string): DailyProgress => ({
  date,
  alignmentScore: 0,
  meditationsCompleted: 0,
  journalEntriesCount: 0,
  quickShiftsCompleted: 0,
  moodEntries: [],
  practicesCompleted: [],
});

const createDefaultStreak = (type: Streak['type']): Streak => ({
  type,
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: '',
});

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      // Initial state
      dailyProgress: {},
      streaks: {
        meditation: createDefaultStreak('meditation'),
        journal: createDefaultStreak('journal'),
        overall: createDefaultStreak('overall'),
      },
      totalMeditations: 0,
      totalJournalEntries: 0,
      totalPracticeMinutes: 0,
      todayScore: 0,

      // Get or create today's progress
      getTodayProgress: () => {
        const todayKey = getTodayKey();
        const state = get();
        return (
          state.dailyProgress[todayKey] ||
          createEmptyDailyProgress(todayKey)
        );
      },

      // Update today's progress
      updateTodayProgress: (updates) => {
        const todayKey = getTodayKey();
        set((state) => {
          const currentProgress =
            state.dailyProgress[todayKey] ||
            createEmptyDailyProgress(todayKey);
          const newProgress = { ...currentProgress, ...updates };

          // Recalculate alignment score
          const score = get().calculateAlignmentScore();
          newProgress.alignmentScore = score;

          return {
            dailyProgress: {
              ...state.dailyProgress,
              [todayKey]: newProgress,
            },
            todayScore: score,
          };
        });
      },

      // Complete a meditation
      completeMeditation: (durationMinutes) => {
        const todayKey = getTodayKey();
        set((state) => {
          const currentProgress =
            state.dailyProgress[todayKey] ||
            createEmptyDailyProgress(todayKey);

          const newProgress = {
            ...currentProgress,
            meditationsCompleted: currentProgress.meditationsCompleted + 1,
          };

          return {
            dailyProgress: {
              ...state.dailyProgress,
              [todayKey]: newProgress,
            },
            totalMeditations: state.totalMeditations + 1,
            totalPracticeMinutes: state.totalPracticeMinutes + durationMinutes,
          };
        });
        get().updateStreaks();
      },

      // Add a journal entry
      addJournalEntry: () => {
        const todayKey = getTodayKey();
        set((state) => {
          const currentProgress =
            state.dailyProgress[todayKey] ||
            createEmptyDailyProgress(todayKey);

          const newProgress = {
            ...currentProgress,
            journalEntriesCount: currentProgress.journalEntriesCount + 1,
          };

          return {
            dailyProgress: {
              ...state.dailyProgress,
              [todayKey]: newProgress,
            },
            totalJournalEntries: state.totalJournalEntries + 1,
          };
        });
        get().updateStreaks();
      },

      // Complete a quick shift
      completeQuickShift: () => {
        const todayKey = getTodayKey();
        set((state) => {
          const currentProgress =
            state.dailyProgress[todayKey] ||
            createEmptyDailyProgress(todayKey);

          return {
            dailyProgress: {
              ...state.dailyProgress,
              [todayKey]: {
                ...currentProgress,
                quickShiftsCompleted:
                  currentProgress.quickShiftsCompleted + 1,
              },
            },
          };
        });
      },

      // Complete a practice
      completePractice: (practiceId) => {
        const todayKey = getTodayKey();
        set((state) => {
          const currentProgress =
            state.dailyProgress[todayKey] ||
            createEmptyDailyProgress(todayKey);

          if (currentProgress.practicesCompleted.includes(practiceId)) {
            return state;
          }

          return {
            dailyProgress: {
              ...state.dailyProgress,
              [todayKey]: {
                ...currentProgress,
                practicesCompleted: [
                  ...currentProgress.practicesCompleted,
                  practiceId,
                ],
              },
            },
          };
        });
      },

      // Add a mood entry
      addMoodEntry: (mood, note) => {
        const todayKey = getTodayKey();
        const entry: MoodEntry = {
          timestamp: new Date().toISOString(),
          mood,
          note,
        };

        set((state) => {
          const currentProgress =
            state.dailyProgress[todayKey] ||
            createEmptyDailyProgress(todayKey);

          return {
            dailyProgress: {
              ...state.dailyProgress,
              [todayKey]: {
                ...currentProgress,
                moodEntries: [...currentProgress.moodEntries, entry],
              },
            },
          };
        });
      },

      // Calculate alignment score (0-100)
      calculateAlignmentScore: () => {
        const todayProgress = get().getTodayProgress();

        let score = 0;

        // Meditation: up to 30 points (10 per meditation, max 3)
        score += Math.min(todayProgress.meditationsCompleted * 10, 30);

        // Journal: up to 20 points (20 for 1+)
        score += todayProgress.journalEntriesCount > 0 ? 20 : 0;

        // Quick shifts: up to 15 points (5 per shift, max 3)
        score += Math.min(todayProgress.quickShiftsCompleted * 5, 15);

        // Practices: up to 20 points (5 per practice, max 4)
        score += Math.min(todayProgress.practicesCompleted.length * 5, 20);

        // Mood entries: up to 15 points (positive mood bonus)
        const latestMood =
          todayProgress.moodEntries[todayProgress.moodEntries.length - 1];
        if (latestMood) {
          const moodScores = {
            elevated: 15,
            positive: 12,
            neutral: 8,
            low: 5,
            struggling: 3,
          };
          score += moodScores[latestMood.mood];
        }

        return Math.min(score, 100);
      },

      // Update streaks
      updateStreaks: () => {
        const todayKey = getTodayKey();
        const yesterdayKey = new Date(Date.now() - 86400000)
          .toISOString()
          .split('T')[0];

        set((state) => {
          const todayProgress = state.dailyProgress[todayKey];
          const newStreaks = { ...state.streaks };

          // Meditation streak
          if (todayProgress?.meditationsCompleted > 0) {
            if (
              newStreaks.meditation.lastCompletedDate === yesterdayKey ||
              newStreaks.meditation.lastCompletedDate === todayKey
            ) {
              if (newStreaks.meditation.lastCompletedDate !== todayKey) {
                newStreaks.meditation.currentStreak += 1;
              }
            } else {
              newStreaks.meditation.currentStreak = 1;
            }
            newStreaks.meditation.lastCompletedDate = todayKey;
            newStreaks.meditation.longestStreak = Math.max(
              newStreaks.meditation.longestStreak,
              newStreaks.meditation.currentStreak
            );
          }

          // Journal streak
          if (todayProgress?.journalEntriesCount > 0) {
            if (
              newStreaks.journal.lastCompletedDate === yesterdayKey ||
              newStreaks.journal.lastCompletedDate === todayKey
            ) {
              if (newStreaks.journal.lastCompletedDate !== todayKey) {
                newStreaks.journal.currentStreak += 1;
              }
            } else {
              newStreaks.journal.currentStreak = 1;
            }
            newStreaks.journal.lastCompletedDate = todayKey;
            newStreaks.journal.longestStreak = Math.max(
              newStreaks.journal.longestStreak,
              newStreaks.journal.currentStreak
            );
          }

          // Overall streak (any practice)
          if (
            todayProgress &&
            (todayProgress.meditationsCompleted > 0 ||
              todayProgress.journalEntriesCount > 0 ||
              todayProgress.quickShiftsCompleted > 0)
          ) {
            if (
              newStreaks.overall.lastCompletedDate === yesterdayKey ||
              newStreaks.overall.lastCompletedDate === todayKey
            ) {
              if (newStreaks.overall.lastCompletedDate !== todayKey) {
                newStreaks.overall.currentStreak += 1;
              }
            } else {
              newStreaks.overall.currentStreak = 1;
            }
            newStreaks.overall.lastCompletedDate = todayKey;
            newStreaks.overall.longestStreak = Math.max(
              newStreaks.overall.longestStreak,
              newStreaks.overall.currentStreak
            );
          }

          return { streaks: newStreaks };
        });
      },

      // Get progress history for the last N days
      getProgressHistory: (days) => {
        const state = get();
        const history: DailyProgress[] = [];

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(Date.now() - i * 86400000)
            .toISOString()
            .split('T')[0];
          history.push(
            state.dailyProgress[date] || createEmptyDailyProgress(date)
          );
        }

        return history;
      },

      // Get weekly stats
      getWeeklyStats: () => {
        const history = get().getProgressHistory(7);
        const totalScore = history.reduce(
          (sum, day) => sum + day.alignmentScore,
          0
        );
        const totalPractices = history.reduce(
          (sum, day) =>
            sum +
            day.meditationsCompleted +
            day.journalEntriesCount +
            day.quickShiftsCompleted +
            day.practicesCompleted.length,
          0
        );

        return {
          averageScore: Math.round(totalScore / 7),
          totalPractices,
        };
      },
    }),
    {
      name: 'abundance-progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useProgressStore;
