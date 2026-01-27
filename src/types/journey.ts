/**
 * Hero's Journey Progression System - Type Definitions
 *
 * This file defines the core types for the journey state model.
 * The journey follows a selection → active → complete cycle for each crystal.
 */

// --- Journey Mode ---
// Represents the current phase of the user's journey
export type JourneyMode = 'selection' | 'active' | 'complete';

// --- Stage Task ---
// Individual task within a crystal's curriculum
export interface StageTask {
  stage: 1 | 2 | 3;
  text: string;
}

// --- Journey Status ---
// The single source of truth for the user's journey state
export interface JourneyStatus {
  mode: JourneyMode;
  selectedCrystalId: string | null;
  stageCompleted: 0 | 1 | 2 | 3;
  completedCrystalIds: string[];
  updatedAt: number;
}

// --- Crystal Slot State ---
// Visual/interaction state for each crystal in the UI
export type CrystalSlotState = 'available' | 'locked' | 'active' | 'mastered';

// --- Default Journey Status ---
// Initial state when no saved data exists
export const DEFAULT_JOURNEY_STATUS: JourneyStatus = {
  mode: 'selection',
  selectedCrystalId: null,
  stageCompleted: 0,
  completedCrystalIds: [],
  updatedAt: Date.now(),
};

// --- Constants ---
export const JOURNEY_STORAGE_KEY = 'abundance_journey_v1';
export const TOTAL_STAGES = 3;
export const TOTAL_CRYSTALS = 8;

// --- Helper: Get Crystal Slot State ---
// Determines the display/interaction state for a crystal based on journey status
export function getCrystalSlotState(
  crystalId: string,
  journeyStatus: JourneyStatus
): CrystalSlotState {
  // Already mastered
  if (journeyStatus.completedCrystalIds.includes(crystalId)) {
    return 'mastered';
  }

  // Currently selected/active
  if (journeyStatus.selectedCrystalId === crystalId) {
    return 'active';
  }

  // Journey in progress with different crystal = locked
  if (journeyStatus.mode === 'active') {
    return 'locked';
  }

  // Selection mode = available
  return 'available';
}

// --- Legacy Types (for backwards compatibility during transition) ---
// These will be removed in a future update
export type JourneyStatusLegacy = 'SELECTING' | 'IN_PROGRESS' | 'ALL_MASTERED';
export type GeodeState = 'LOCKED' | 'AVAILABLE' | 'ACTIVE' | 'MASTERED';

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

export const MAX_CRACK_LEVEL = 3;
export const TOTAL_GEODES = 8;
