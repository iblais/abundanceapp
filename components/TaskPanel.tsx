/**
 * TaskPanel - Hero's Journey Task Completion UI
 *
 * Displays the current task for an active journey and allows
 * the user to mark it as complete, advancing the progression.
 *
 * ANIMATION: Panel slides up from below when entering active mode.
 * This creates spatial continuity with the selected geode above.
 */

import React from 'react';
import { JourneyStatus } from '../src/types/journey';
import { CRYSTALS, getCrystalById, getCurrentTask } from './AbundanceComponents';

// Slide-up animation CSS (injected inline for component encapsulation)
const slideUpKeyframes = `
  @keyframes slideUpFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Checkmark icon
const CheckIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Sparkle icon for completion
const SparkleIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
  </svg>
);

interface TaskPanelProps {
  journeyStatus: JourneyStatus;
  onCompleteTask: () => void;
  onStartNewJourney: () => void;
}

export const TaskPanel: React.FC<TaskPanelProps> = ({
  journeyStatus,
  onCompleteTask,
  onStartNewJourney,
}) => {
  // Only show when in active mode with a selected crystal
  if (journeyStatus.mode !== 'active' || !journeyStatus.selectedCrystalId) {
    // Show completion celebration in complete mode
    if (journeyStatus.mode === 'complete' && journeyStatus.selectedCrystalId) {
      const crystal = getCrystalById(journeyStatus.selectedCrystalId);
      if (!crystal) return null;

      return (
        <>
          <style>{slideUpKeyframes}</style>
          <div
            className="w-full px-4 py-6"
            style={{
              animation: 'slideUpFadeIn 0.3s ease-out forwards',
            }}
          >
            <div
              className="rounded-2xl p-6 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle, ${crystal.glowColor}40 0%, transparent 70%)`,
                }}
              >
                <SparkleIcon className="text-emerald-400" />
              </div>
            </div>

            <h3 className="text-lg font-medium text-white mb-2">
              {crystal.name} Mastered!
            </h3>

            <p className="text-sm text-white/60 mb-6">
              You have unlocked the wisdom of {crystal.meaning.toLowerCase()}.
            </p>

            <button
              onClick={onStartNewJourney}
              className="w-full py-3 px-6 rounded-full text-sm font-medium uppercase tracking-wider transition-all active:scale-95"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
              }}
            >
              Choose Next Path
            </button>
            </div>
          </div>
        </>
      );
    }

    return null;
  }

  const crystal = getCrystalById(journeyStatus.selectedCrystalId);
  if (!crystal) return null;

  const currentTask = getCurrentTask(journeyStatus.selectedCrystalId, journeyStatus.stageCompleted);
  const currentStage = journeyStatus.stageCompleted + 1;

  return (
    <>
      <style>{slideUpKeyframes}</style>
      <div
        className="w-full px-4 py-4"
        style={{
          animation: 'slideUpFadeIn 0.3s ease-out forwards',
        }}
      >
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
        {/* Header with crystal info and stage progress */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle, ${crystal.glowColor}30 0%, transparent 70%)`,
              }}
            >
              <img
                src="/images/geode-closed.png"
                alt={crystal.name}
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider">
                {crystal.meaning}
              </p>
            </div>
          </div>

          {/* Stage indicator */}
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((stage) => (
              <div
                key={stage}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  backgroundColor: stage <= journeyStatus.stageCompleted
                    ? crystal.glowColor
                    : stage === currentStage
                    ? `${crystal.glowColor}80`
                    : 'rgba(255, 255, 255, 0.2)',
                  boxShadow: stage <= journeyStatus.stageCompleted
                    ? `0 0 8px ${crystal.glowColor}`
                    : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Task content */}
        <div className="mb-5">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
            Stage {currentStage} of 3
          </p>
          <p className="text-sm text-white/90 leading-relaxed">
            {currentTask}
          </p>
        </div>

        {/* Complete button */}
        <button
          onClick={onCompleteTask}
          className="w-full py-3 px-6 rounded-full text-sm font-medium uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${crystal.glowColor} 0%, ${crystal.glowColor}CC 100%)`,
            color: 'black',
            boxShadow: `0 4px 20px ${crystal.glowColor}40`,
          }}
        >
          <CheckIcon className="text-black" />
          Mark Complete
        </button>
        </div>
      </div>
    </>
  );
};

export default TaskPanel;
