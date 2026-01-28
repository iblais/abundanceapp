/**
 * JourneyCarousel - Hero's Journey Crystal Selection Carousel
 *
 * CRITICAL FIX: In active mode, the selected geode is rendered in a FIXED
 * center position (not scroll-dependent) to guarantee visibility.
 *
 * MODES:
 * - Selection mode: Horizontal scroll carousel, all geodes browsable
 * - Active mode: Selected geode fixed in center (hero), others dimmed on sides
 *
 * SIZING:
 * - Unselected: 80px (72-88px range)
 * - Selected hero: 156px (140-160px range)
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CRYSTALS } from './AbundanceComponents';
import { JourneyStatus, CrystalSlotState, getCrystalSlotState } from '../src/types/journey';

// Sizing constants
const GEODE_SIZE = {
  UNSELECTED: 80,
  SELECTED: 156,
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

  // Compute active index based on scroll position (selection mode only)
  const handleScroll = useCallback(() => {
    if (!containerRef.current || journeyStatus.mode !== 'selection') return;

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
  }, [journeyStatus.mode]);

  // Set up scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (container && journeyStatus.mode === 'selection') {
      container.addEventListener('scroll', handleScroll, { passive: true });
      setTimeout(handleScroll, 50);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, journeyStatus.mode]);

  // Handle item click
  const handleItemClick = (crystalId: string, slotState: CrystalSlotState) => {
    if (slotState === 'available') {
      onSelectCrystal(crystalId);
    }
  };

  // Get selected crystal data for active mode
  const selectedCrystal = journeyStatus.selectedCrystalId
    ? CRYSTALS.find(c => c.id === journeyStatus.selectedCrystalId)
    : null;

  // Determine if we're in active/complete mode (show hero geode layout)
  const isHeroMode = journeyStatus.mode === 'active' || journeyStatus.mode === 'complete';

  return (
    <>
      <style>{`
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes geode-appear {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <section
        style={{
          position: isHeroMode ? 'sticky' : 'relative',
          top: isHeroMode ? '0' : undefined,
          width: '100%',
          height: '280px',
          overflow: 'hidden',
          backgroundColor: '#000', // Prevent content showing through
          zIndex: isHeroMode ? 20 : 1,
        }}
      >
        {/* Status Header */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
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
              Stage {journeyStatus.stageCompleted + 1} of 3
            </p>
          )}
          {journeyStatus.mode === 'complete' && (
            <p className="text-xs text-emerald-400/80 uppercase tracking-widest">
              Journey Complete
            </p>
          )}
        </div>

        {/* ACTIVE/COMPLETE MODE: Fixed hero geode layout */}
        {isHeroMode && selectedCrystal && (
          <div
            style={{
              position: 'absolute',
              top: '40px',
              left: 0,
              right: 0,
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
            }}
          >
            {/* Left side geodes (dimmed, small) */}
            <div style={{ display: 'flex', gap: '8px', opacity: 0.3 }}>
              {CRYSTALS.slice(0, 2).map((crystal) => {
                if (crystal.id === selectedCrystal.id) return null;
                const slotState = getCrystalSlotState(crystal.id, journeyStatus);
                return (
                  <div
                    key={crystal.id}
                    style={{
                      width: '48px',
                      height: '48px',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={slotState === 'mastered' ? crystal.image : '/images/geode-closed.png'}
                      alt={crystal.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                    {slotState === 'locked' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <LockIcon className="text-white/50" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CENTER: Selected Hero Geode - ALWAYS VISIBLE */}
            <div
              style={{
                width: `${GEODE_SIZE.CENTER_SELECTION}px`,
                height: `${GEODE_SIZE.CENTER_SELECTION}px`,
                position: 'relative',
                animation: 'geode-appear 0.3s ease-out forwards',
              }}
            >
              {/* Glow effect */}
              {journeyStatus.stageCompleted > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    height: '80%',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${selectedCrystal.glowColor}60 0%, ${selectedCrystal.glowColor}20 50%, transparent 70%)`,
                    filter: 'blur(12px)',
                    animation: 'glow-pulse 2s ease-in-out infinite',
                  }}
                />
              )}

              {/* Geode Image */}
              <img
                src={
                  getCrystalSlotState(selectedCrystal.id, journeyStatus) === 'mastered'
                    ? selectedCrystal.image
                    : getGeodeImage(journeyStatus.stageCompleted)
                }
                alt={selectedCrystal.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 1,
                }}
              />
            </div>

            {/* Right side geodes (dimmed, small) */}
            <div style={{ display: 'flex', gap: '8px', opacity: 0.3 }}>
              {CRYSTALS.slice(-2).map((crystal) => {
                if (crystal.id === selectedCrystal.id) return null;
                const slotState = getCrystalSlotState(crystal.id, journeyStatus);
                return (
                  <div
                    key={crystal.id}
                    style={{
                      width: '48px',
                      height: '48px',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={slotState === 'mastered' ? crystal.image : '/images/geode-closed.png'}
                      alt={crystal.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                    {slotState === 'locked' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <LockIcon className="text-white/50" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SELECTION MODE: Scrollable Carousel */}
        {journeyStatus.mode === 'selection' && (
          <div
            ref={containerRef}
            style={{
              position: 'absolute',
              top: '40px',
              left: 0,
              right: 0,
              height: '180px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '12px',
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              paddingLeft: 'calc(50% - 60px)',
              paddingRight: 'calc(50% - 60px)',
            }}
          >
            {CRYSTALS.map((crystal, index) => {
              const slotState = getCrystalSlotState(crystal.id, journeyStatus);
              const isCenter = index === activeIndex;
              const isLocked = slotState === 'locked';
              const isMastered = slotState === 'mastered';

              const size = isCenter ? GEODE_SIZE.CENTER_SELECTION : GEODE_SIZE.UNSELECTED;

              return (
                <div
                  key={crystal.id}
                  ref={(el) => { itemRefs.current[index] = el; }}
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
                    opacity: isCenter ? 1 : 0.5,
                    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onClick={() => handleItemClick(crystal.id, slotState)}
                >
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    {/* Mastered glow */}
                    {isMastered && isCenter && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '80%',
                          height: '80%',
                          borderRadius: '50%',
                          background: `radial-gradient(circle, ${crystal.glowColor}60 0%, transparent 70%)`,
                          filter: 'blur(12px)',
                        }}
                      />
                    )}

                    <img
                      src={isMastered ? crystal.image : '/images/geode-closed.png'}
                      alt={crystal.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        opacity: isLocked ? 0.4 : 1,
                      }}
                      draggable={false}
                    />

                    {/* Lock overlay */}
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/60 rounded-full p-1">
                          <LockIcon className="text-white/70" />
                        </div>
                      </div>
                    )}

                    {/* Mastered checkmark */}
                    {isMastered && isCenter && (
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
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Theme Label */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          {(() => {
            const displayCrystalId = isHeroMode
              ? journeyStatus.selectedCrystalId
              : CRYSTALS[activeIndex]?.id;

            if (!displayCrystalId) return null;

            const displayState = getCrystalSlotState(displayCrystalId, journeyStatus);

            return (
              <p className={`
                text-sm font-medium uppercase tracking-wider
                ${displayState === 'mastered' ? 'text-emerald-400' :
                  displayState === 'active' ? 'text-yellow-400' : 'text-white/80'}
              `}>
                {CRYSTAL_THEMES[displayCrystalId] || ''}
              </p>
            );
          })()}
        </div>

        {/* Selection hint */}
        {journeyStatus.mode === 'selection' && (
          <div
            style={{
              position: 'absolute',
              bottom: '-4px',
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
