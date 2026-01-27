/**
 * JourneyCarousel - Hero's Journey Crystal Selection Carousel
 *
 * Visual specifications (Opal-style, mobile-first):
 * - Active/center geode: w-32 h-32 (128px)
 * - Side geodes: w-16 h-16 (64px)
 * - Container: max-h-[220px], vertically centered
 * - Snap: scroll-snap-type: x mandatory, items use snap-center
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
    <div className="relative w-full overflow-hidden max-h-[220px] py-3">
      {/* Status Header */}
      <div className="text-center mb-2 px-6">
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

      {/* Carousel Container - fixed height, horizontal scroll */}
      <div
        ref={containerRef}
        className="flex items-center justify-start gap-2 overflow-x-auto px-[50%] h-[150px]"
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
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
              className="snap-center flex-shrink-0 flex flex-col items-center justify-center"
              onClick={() => handleItemClick(crystal.id, slotState)}
            >
              {/* Geode Container - EXACT SIZE CONSTRAINTS */}
              <div
                className={`
                  relative flex items-center justify-center
                  transition-all duration-300 ease-out
                  ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
                  ${isCenter
                    ? 'w-32 h-32 max-w-[128px] max-h-[128px] opacity-100 z-20'
                    : 'w-16 h-16 max-w-[64px] max-h-[64px] opacity-50 z-10'
                  }
                `}
              >
                {/* Geode Image */}
                <img
                  src={geodeImage}
                  alt={`${crystal.name} Geode`}
                  className={`
                    w-full h-full object-contain
                    transition-all duration-300
                    ${isLocked ? 'opacity-40' : ''}
                    ${isMastered && !isCenter ? 'opacity-30' : ''}
                  `}
                  draggable={false}
                />

                {/* Lock Overlay */}
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center z-30">
                    <div className="bg-black/60 rounded-full p-1">
                      <LockIcon className="text-white/70" />
                    </div>
                  </div>
                )}

                {/* Mastered indicator */}
                {isMastered && isCenter && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-30 bg-emerald-500/80 text-white text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap">
                    Mastered
                  </div>
                )}

                {/* Active indicator */}
                {isSelected && journeyStatus.mode === 'active' && isCenter && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 bg-yellow-500/90 text-black text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    Active
                  </div>
                )}
              </div>

              {/* Theme Label - only for center item */}
              {isCenter && (
                <div className={`
                  mt-2 text-center transition-opacity duration-300 whitespace-nowrap
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

      {/* Selection hint */}
      {journeyStatus.mode === 'selection' && (
        <div className="text-center mt-1">
          <p className="text-[10px] text-white/30">Scroll to browse • Tap to begin</p>
        </div>
      )}
    </div>
  );
};

export default JourneyCarousel;
