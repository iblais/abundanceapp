/**
 * JourneyCarousel - Simplified version without geode images
 * Shows only text-based path selection and status
 */

import React from 'react';
import { CRYSTALS } from './AbundanceComponents';
import { JourneyStatus, getCrystalSlotState } from '../src/types/journey';

// Map crystal ID to theme label
const CRYSTAL_THEMES: Record<string, string> = {
  'citrine': 'Wealth',
  'rose-quartz': 'Love',
  'emerald': 'Health',
  'amethyst': 'Peace',
  'ruby': 'Passion',
  'sapphire': 'Wisdom',
  'obsidian': 'Protection',
  'clear-quartz': 'Focus',
};

interface JourneyCarouselProps {
  journeyStatus: JourneyStatus;
  onSelectCrystal: (crystalId: string) => void;
}

export const JourneyCarousel: React.FC<JourneyCarouselProps> = ({
  journeyStatus,
  onSelectCrystal,
}) => {
  const selectedCrystal = journeyStatus.selectedCrystalId
    ? CRYSTALS.find(c => c.id === journeyStatus.selectedCrystalId)
    : null;

  const isActiveMode = journeyStatus.mode === 'active' || journeyStatus.mode === 'complete';

  // Active mode - show selected path info
  if (isActiveMode && selectedCrystal) {
    return (
      <div
        style={{
          padding: '24px 20px',
          textAlign: 'center',
        }}
      >
        <p className="text-xs text-yellow-400/80 uppercase tracking-widest mb-2">
          Stage {journeyStatus.stageCompleted + 1} of 3
        </p>
        <h2 className="text-2xl font-semibold text-white mb-1">
          {CRYSTAL_THEMES[selectedCrystal.id]}
        </h2>
        <p className="text-sm text-white/50">
          {selectedCrystal.meaning}
        </p>
      </div>
    );
  }

  // Selection mode - show path options
  return (
    <div style={{ padding: '24px 20px' }}>
      <p className="text-xs text-white/50 uppercase tracking-widest text-center mb-6">
        Choose your path
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
        }}
      >
        {CRYSTALS.map((crystal) => {
          const slotState = getCrystalSlotState(crystal.id, journeyStatus);
          const isLocked = slotState === 'locked';
          const isMastered = slotState === 'mastered';

          return (
            <button
              key={crystal.id}
              onClick={() => !isLocked && !isMastered && onSelectCrystal(crystal.id)}
              disabled={isLocked || isMastered}
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: isMastered
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: isMastered
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                opacity: isLocked ? 0.4 : 1,
                cursor: isLocked || isMastered ? 'not-allowed' : 'pointer',
                textAlign: 'left',
              }}
            >
              <p className={`text-sm font-medium ${isMastered ? 'text-emerald-400' : 'text-white'}`}>
                {CRYSTAL_THEMES[crystal.id]}
              </p>
              <p className="text-xs text-white/50 mt-1">
                {crystal.meaning}
              </p>
              {isMastered && (
                <p className="text-xs text-emerald-400/70 mt-2">✓ Mastered</p>
              )}
              {isLocked && (
                <p className="text-xs text-white/30 mt-2">🔒 Locked</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default JourneyCarousel;
