/**
 * Abundance Recode - Journal Store
 *
 * Manages journal entries, gratitude entries, and identity exercises
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type JournalType = 'gratitude' | 'freeform' | 'identity' | 'reflection';

export interface JournalEntry {
  id: string;
  type: JournalType;
  title?: string;
  content: string;
  promptId?: string;
  promptText?: string;
  mood?: 'elevated' | 'positive' | 'neutral' | 'low' | 'struggling';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
}

export interface ShiftBoardItem {
  id: string;
  type: 'text' | 'image' | 'goal' | 'affirmation';
  content: string;
  imageUri?: string;
  category?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  color?: string;
  createdAt: string;
}

interface JournalState {
  // Journal entries
  entries: JournalEntry[];

  // Reality Shift Board items
  shiftBoardItems: ShiftBoardItem[];

  // Actions
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  toggleFavorite: (id: string) => void;
  getEntriesByType: (type: JournalType) => JournalEntry[];
  getEntriesByDate: (date: string) => JournalEntry[];
  searchEntries: (query: string) => JournalEntry[];

  // Shift Board actions
  addShiftBoardItem: (item: Omit<ShiftBoardItem, 'id' | 'createdAt'>) => void;
  updateShiftBoardItem: (id: string, updates: Partial<ShiftBoardItem>) => void;
  deleteShiftBoardItem: (id: string) => void;
  getShiftBoardItems: () => ShiftBoardItem[];
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      // Initial state
      entries: [],
      shiftBoardItems: [],

      // Add a new journal entry
      addEntry: (entryData) => {
        const now = new Date().toISOString();
        const newEntry: JournalEntry = {
          id: generateId(),
          createdAt: now,
          updatedAt: now,
          ...entryData,
        };

        set((state) => ({
          entries: [newEntry, ...state.entries],
        }));
      },

      // Update an existing entry
      updateEntry: (id, updates) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
              : entry
          ),
        }));
      },

      // Delete an entry
      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },

      // Toggle favorite status
      toggleFavorite: (id) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
          ),
        }));
      },

      // Get entries by type
      getEntriesByType: (type) => {
        return get().entries.filter((entry) => entry.type === type);
      },

      // Get entries by date (YYYY-MM-DD)
      getEntriesByDate: (date) => {
        return get().entries.filter(
          (entry) => entry.createdAt.split('T')[0] === date
        );
      },

      // Search entries
      searchEntries: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().entries.filter(
          (entry) =>
            entry.content.toLowerCase().includes(lowerQuery) ||
            entry.title?.toLowerCase().includes(lowerQuery) ||
            entry.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      },

      // Add a shift board item
      addShiftBoardItem: (itemData) => {
        const newItem: ShiftBoardItem = {
          id: generateId(),
          createdAt: new Date().toISOString(),
          ...itemData,
        };

        set((state) => ({
          shiftBoardItems: [...state.shiftBoardItems, newItem],
        }));
      },

      // Update a shift board item
      updateShiftBoardItem: (id, updates) => {
        set((state) => ({
          shiftBoardItems: state.shiftBoardItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      // Delete a shift board item
      deleteShiftBoardItem: (id) => {
        set((state) => ({
          shiftBoardItems: state.shiftBoardItems.filter((item) => item.id !== id),
        }));
      },

      // Get all shift board items
      getShiftBoardItems: () => {
        return get().shiftBoardItems;
      },
    }),
    {
      name: 'abundance-journal-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useJournalStore;
