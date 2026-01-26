import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, Hammer, Check } from 'lucide-react';

// --- Types ---
export interface Crystal {
  id: string;
  name: string;
  image: string;
  meaning: string;
  color: string;
  glow: string;
  shadow: string;
  crackColor: string;
  recodeTitle: string;
  recodeTask: string;
}

export const CRYSTALS: Crystal[] = [
  {
    id: 'citrine',
    name: 'CITRINE',
    image: '/images/gem-citrine.png',
    meaning: 'Wealth • Abundance',
    color: 'text-yellow-200',
    glow: 'bg-yellow-500/20',
    shadow: 'drop-shadow-[0_0_60px_rgba(234,179,8,0.6)]',
    crackColor: 'mix-blend-color-dodge brightness-150 sepia-100 hue-rotate-[40deg] saturate-200',
    recodeTitle: 'The Recode: Release Guilt',
    recodeTask: "Today, make one purchase solely for your own joy. Notice if guilt arises, and consciously replace it with gratitude. You cannot receive what you feel guilty for holding."
  },
  {
    id: 'rose-quartz',
    name: 'ROSE QUARTZ',
    image: '/images/gem-rose-quartz.png',
    meaning: 'Love • Connection',
    color: 'text-pink-200',
    glow: 'bg-pink-500/20',
    shadow: 'drop-shadow-[0_0_60px_rgba(244,114,182,0.6)]',
    crackColor: 'mix-blend-color-dodge brightness-125 sepia-0 hue-rotate-[320deg] saturate-150',
    recodeTitle: 'The Recode: Dissolve Defense',
    recodeTask: "Identify one moment today where you feel the urge to withdraw. Instead, lean in. Share the vulnerable truth you are afraid to speak."
  },
  {
    id: 'emerald',
    name: 'EMERALD',
    image: '/images/gem-emerald.png',
    meaning: 'Health • Vitality',
    color: 'text-emerald-200',
    glow: 'bg-emerald-500/20',
    shadow: 'drop-shadow-[0_0_60px_rgba(16,185,129,0.6)]',
    crackColor: 'mix-blend-color-dodge brightness-150 sepia-0 hue-rotate-[120deg] saturate-200',
    recodeTitle: 'The Recode: Honor the Vessel',
    recodeTask: "Treat your body with radical reverence today. Choose one meal to eat in complete silence. Taste every bite. Listen to your satiety signals."
  },
  {
    id: 'amethyst',
    name: 'AMETHYST',
    image: '/images/gem-amethyst.png',
    meaning: 'Peace • Intuition',
    color: 'text-purple-200',
    glow: 'bg-purple-600/20',
    shadow: 'drop-shadow-[0_0_60px_rgba(168,85,247,0.6)]',
    crackColor: 'mix-blend-color-dodge brightness-150 sepia-0 hue-rotate-[260deg] saturate-200',
    recodeTitle: 'The Recode: Silence the Noise',
    recodeTask: "Commit to a 'Input Fast' for the next hour. No phone, no music. Just you and the raw data of your immediate reality."
  },
  {
    id: 'ruby',
    name: 'RUBY',
    image: '/images/gem-ruby.png',
    meaning: 'Passion • Drive',
    color: 'text-red-200',
    glow: 'bg-red-600/20',
    shadow: 'drop-shadow-[0_0_60px_rgba(220,38,38,0.6)]',
    crackColor: 'mix-blend-color-dodge brightness-150 sepia-0 hue-rotate-[340deg] saturate-200',
    recodeTitle: 'The Recode: Ignite Action',
    recodeTask: "Do the thing you have been procrastinating within the next 10 minutes. Do not plan it. Do it badly if you must, but do it now."
  },
  {
    id: 'sapphire',
    name: 'SAPPHIRE',
    image: '/images/gem-sapphire.png',
    meaning: 'Wisdom • Truth',
    color: 'text-blue-300',
    glow: 'bg-blue-600/20',
    shadow: 'drop-shadow-[0_0_60px_rgba(37,99,235,0.6)]',
    crackColor: 'mix-blend-color-dodge brightness-150 sepia-0 hue-rotate-[220deg] saturate-200',
    recodeTitle: 'The Recode: Radical Honesty',
    recodeTask: "Catch yourself in a 'white lie' today. Stop. Correct the record immediately. Reclaim the energy you were about to spend on maintaining a facade."
  },
  {
    id: 'obsidian',
    name: 'OBSIDIAN',
    image: '/images/gem-obsidian.png',
    meaning: 'Protection • Grounding',
    color: 'text-gray-200',
    glow: 'bg-gray-600/20',
    shadow: 'drop-shadow-[0_0_60px_rgba(75,85,99,0.6)]',
    crackColor: 'mix-blend-overlay brightness-50',
    recodeTitle: 'The Recode: Sovereign Boundaries',
    recodeTask: "Identify one drain on your energy that you have been tolerating. Say 'No' to it today. Do not explain. Do not apologize."
  },
  {
    id: 'clear-quartz',
    name: 'CLEAR QUARTZ',
    image: '/images/gem-clear-quartz.png',
    meaning: 'Focus • Amplification',
    color: 'text-blue-100',
    glow: 'bg-blue-400/20',
    shadow: 'drop-shadow-[0_0_60px_rgba(147,197,253,0.6)]',
    crackColor: 'mix-blend-overlay brightness-200',
    recodeTitle: 'The Recode: The Single Point',
    recodeTask: "Multitasking is the enemy. Choose your 'One Thing' for today. Pour 100% of your focus into it until it is complete."
  }
];

// --- Components ---

// 1. Crown of Abundance (Top Bar) - STRICTLY 32px
export const CrownOfAbundance: React.FC<{ collectedIds: string[] }> = ({ collectedIds }) => {
  return (
    <div className="flex items-center justify-center gap-3 py-4 px-6 bg-black/40 backdrop-blur-md border-b border-white/5 w-full overflow-x-auto">
      {CRYSTALS.map((crystal) => {
        const isCollected = collectedIds.includes(crystal.id);
        return (
          <div key={crystal.id} className="relative group flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isCollected ? 'opacity-100 scale-100' : 'opacity-30 scale-90 grayscale'}`}>
              <img
                src={crystal.image}
                alt={crystal.name}
                className="w-8 h-8 object-contain drop-shadow-md"
                style={{ maxWidth: '32px', maxHeight: '32px' }}
              />
            </div>
            {!isCollected && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-3 h-3 text-white/50" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// 2. Journey Carousel (The Hero's Path)
interface JourneyCarouselProps {
  progress: {
    journeyStatus: 'SELECTING' | 'IN_PROGRESS' | 'ALL_MASTERED';
    activeGeodeId: string | null;
    masteredGeodeIds: string[];
    currentCrackLevel: number;
  };
  onSelectGeode: (crystal: Crystal) => void;
  onContinueJourney: (crystal: Crystal) => void;
}

export const JourneyCarousel: React.FC<JourneyCarouselProps> = ({
  progress,
  onSelectGeode,
  onContinueJourney
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const width = containerRef.current.offsetWidth;
      const itemWidth = width * 0.5;
      const index = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(Math.max(index, 0), CRYSTALS.length - 1));
    }
  };

  const getSlotState = (crystalId: string) => {
    if (progress.masteredGeodeIds.includes(crystalId)) return 'MASTERED';
    if (progress.activeGeodeId === crystalId) return 'ACTIVE';
    if (progress.journeyStatus === 'IN_PROGRESS') return 'LOCKED';
    return 'AVAILABLE';
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 3D Carousel Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory w-full py-12 px-[25%] no-scrollbar gap-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {CRYSTALS.map((crystal, index) => {
          const isActiveInCarousel = index === activeIndex;
          const slotState = getSlotState(crystal.id);

          // Visual Logic
          let scale = isActiveInCarousel ? 1.2 : 0.8;
          let opacity = isActiveInCarousel ? 1 : 0.5;
          let grayscale = isActiveInCarousel ? 0 : 1;

          // Image Logic
          let displayImage = '/images/geode-closed.png'; // Default Rock
          if (slotState === 'MASTERED') displayImage = crystal.image; // Revealed Gem

          const showCracks = slotState === 'ACTIVE' && progress.currentCrackLevel > 0;

          return (
            <div
              key={crystal.id}
              className="snap-center shrink-0 w-[50vw] max-w-[200px] flex flex-col items-center justify-center transition-all duration-500 relative"
              style={{
                transform: `scale(${scale}) translateY(${isActiveInCarousel ? '0' : '10px'})`,
                opacity,
                filter: `grayscale(${grayscale})`
              }}
              onClick={() => {
                if (slotState === 'AVAILABLE') onSelectGeode(crystal);
                if (slotState === 'ACTIVE') onContinueJourney(crystal);
              }}
            >
              {/* Status Indicators */}
              {slotState === 'LOCKED' && (
                <div className="absolute z-20 -top-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                  <Lock className="w-3 h-3 text-white/50" />
                  <span className="text-[10px] uppercase tracking-widest text-white/50">Locked</span>
                </div>
              )}

              {slotState === 'ACTIVE' && (
                <div className="absolute z-20 -top-8 animate-bounce">
                  <span className="text-[10px] uppercase tracking-widest text-yellow-400 font-bold drop-shadow-glow">
                    Current Path
                  </span>
                </div>
              )}

              {/* Main Image Container - CONSTRAINED SIZE */}
              <div className="relative w-32 h-32 mb-4">
                {/* Glow Effect */}
                {(slotState === 'ACTIVE' || slotState === 'MASTERED') && isActiveInCarousel && (
                  <div className={`absolute inset-0 ${crystal.glow} blur-2xl rounded-full animate-pulse`} />
                )}

                {/* Main Image */}
                <img
                  src={displayImage}
                  alt={crystal.name}
                  className="relative w-full h-full object-contain drop-shadow-2xl z-10"
                />

                {/* Crack Overlay */}
                {showCracks && (
                  <img
                    src={`/images/crack-stage-${progress.currentCrackLevel}.png`}
                    className="absolute inset-0 w-full h-full object-contain z-20 mix-blend-overlay opacity-80"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Area */}
      <div className="text-center mt-4 h-32 px-6">
        <h3 className="text-xl font-heading tracking-[0.2em] text-white uppercase mb-1">
          {CRYSTALS[activeIndex].name}
        </h3>

        <p className={`text-xs font-medium tracking-widest uppercase mb-6 ${CRYSTALS[activeIndex].color}`}>
          {getSlotState(CRYSTALS[activeIndex].id) === 'MASTERED'
            ? "Mastery Unlocked"
            : `The Path of ${CRYSTALS[activeIndex].meaning}`}
        </p>

        {/* Dynamic Button */}
        {getSlotState(CRYSTALS[activeIndex].id) === 'AVAILABLE' && (
          <button
            onClick={() => onSelectGeode(CRYSTALS[activeIndex])}
            className="w-full max-w-xs py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-transform"
          >
            Begin This Journey
          </button>
        )}

        {getSlotState(CRYSTALS[activeIndex].id) === 'ACTIVE' && (
          <button
            onClick={() => onContinueJourney(CRYSTALS[activeIndex])}
            className="w-full max-w-xs py-4 bg-gradient-to-r from-yellow-200 to-yellow-500 text-black font-bold uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-transform animate-pulse"
          >
            <span className="flex items-center justify-center gap-2">
              <Hammer className="w-4 h-4" />
              Crack Geode
            </span>
          </button>
        )}

        {getSlotState(CRYSTALS[activeIndex].id) === 'LOCKED' && (
          <div className="text-white/30 text-xs uppercase tracking-widest">
            Complete your current path to unlock
          </div>
        )}

        {getSlotState(CRYSTALS[activeIndex].id) === 'MASTERED' && (
          <button
            className="w-full max-w-xs py-4 bg-white/10 border border-white/20 text-white font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white/20 transition-colors"
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Deepen Practice
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
