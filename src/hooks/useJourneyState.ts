import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  JourneyStatus,
  JourneyMode,
  StageCompleted,
  GeodeState,
  DEFAULT_JOURNEY_STATUS,
  JOURNEY_STORAGE_KEY,
  MAX_STAGE,
  TOTAL_CRYSTALS,
  journeyStatusToUserProgress,
  UserProgress,
} from '../types/journey';

/**
 * useJourneyState Hook
 *
 * Single source of truth for the Hero's Journey progression system.
 * Manages crystal selection, stage progression, mastery, and persistence.
 *
 * Features:
 * - localStorage persistence with versioned key
 * - Selection and locking logic
 * - Stage progression and mastery tracking
 * - Graceful handling of corrupted/missing data
 */

// --- Storage Helpers ---

/**
 * Validates that a value is a valid JourneyStatus object
 */
function isValidJourneyStatus(value: unknown): value is JourneyStatus {
  if (typeof value !== 'object' || value === null) return false;

  const obj = value as Record<string, unknown>;

  // Check mode
  if (!['selection', 'active', 'complete'].includes(obj.mode as string)) return false;

  // Check selectedCrystalId
  if (obj.selectedCrystalId !== null && typeof obj.selectedCrystalId !== 'string') return false;

  // Check stageCompleted
  if (typeof obj.stageCompleted !== 'number' || ![0, 1, 2, 3].includes(obj.stageCompleted)) return false;

  // Check completedCrystalIds
  if (!Array.isArray(obj.completedCrystalIds)) return false;
  if (!obj.completedCrystalIds.every((id) => typeof id === 'string')) return false;

  // Check updatedAt
  if (typeof obj.updatedAt !== 'number') return false;

  return true;
}

/**
 * Loads journey state from localStorage
 * Returns DEFAULT_JOURNEY_STATUS if data is missing or corrupted
 */
function loadJourneyState(): JourneyStatus {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_JOURNEY_STATUS, updatedAt: Date.now() };
  }

  try {
    const stored = localStorage.getItem(JOURNEY_STORAGE_KEY);
    if (!stored) {
      return { ...DEFAULT_JOURNEY_STATUS, updatedAt: Date.now() };
    }

    const parsed = JSON.parse(stored);
    if (isValidJourneyStatus(parsed)) {
      return parsed;
    }

    // Data is corrupted, return default
    console.warn('[useJourneyState] Corrupted localStorage data, resetting to default');
    return { ...DEFAULT_JOURNEY_STATUS, updatedAt: Date.now() };
  } catch (error) {
    console.warn('[useJourneyState] Failed to load from localStorage:', error);
    return { ...DEFAULT_JOURNEY_STATUS, updatedAt: Date.now() };
  }
}

/**
 * Saves journey state to localStorage
 */
function saveJourneyState(state: JourneyStatus): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('[useJourneyState] Failed to save to localStorage:', error);
  }
}

// --- Hook Definition ---

export interface UseJourneyStateReturn {
  // Current state
  journeyStatus: JourneyStatus;

  // Legacy-compatible state (for existing components)
  userProgress: UserProgress;

  // State queries
  isInSelection: boolean;
  isInActiveJourney: boolean;
  isJourneyComplete: boolean;
  hasCompletedAllCrystals: boolean;

  // Crystal state queries
  getGeodeState: (crystalId: string) => GeodeState;
  isCrystalLocked: (crystalId: string) => boolean;
  isCrystalAvailable: (crystalId: string) => boolean;
  isCrystalActive: (crystalId: string) => boolean;
  isCrystalMastered: (crystalId: string) => boolean;

  // Current journey queries
  currentCrystalId: string | null;
  currentStage: StageCompleted;
  getCurrentTask: () => { stage: number; isCompleted: boolean } | null;

  // Actions
  selectCrystal: (crystalId: string) => boolean;
  completeStage: () => boolean;
  resetJourney: () => void;
  startNewJourney: () => void;

  // Debug/testing
  forceSetState: (state: Partial<JourneyStatus>) => void;
}

export function useJourneyState(): UseJourneyStateReturn {
  // Initialize state from localStorage
  const [journeyStatus, setJourneyStatus] = useState<JourneyStatus>(() => loadJourneyState());

  // Persist state changes to localStorage
  useEffect(() => {
    saveJourneyState(journeyStatus);
  }, [journeyStatus]);

  // Load state on mount (handles SSR)
  useEffect(() => {
    const loaded = loadJourneyState();
    setJourneyStatus(loaded);
  }, []);

  // --- State Queries ---

  const isInSelection = journeyStatus.mode === 'selection';
  const isInActiveJourney = journeyStatus.mode === 'active';
  const isJourneyComplete = journeyStatus.mode === 'complete';
  const hasCompletedAllCrystals = journeyStatus.completedCrystalIds.length === TOTAL_CRYSTALS;

  // --- Crystal State Queries ---

  const getGeodeState = useCallback(
    (crystalId: string): GeodeState => {
      // Already mastered
      if (journeyStatus.completedCrystalIds.includes(crystalId)) {
        return 'MASTERED';
      }

      // Currently active
      if (journeyStatus.selectedCrystalId === crystalId) {
        return 'ACTIVE';
      }

      // In active journey, other crystals are locked
      if (journeyStatus.mode === 'active') {
        return 'LOCKED';
      }

      // In selection or complete mode, non-mastered crystals are available
      return 'AVAILABLE';
    },
    [journeyStatus.completedCrystalIds, journeyStatus.selectedCrystalId, journeyStatus.mode]
  );

  const isCrystalLocked = useCallback(
    (crystalId: string): boolean => getGeodeState(crystalId) === 'LOCKED',
    [getGeodeState]
  );

  const isCrystalAvailable = useCallback(
    (crystalId: string): boolean => getGeodeState(crystalId) === 'AVAILABLE',
    [getGeodeState]
  );

  const isCrystalActive = useCallback(
    (crystalId: string): boolean => getGeodeState(crystalId) === 'ACTIVE',
    [getGeodeState]
  );

  const isCrystalMastered = useCallback(
    (crystalId: string): boolean => getGeodeState(crystalId) === 'MASTERED',
    [getGeodeState]
  );

  // --- Current Journey Queries ---

  const currentCrystalId = journeyStatus.selectedCrystalId;
  const currentStage = journeyStatus.stageCompleted;

  const getCurrentTask = useCallback((): { stage: number; isCompleted: boolean } | null => {
    if (journeyStatus.mode !== 'active' || !journeyStatus.selectedCrystalId) {
      return null;
    }

    // Next stage to complete (1, 2, or 3)
    const nextStage = (journeyStatus.stageCompleted + 1) as 1 | 2 | 3;

    if (nextStage > MAX_STAGE) {
      // All stages completed
      return { stage: MAX_STAGE, isCompleted: true };
    }

    return { stage: nextStage, isCompleted: false };
  }, [journeyStatus.mode, journeyStatus.selectedCrystalId, journeyStatus.stageCompleted]);

  // --- Actions ---

  /**
   * Select a crystal to begin a journey
   * Returns true if selection was successful, false if crystal is locked
   */
  const selectCrystal = useCallback(
    (crystalId: string): boolean => {
      const state = getGeodeState(crystalId);

      // Cannot select locked or already mastered crystals
      if (state === 'LOCKED') {
        console.warn(`[useJourneyState] Cannot select locked crystal: ${crystalId}`);
        return false;
      }

      if (state === 'MASTERED') {
        console.warn(`[useJourneyState] Crystal already mastered: ${crystalId}`);
        return false;
      }

      // Cannot select if already in active journey with different crystal
      if (journeyStatus.mode === 'active' && journeyStatus.selectedCrystalId !== crystalId) {
        console.warn(`[useJourneyState] Already in active journey with: ${journeyStatus.selectedCrystalId}`);
        return false;
      }

      // If already active with same crystal, no-op
      if (state === 'ACTIVE') {
        return true;
      }

      // Select the crystal and begin journey
      setJourneyStatus({
        mode: 'active',
        selectedCrystalId: crystalId,
        stageCompleted: 0,
        completedCrystalIds: journeyStatus.completedCrystalIds,
        updatedAt: Date.now(),
      });

      return true;
    },
    [getGeodeState, journeyStatus.mode, journeyStatus.selectedCrystalId, journeyStatus.completedCrystalIds]
  );

  /**
   * Complete the current stage and advance progress
   * Returns true if stage was completed, false if no active journey or already at max
   */
  const completeStage = useCallback((): boolean => {
    if (journeyStatus.mode !== 'active' || !journeyStatus.selectedCrystalId) {
      console.warn('[useJourneyState] Cannot complete stage: no active journey');
      return false;
    }

    const currentLevel = journeyStatus.stageCompleted;

    if (currentLevel >= MAX_STAGE) {
      console.warn('[useJourneyState] Already at max stage');
      return false;
    }

    const newLevel = (currentLevel + 1) as StageCompleted;

    // Check if this completes mastery
    if (newLevel === MAX_STAGE) {
      // Mastery achieved!
      const newCompletedIds = [...journeyStatus.completedCrystalIds, journeyStatus.selectedCrystalId];

      setJourneyStatus({
        mode: 'complete',
        selectedCrystalId: journeyStatus.selectedCrystalId, // Keep for reference
        stageCompleted: newLevel,
        completedCrystalIds: newCompletedIds,
        updatedAt: Date.now(),
      });
    } else {
      // Increment stage
      setJourneyStatus({
        ...journeyStatus,
        stageCompleted: newLevel,
        updatedAt: Date.now(),
      });
    }

    return true;
  }, [journeyStatus]);

  /**
   * Reset journey to selection mode
   * Clears active crystal but preserves completed crystals
   */
  const resetJourney = useCallback((): void => {
    setJourneyStatus({
      mode: 'selection',
      selectedCrystalId: null,
      stageCompleted: 0,
      completedCrystalIds: journeyStatus.completedCrystalIds,
      updatedAt: Date.now(),
    });
  }, [journeyStatus.completedCrystalIds]);

  /**
   * Start a new journey (alias for resetJourney)
   * Called after completing a journey to return to selection
   */
  const startNewJourney = useCallback((): void => {
    resetJourney();
  }, [resetJourney]);

  /**
   * Force set state (for debugging/testing)
   */
  const forceSetState = useCallback((state: Partial<JourneyStatus>): void => {
    setJourneyStatus((prev) => ({
      ...prev,
      ...state,
      updatedAt: Date.now(),
    }));
  }, []);

  // --- Legacy Compatibility ---

  const userProgress = useMemo(
    () => journeyStatusToUserProgress(journeyStatus),
    [journeyStatus]
  );

  return {
    // Current state
    journeyStatus,

    // Legacy-compatible state
    userProgress,

    // State queries
    isInSelection,
    isInActiveJourney,
    isJourneyComplete,
    hasCompletedAllCrystals,

    // Crystal state queries
    getGeodeState,
    isCrystalLocked,
    isCrystalAvailable,
    isCrystalActive,
    isCrystalMastered,

    // Current journey queries
    currentCrystalId,
    currentStage,
    getCurrentTask,

    // Actions
    selectCrystal,
    completeStage,
    resetJourney,
    startNewJourney,

    // Debug/testing
    forceSetState,
  };
}

export default useJourneyState;
