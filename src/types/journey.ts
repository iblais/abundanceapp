export type JourneyStatus = 'SELECTING' | 'IN_PROGRESS' | 'ALL_MASTERED';

export type GeodeState = 'LOCKED' | 'AVAILABLE' | 'ACTIVE' | 'MASTERED';

export interface UserProgress {
  journeyStatus: JourneyStatus;
  activeGeodeId: string | null; // The ID of the geode currently being worked on
  masteredGeodeIds: string[];   // IDs of geodes that have been fully cracked
  currentCrackLevel: number;    // 0 to 3 (0=intact, 3=ready to shatter)
}

// Default initial progress state
export const DEFAULT_USER_PROGRESS: UserProgress = {
  journeyStatus: 'SELECTING',
  activeGeodeId: null,
  masteredGeodeIds: [],
  currentCrackLevel: 0,
};

// Constants
export const MAX_CRACK_LEVEL = 3;
export const TOTAL_GEODES = 8;
