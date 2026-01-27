/**
 * Hero's Journey State Management Hook
 *
 * This hook provides the single source of truth for journey progression.
 * It handles:
 * - Loading/saving state to localStorage
 * - Selection, locking, and progression logic
 * - Stage completion and mastery transitions
 */

import { useState, useEffect, useCallback } from 'react';
import {
  JourneyStatus,
  JourneyMode,
  CrystalSlotState,
  DEFAULT_JOURNEY_STATUS,
  JOURNEY_STORAGE_KEY,
  TOTAL_STAGES,
  TOTAL_CRYSTALS,
  getCrystalSlotState,
} from '../types/journey';

// --- Storage Helpers ---

/**
 * Load journey status from localStorage
 * Returns default state if missing or corrupted
 */
function loadJourneyStatus(): JourneyStatus {
  if (typeof window === 'undefined') {
    return DEFAULT_JOURNEY_STATUS;
  }

  try {
    const stored = localStorage.getItem(JOURNEY_STORAGE_KEY);
    if (!stored) {
      return DEFAULT_JOURNEY_STATUS;
    }

    const parsed = JSON.parse(stored);

    // Validate the parsed data has required fields
    if (
      typeof parsed.mode !== 'string' ||
      !['selection', 'active', 'complete'].includes(parsed.mode) ||
      typeof parsed.stageCompleted !== 'number' ||
      !Array.isArray(parsed.completedCrystalIds) ||
      typeof parsed.updatedAt !== 'number'
    ) {
      console.warn('[useJourneyState] Invalid stored data, using defaults');
      return DEFAULT_JOURNEY_STATUS;
    }

    // Ensure stageCompleted is in valid range
    const stageCompleted = Math.max(0, Math.min(3, parsed.stageCompleted)) as 0 | 1 | 2 | 3;

    return {
      mode: parsed.mode as JourneyMode,
      selectedCrystalId: parsed.selectedCrystalId ?? null,
      stageCompleted,
      completedCrystalIds: parsed.completedCrystalIds.filter(
        (id: unknown) => typeof id === 'string'
      ),
      updatedAt: parsed.updatedAt,
    };
  } catch (error) {
    console.warn('[useJourneyState] Failed to parse stored data:', error);
    return DEFAULT_JOURNEY_STATUS;
  }
}

/**
 * Save journey status to localStorage
 */
function saveJourneyStatus(status: JourneyStatus): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(status));
  } catch (error) {
    console.error('[useJourneyState] Failed to save journey status:', error);
  }
}

// --- Hook Return Type ---

export interface UseJourneyStateReturn {
  // Current state
  journeyStatus: JourneyStatus;

  // Computed helpers
  getCrystalState: (crystalId: string) => CrystalSlotState;
  isAllMastered: boolean;
  currentTask: { stage: 1 | 2 | 3; crystalId: string } | null;

  // Actions
  selectCrystal: (crystalId: string) => void;
  completeStage: () => void;
  resetJourney: () => void;
  clearAllProgress: () => void;
}

// --- Main Hook ---

export function useJourneyState(): UseJourneyStateReturn {
  const [journeyStatus, setJourneyStatus] = useState<JourneyStatus>(DEFAULT_JOURNEY_STATUS);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadJourneyStatus();
    setJourneyStatus(loaded);
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever state changes (after initial load)
  useEffect(() => {
    if (isInitialized) {
      saveJourneyStatus(journeyStatus);
    }
  }, [journeyStatus, isInitialized]);

  // --- Computed Values ---

  const getCrystalState = useCallback(
    (crystalId: string): CrystalSlotState => {
      return getCrystalSlotState(crystalId, journeyStatus);
    },
    [journeyStatus]
  );

  const isAllMastered = journeyStatus.completedCrystalIds.length >= TOTAL_CRYSTALS;

  const currentTask: { stage: 1 | 2 | 3; crystalId: string } | null =
    journeyStatus.mode === 'active' && journeyStatus.selectedCrystalId
      ? {
          stage: (journeyStatus.stageCompleted + 1) as 1 | 2 | 3,
          crystalId: journeyStatus.selectedCrystalId,
        }
      : null;

  // --- Actions ---

  /**
   * Select a crystal to begin a new journey
   * Rules:
   * - Can only select when in "selection" mode
   * - Sets mode to "active"
   * - Resets stageCompleted to 0
   * - All other crystals become locked
   */
  const selectCrystal = useCallback((crystalId: string) => {
    setJourneyStatus((prev) => {
      // Can only select in selection mode or complete mode
      if (prev.mode !== 'selection' && prev.mode !== 'complete') {
        console.warn('[useJourneyState] Cannot select crystal: journey in progress');
        return prev;
      }

      // Cannot select already mastered crystal
      if (prev.completedCrystalIds.includes(crystalId)) {
        console.warn('[useJourneyState] Cannot select crystal: already mastered');
        return prev;
      }

      return {
        ...prev,
        mode: 'active',
        selectedCrystalId: crystalId,
        stageCompleted: 0,
        updatedAt: Date.now(),
      };
    });
  }, []);

  /**
   * Complete the current stage of the active journey
   * Rules:
   * - If stageCompleted < 3, increment by 1
   * - When stageCompleted reaches 3, trigger mastery
   */
  const completeStage = useCallback(() => {
    setJourneyStatus((prev) => {
      // Must be in active mode with a selected crystal
      if (prev.mode !== 'active' || !prev.selectedCrystalId) {
        console.warn('[useJourneyState] Cannot complete stage: no active journey');
        return prev;
      }

      const newStageCompleted = prev.stageCompleted + 1;

      // Check for mastery (reached stage 3)
      if (newStageCompleted >= TOTAL_STAGES) {
        const newCompletedIds = [...prev.completedCrystalIds, prev.selectedCrystalId];

        return {
          mode: 'complete',
          selectedCrystalId: prev.selectedCrystalId, // Keep for display purposes
          stageCompleted: 3,
          completedCrystalIds: newCompletedIds,
          updatedAt: Date.now(),
        };
      }

      // Normal stage progression
      return {
        ...prev,
        stageCompleted: newStageCompleted as 0 | 1 | 2 | 3,
        updatedAt: Date.now(),
      };
    });
  }, []);

  /**
   * Reset to selection mode to start a new journey
   * Rules:
   * - Clears selectedCrystalId
   * - Resets stageCompleted
   * - Mode → "selection"
   * - Preserves completedCrystalIds
   */
  const resetJourney = useCallback(() => {
    setJourneyStatus((prev) => ({
      mode: 'selection',
      selectedCrystalId: null,
      stageCompleted: 0,
      completedCrystalIds: prev.completedCrystalIds,
      updatedAt: Date.now(),
    }));
  }, []);

  /**
   * Clear all progress (for testing/debugging)
   * Resets everything to default state
   */
  const clearAllProgress = useCallback(() => {
    const defaultStatus = {
      ...DEFAULT_JOURNEY_STATUS,
      updatedAt: Date.now(),
    };
    setJourneyStatus(defaultStatus);
  }, []);

  return {
    journeyStatus,
    getCrystalState,
    isAllMastered,
    currentTask,
    selectCrystal,
    completeStage,
    resetJourney,
    clearAllProgress,
  };
}

export default useJourneyState;
