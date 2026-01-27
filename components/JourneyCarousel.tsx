/**
 * JourneyCarousel - Hero's Journey Crystal Selection Carousel
 *
 * CONTAINMENT RULES:
 * - Self-contained hero section with fixed height (280px mobile)
 * - position: relative with overflow: hidden
 * - Carousel lives ENTIRELY inside hero section
 * - Nothing leaks below the hero boundary
 * - Proper z-index layering
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CRYSTALS } from './AbundanceComponents';
import { JourneyStatus, CrystalSlotState, getCrystalSlotState } from '../src/types/journey';

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

  // Scroll to selected crystal when in active mode
  useEffect(() => {
    if (journeyStatus.mode === 'active' && journeyStatus.selectedCrystalId) {
      const selectedIndex = CRYSTALS.findIndex(c => c.id === journeyStatus.selectedCrystalId);
      if (selectedIndex !== -1 && containerRef.current) {
        const container = containerRef.current;
        const item = itemRefs.current[selectedIndex];
        if (item) {
          const containerCenter = container.offsetWidth / 2;
          const itemCenter = item.offsetLeft + item.offsetWidth / 2;
          const scrollTo = itemCenter - containerCenter;
          container.scrollTo({ left: scrollTo, behavior: 'smooth' });
          setActiveIndex(selectedIndex);
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
    // HERO SECTION - Self-contained with fixed height and overflow hidden
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: '220px',
        minHeight: '220px',
        maxHeight: '220px',
      }}
    >
      {/* Status Header - positioned at top of hero */}
      <div className="absolute top-0 left-0 right-0 text-center py-3 px-6 z-10">
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

      {/* Carousel Container - centered vertically in hero */}
      <div
        ref={containerRef}
        className="absolute left-0 right-0 flex flex-row items-center gap-2 overflow-x-scroll overflow-y-hidden"
        style={{
          top: '40px',
          height: '150px',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          paddingLeft: 'calc(50% - 64px)',
          paddingRight: 'calc(50% - 64px)',
        }}
      >
        {CRYSTALS.map((crystal, index) => {
          const slotState = getCrystalSlotState(crystal.id, journeyStatus);
          const isCenter = index === activeIndex;
          const isSelected = journeyStatus.selectedCrystalId === crystal.id;
          const isLocked = slotState === 'locked';
          const isMastered = slotState === 'mastered';

          // Determine geode image
          let geodeImage = '/images/geode-closed.png';
          if (isSelected && journeyStatus.mode === 'active') {
            geodeImage = getGeodeImage(journeyStatus.stageCompleted);
          }

          return (
            <div
              key={crystal.id}
              ref={(el) => { itemRefs.current[index] = el; }}
              className="snap-center flex-shrink-0 flex flex-col items-center"
              style={{
                width: isCenter ? '128px' : '64px',
                minWidth: isCenter ? '128px' : '64px',
              }}
              onClick={() => handleItemClick(crystal.id, slotState)}
            >
              {/* Geode Container - FIXED SIZE with overflow-hidden */}
              <div
                className={`
                  relative overflow-hidden
                  transition-all duration-300 ease-out
                  ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
                style={{
                  width: isCenter ? '128px' : '64px',
                  height: isCenter ? '128px' : '64px',
                  maxWidth: isCenter ? '128px' : '64px',
                  maxHeight: isCenter ? '128px' : '64px',
                  opacity: isCenter ? 1 : 0.5,
                }}
              >
                {/* Geode Image */}
                <img
                  src={geodeImage}
                  alt={`${crystal.name} Geode`}
                  className="w-full h-full object-contain"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    opacity: isLocked ? 0.4 : (isMastered && !isCenter ? 0.3 : 1),
                  }}
                  draggable={false}
                />

                {/* Lock Overlay */}
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/60 rounded-full p-1">
                      <LockIcon className="text-white/70" />
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Label - only for center item */}
              {isCenter && (
                <div className={`
                  mt-1 text-center whitespace-nowrap
                  ${isLocked ? 'opacity-40' : 'opacity-100'}
                `}>
                  <p className={`
                    text-xs font-medium uppercase tracking-wider
                    ${isMastered ? 'text-emerald-400' : 'text-white/80'}
                  `}>
                    {CRYSTAL_THEMES[crystal.id] || crystal.meaning.split('•')[0].trim()}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selection hint - positioned at bottom of hero */}
      {journeyStatus.mode === 'selection' && (
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <p className="text-[10px] text-white/30">Scroll to browse • Tap to begin</p>
        </div>
      )}
    </section>
  );
};

export default JourneyCarousel;
