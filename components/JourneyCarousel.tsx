/**
 * JourneyCarousel - Hero's Journey Crystal Selection Carousel
 *
 * POSITIONING RULES (NON-NEGOTIABLE):
 * - Hero section: position: relative, height: 320px (selection) or auto (active), overflow: hidden
 * - Carousel: HORIZONTAL ONLY, flex-direction: row
 * - All geodes on SAME Y centerline (horizontal only)
 * - NO vertical stacking, NO flex-col, NO translateY
 * - Selected geode becomes hero (140-160px), others shrink to 72-88px
 * - Geodes MUST disappear at hero boundary
 *
 * SELECTION BEHAVIOR:
 * - On selection: selected geode animates to hero size (156px)
 * - Other geodes shrink to unselected size (80px)
 * - TaskPanel appears below - NO route navigation
 * - Selected geode stays visible as anchor
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CRYSTALS } from './AbundanceComponents';
import { JourneyStatus, CrystalSlotState, getCrystalSlotState } from '../src/types/journey';

// Sizing constants - responsive
const GEODE_SIZE = {
  // Unselected geode size: 72-88px range, using 80px as default
  UNSELECTED: 80,
  UNSELECTED_MIN: 72,
  UNSELECTED_MAX: 88,
  // Selected hero geode size: 140-160px range, using 156px as default
  SELECTED: 156,
  SELECTED_MIN: 140,
  SELECTED_MAX: 160,
  // Center geode in selection mode (slightly larger for focus)
  CENTER_SELECTION: 120,
};

// Lock icon SVG component
const LockIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={className}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

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

// Get geode image based on stage
function getGeodeImage(stageCompleted: number): string {
  switch (stageCompleted) {
    case 0: return '/images/geode-closed.png';
    case 1: return '/images/geode-cracked-1.png';
    case 2: return '/images/geode-cracked-2.png';
    default: return '/images/geode-closed.png';
  }
}

interface JourneyCarouselProps {
  journeyStatus: JourneyStatus;
  onSelectCrystal: (crystalId: string) => void;
}

export const JourneyCarousel: React.FC<JourneyCarouselProps> = ({
  journeyStatus,
  onSelectCrystal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, CRYSTALS.length);
  }, []);

  // When a crystal is selected, smoothly scroll to center it and update activeIndex
  // Uses scrollIntoView with inline: 'center' to avoid vertical page jumps
  useEffect(() => {
    if ((journeyStatus.mode === 'active' || journeyStatus.mode === 'complete') && journeyStatus.selectedCrystalId) {
      const selectedIndex = CRYSTALS.findIndex(c => c.id === journeyStatus.selectedCrystalId);
      if (selectedIndex !== -1) {
        setActiveIndex(selectedIndex);
        // Smooth scroll to center the selected geode within the carousel
        const selectedItem = itemRefs.current[selectedIndex];
        if (selectedItem && containerRef.current) {
          // Use setTimeout to ensure DOM has updated with new sizes first
          setTimeout(() => {
            selectedItem.scrollIntoView({
              behavior: 'smooth',
              inline: 'center',
              block: 'nearest', // Prevents vertical page jump
            });
          }, 50);
        }
      }
    }
  }, [journeyStatus.mode, journeyStatus.selectedCrystalId]);

  // Compute active index based on scroll position
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerCenter = container.scrollLeft + container.offsetWidth / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    itemRefs.current.forEach((item, index) => {
      if (item) {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const distance = Math.abs(containerCenter - itemCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  // Set up scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      setTimeout(handleScroll, 50);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Handle item click
  const handleItemClick = (crystalId: string, slotState: CrystalSlotState) => {
    if (slotState === 'available') {
      onSelectCrystal(crystalId);
    }
  };

  return (
    // HERO SECTION - Positioning context with fixed height
    // This is the ONLY element that occupies document flow
    <>
      <style>{`
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '320px',
        overflow: 'hidden',
      }}
    >
      {/* Status Header - absolute, top of hero */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        {journeyStatus.mode === 'selection' && journeyStatus.completedCrystalIds.length === 0 && (
          <p className="text-xs text-white/50 uppercase tracking-widest">Choose your path</p>
        )}
        {journeyStatus.mode === 'selection' && journeyStatus.completedCrystalIds.length > 0 && (
          <p className="text-xs text-emerald-400/80 uppercase tracking-widest">
            {journeyStatus.completedCrystalIds.length} / 8 Mastered
          </p>
        )}
        {journeyStatus.mode === 'active' && (
          <p className="text-xs text-yellow-400/80 uppercase tracking-widest">
            Stage {journeyStatus.stageCompleted} / 3
          </p>
        )}
        {journeyStatus.mode === 'complete' && (
          <p className="text-xs text-emerald-400/80 uppercase tracking-widest">
            Journey Complete - Choose Next Path
          </p>
        )}
      </div>

      {/* Carousel Container - ABSOLUTE, does NOT occupy document flow */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: '40px',
          left: 0,
          right: 0,
          height: '220px',
          display: 'flex',
          flexDirection: 'row', // HORIZONTAL ONLY
          alignItems: 'center', // All geodes on same Y centerline
          gap: '12px',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          // Padding centers the hero geode (half of max hero size 156px = 78px)
          paddingLeft: 'calc(50% - 78px)',
          paddingRight: 'calc(50% - 78px)',
        }}
      >
        {CRYSTALS.map((crystal, index) => {
          const slotState = getCrystalSlotState(crystal.id, journeyStatus);
          const isCenter = index === activeIndex;
          const isSelected = journeyStatus.selectedCrystalId === crystal.id;
          const isLocked = slotState === 'locked';
          const isMastered = slotState === 'mastered';
          const isActive = slotState === 'active';

          // Determine display image
          // - Mastered: show revealed crystal
          // - Active with cracks: show cracked geode
          // - Default: closed geode
          let displayImage = '/images/geode-closed.png';
          if (isMastered) {
            displayImage = crystal.image; // Revealed crystal
          } else if (isActive && journeyStatus.stageCompleted > 0) {
            displayImage = getGeodeImage(journeyStatus.stageCompleted);
          }

          // Show glow for active geodes with cracks (always show when selected, not just when centered)
          const showGlow = isActive && journeyStatus.stageCompleted > 0;

          // Size logic:
          // - In selection mode: center geode is larger (120px), others are 80px
          // - In active/complete mode: selected geode is hero (156px), others are 80px
          let size: number;
          if (journeyStatus.mode === 'selection') {
            // Selection mode: center scroll position determines larger size
            size = isCenter ? GEODE_SIZE.CENTER_SELECTION : GEODE_SIZE.UNSELECTED;
          } else {
            // Active/complete mode: selected crystal is the hero
            size = isSelected ? GEODE_SIZE.SELECTED : GEODE_SIZE.UNSELECTED;
          }

          return (
            <div
              key={crystal.id}
              ref={(el) => { itemRefs.current[index] = el; }}
              tabIndex={-1}
              style={{
                scrollSnapAlign: 'center',
                flexShrink: 0,
                width: `${size}px`,
                minWidth: `${size}px`,
                height: `${size}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                // Opacity logic:
                // - Selection mode: center is bright, others dimmed
                // - Active mode: selected is bright, locked are very dimmed, mastered slightly dimmed
                opacity: journeyStatus.mode === 'selection'
                  ? (isCenter ? 1 : 0.5)
                  : (isSelected ? 1 : (isMastered ? 0.7 : (isLocked ? 0.35 : 0.6))),
                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none',
              }}
              onClick={() => handleItemClick(crystal.id, slotState)}
            >
              {/* Geode/Crystal Image - contained within fixed-size box */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                }}
              >
                {/* Inner glow effect for cracked geodes */}
                {showGlow && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '60%',
                      height: '60%',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${crystal.glowColor}80 0%, ${crystal.glowColor}40 40%, transparent 70%)`,
                      filter: 'blur(8px)',
                      animation: 'glow-pulse 2s ease-in-out infinite',
                    }}
                  />
                )}

                {/* Mastered glow effect - show when mastered and either centered (selection) or selected (active/complete) */}
                {isMastered && (isCenter || isSelected) && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '80%',
                      height: '80%',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${crystal.glowColor}60 0%, ${crystal.glowColor}20 50%, transparent 70%)`,
                      filter: 'blur(12px)',
                    }}
                  />
                )}

                <img
                  src={displayImage}
                  alt={isMastered ? crystal.name : `${crystal.name} Geode`}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    // Image opacity: locked is dim, mastered not focused is slightly dim, otherwise full
                    opacity: isLocked
                      ? 0.4
                      : (isMastered && !isCenter && !isSelected)
                        ? 0.6
                        : 1,
                    zIndex: 1,
                  }}
                  draggable={false}
                />

                {/* Lock Overlay */}
                {isLocked && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                    }}
                  >
                    <div className="bg-black/60 rounded-full p-1">
                      <LockIcon className="text-white/70" />
                    </div>
                  </div>
                )}

                {/* Mastered checkmark - show when mastered and either centered or selected */}
                {isMastered && (isCenter || isSelected) && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '4px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Theme Label - absolute, below carousel */}
      {/* In selection mode: show theme of centered geode
          In active/complete mode: show theme of selected geode */}
      <div
        style={{
          position: 'absolute',
          bottom: '35px',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        {(() => {
          // Determine which crystal's theme to display
          const displayCrystalId = journeyStatus.mode === 'selection'
            ? CRYSTALS[activeIndex]?.id
            : journeyStatus.selectedCrystalId;
          const displayCrystalState = displayCrystalId
            ? getCrystalSlotState(displayCrystalId, journeyStatus)
            : null;

          return (
            <p className={`
              text-xs font-medium uppercase tracking-wider
              ${displayCrystalState === 'mastered'
                ? 'text-emerald-400'
                : displayCrystalState === 'active'
                  ? 'text-yellow-400/90'
                  : 'text-white/80'}
            `}>
              {displayCrystalId ? CRYSTAL_THEMES[displayCrystalId] : ''}
            </p>
          );
        })()}
      </div>

      {/* Selection hint - absolute, bottom of hero */}
      {journeyStatus.mode === 'selection' && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <p className="text-[10px] text-white/30">Scroll to browse • Tap to begin</p>
        </div>
      )}
    </section>
    </>
  );
};

export default JourneyCarousel;
