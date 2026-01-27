/**
 * Journey State Types
 *
 * This module defines the core types for the Hero's Journey progression system.
 * The journey state model tracks user progress through crystal selection,
 * stage completion, and mastery.
 */

// --- Journey Mode ---
// Represents the current phase of the user's journey
export type JourneyMode = 'selection' | 'active' | 'complete';

// --- Geode State ---
// Visual/interaction state for each crystal in the carousel
export type GeodeState = 'LOCKED' | 'AVAILABLE' | 'ACTIVE' | 'MASTERED';

// --- Stage Completed ---
// Progress within an active journey (0 = not started, 3 = mastery)
export type StageCompleted = 0 | 1 | 2 | 3;

// --- Journey Status ---
// The single source of truth for the user's journey state
export interface JourneyStatus {
  mode: JourneyMode;
  selectedCrystalId: string | null;
  stageCompleted: StageCompleted;
  completedCrystalIds: string[];
  updatedAt: number; // Unix timestamp
}

// --- Task Definition ---
// Represents a single stage task within a crystal's curriculum
export interface CrystalTask {
  stage: 1 | 2 | 3;
  text: string;
}

// --- Default State ---
// Clean selection state for new users or reset
export const DEFAULT_JOURNEY_STATUS: JourneyStatus = {
  mode: 'selection',
  selectedCrystalId: null,
  stageCompleted: 0,
  completedCrystalIds: [],
  updatedAt: Date.now(),
};

// --- Constants ---
export const MAX_STAGE = 3;
export const TOTAL_CRYSTALS = 8;
export const JOURNEY_STORAGE_KEY = 'abundance_journey_v1';

// Legacy constant aliases (for backward compatibility)
export const MAX_CRACK_LEVEL = MAX_STAGE;
export const TOTAL_GEODES = TOTAL_CRYSTALS;

// --- Legacy Types (for backward compatibility) ---
// These map to the new types for existing components
export type JourneyStatusLegacy = 'SELECTING' | 'IN_PROGRESS' | 'ALL_MASTERED';

export interface UserProgress {
  journeyStatus: JourneyStatusLegacy;
  activeGeodeId: string | null;
  masteredGeodeIds: string[];
  currentCrackLevel: number;
}

export const DEFAULT_USER_PROGRESS: UserProgress = {
  journeyStatus: 'SELECTING',
  activeGeodeId: null,
  masteredGeodeIds: [],
  currentCrackLevel: 0,
};

// --- Helper: Convert JourneyStatus to legacy UserProgress ---
// Used by existing carousel components until they're updated
export function journeyStatusToUserProgress(status: JourneyStatus): UserProgress {
  let journeyStatus: JourneyStatusLegacy = 'SELECTING';

  if (status.mode === 'active') {
    journeyStatus = 'IN_PROGRESS';
  } else if (status.mode === 'complete' || status.completedCrystalIds.length === TOTAL_CRYSTALS) {
    journeyStatus = 'ALL_MASTERED';
  }

  return {
    journeyStatus,
    activeGeodeId: status.selectedCrystalId,
    masteredGeodeIds: status.completedCrystalIds,
    currentCrackLevel: status.stageCompleted,
  };
}
