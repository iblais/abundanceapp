import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { Check, Lock, Sparkles, Hammer } from 'lucide-react';
import { UserProgress, GeodeState, CrystalTask } from '../src/types/journey';

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
  tasks: CrystalTask[];
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
    recodeTask: "Today, make one purchase solely for your own joy. Notice if guilt arises, and consciously replace it with gratitude. You cannot receive what you feel guilty for holding.",
    tasks: [
      { stage: 1, text: "The Audit: Check your bank balance without judgment. Just observe." },
      { stage: 2, text: "The Release: Buy one small item purely for joy, with zero guilt." },
      { stage: 3, text: "The Vision: Write a check to yourself for the amount you wish to earn this year." }
    ]
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
    recodeTask: "Identify one moment today where you feel the urge to withdraw. Instead, lean in. Share the vulnerable truth you are afraid to speak.",
    tasks: [
      { stage: 1, text: "The Mirror: Look in the mirror and say 'I love you' three times." },
      { stage: 2, text: "The Reach: Send a text of genuine appreciation to someone you haven't spoken to in a while." },
      { stage: 3, text: "The Boundary: Say 'No' to one request today that drains your energy." }
    ]
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
    recodeTask: "Treat your body with radical reverence today. Choose one meal to eat in complete silence. Taste every bite. Listen to your satiety signals.",
    tasks: [
      { stage: 1, text: "The Breath: Take 10 deep, conscious breaths before your next meal." },
      { stage: 2, text: "The Nourishment: Eat one meal in complete silence, tasting every bite." },
      { stage: 3, text: "The Movement: Walk for 15 minutes without your phone." }
    ]
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
    recodeTask: "Commit to a 'Input Fast' for the next hour. No phone, no music. Just you and the raw data of your immediate reality.",
    tasks: [
      { stage: 1, text: "The Pause: Stop what you are doing for 1 minute. Just be." },
      { stage: 2, text: "The Fast: Turn off all notifications for 1 hour." },
      { stage: 3, text: "The Silence: Sit in a dark room for 5 minutes and listen to the silence." }
    ]
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
    recodeTask: "Do the thing you have been procrastinating within the next 10 minutes. Do not plan it. Do it badly if you must, but do it now.",
    tasks: [
      { stage: 1, text: "The Spark: Identify one thing that excites you, no matter how small." },
      { stage: 2, text: "The Action: Do that thing for 10 minutes today." },
      { stage: 3, text: "The Fire: Share your passion with one other person." }
    ]
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
    recodeTask: "Catch yourself in a 'white lie' today. Stop. Correct the record immediately. Reclaim the energy you were about to spend on maintaining a facade.",
    tasks: [
      { stage: 1, text: "The Question: Ask 'Why?' to a belief you hold true." },
      { stage: 2, text: "The Study: Read one page of a book that challenges your thinking." },
      { stage: 3, text: "The Truth: Speak your truth in a situation where you usually stay silent." }
    ]
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
    recodeTask: "Identify one drain on your energy that you have been tolerating. Say 'No' to it today. Do not explain. Do not apologize.",
    tasks: [
      { stage: 1, text: "The Shield: Visualize a white light surrounding you for 1 minute." },
      { stage: 2, text: "The Cleanse: Declutter one small area of your physical space." },
      { stage: 3, text: "The Cord: Visualize cutting the cord with a person or situation that drains you." }
    ]
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
    recodeTask: "Multitasking is the enemy. Choose your 'One Thing' for today. Pour 100% of your focus into it until it is complete.",
    tasks: [
      { stage: 1, text: "The One Thing: Identify the single most important task for today." },
      { stage: 2, text: "The Deep Work: Work on that task for 25 minutes without distraction." },
      { stage: 3, text: "The Clarity: Write down your top 3 goals for the week." }
    ]
  }
];

// --- Components ---

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

export const FocusSelector: React.FC<{ onSelect: (crystal: Crystal) => void }> = ({ onSelect }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const width = containerRef.current.offsetWidth;
      const itemWidth = width * 0.5; // Each item is 50% of screen width
      const index = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(Math.max(index, 0), CRYSTALS.length - 1));
    }
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
          const isActive = index === activeIndex;
          return (
            <div
              key={crystal.id}
              className="snap-center shrink-0 w-[50vw] max-w-[200px] flex flex-col items-center justify-center transition-all duration-500"
              style={{
                transform: isActive ? 'scale(1.2)' : 'scale(0.8) translateY(10px)',
                opacity: isActive ? 1 : 0.5,
                filter: isActive ? 'none' : 'grayscale(0.5) blur(1px)'
              }}
            >
              <div className="relative w-32 h-32 mb-4">
                {isActive && (
                  <div className={`absolute inset-0 ${crystal.glow} blur-2xl rounded-full animate-pulse`} />
                )}
                <img
                  src={crystal.image}
                  alt={crystal.name}
                  className="relative w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Crystal Info */}
      <div className="text-center mt-4 h-24">
        <h3 className="text-xl font-heading tracking-[0.2em] text-white uppercase mb-1">
          {CRYSTALS[activeIndex].name}
        </h3>
        <p className={`text-xs font-medium tracking-widest uppercase mb-4 ${CRYSTALS[activeIndex].color}`}>
          {CRYSTALS[activeIndex].meaning}
        </p>
        <button
          onClick={() => onSelect(CRYSTALS[activeIndex])}
          className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-xs uppercase tracking-widest text-white transition-all active:scale-95"
        >
          Set Focus
        </button>
      </div>
    </div>
  );
};

// --- Journey Carousel (Hero's Path System) ---
interface JourneyCarouselProps {
  progress: UserProgress;
  onSelectGeode: (crystal: Crystal) => void;
  onContinueJourney: (crystal: Crystal) => void;
  onDeepenPractice?: (crystal: Crystal) => void;
}

export const JourneyCarousel: React.FC<JourneyCarouselProps> = ({
  progress,
  onSelectGeode,
  onContinueJourney,
  onDeepenPractice
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // On mount, scroll to active geode if there is one
  useEffect(() => {
    if (progress.activeGeodeId) {
      const index = CRYSTALS.findIndex(c => c.id === progress.activeGeodeId);
      if (index !== -1 && containerRef.current) {
        const itemWidth = containerRef.current.offsetWidth * 0.25;
        containerRef.current.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
        setActiveIndex(index);
      }
    }
  }, [progress.activeGeodeId]);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const width = containerRef.current.offsetWidth;
      const itemWidth = width * 0.25;
      const index = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(Math.max(index, 0), CRYSTALS.length - 1));
    }
  };

  // Helper to determine the state of a specific crystal slot
  const getSlotState = (crystalId: string): GeodeState => {
    if (progress.masteredGeodeIds.includes(crystalId)) return 'MASTERED';
    if (progress.activeGeodeId === crystalId) return 'ACTIVE';
    if (progress.journeyStatus === 'IN_PROGRESS') return 'LOCKED';
    return 'AVAILABLE';
  };

  const handleItemClick = (crystal: Crystal, slotState: GeodeState) => {
    if (slotState === 'AVAILABLE') onSelectGeode(crystal);
    if (slotState === 'ACTIVE') onContinueJourney(crystal);
    if (slotState === 'MASTERED' && onDeepenPractice) onDeepenPractice(crystal);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Journey Status Header */}
      <div className="text-center mb-4 px-6">
        {progress.journeyStatus === 'SELECTING' && progress.masteredGeodeIds.length === 0 && (
          <p className="text-xs text-white/50 uppercase tracking-widest">Choose your path to begin</p>
        )}
        {progress.journeyStatus === 'SELECTING' && progress.masteredGeodeIds.length > 0 && (
          <p className="text-xs text-emerald-400/80 uppercase tracking-widest">
            {progress.masteredGeodeIds.length} / {CRYSTALS.length} Mastered - Select your next path
          </p>
        )}
        {progress.journeyStatus === 'IN_PROGRESS' && (
          <p className="text-xs text-yellow-400/80 uppercase tracking-widest animate-pulse">
            Journey in progress - Crack level {progress.currentCrackLevel} / 3
          </p>
        )}
        {progress.journeyStatus === 'ALL_MASTERED' && (
          <p className="text-xs text-purple-400/80 uppercase tracking-widest">
            Sage Mode - All paths mastered
          </p>
        )}
      </div>

      {/* 3D Carousel Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory w-full py-6 px-[37%] gap-1"
        style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CRYSTALS.map((crystal, index) => {
          const isActiveInCarousel = index === activeIndex;
          const slotState = getSlotState(crystal.id);

          // Visual Logic
          const scale = isActiveInCarousel ? 1.2 : 0.8;
          const translateY = isActiveInCarousel ? 0 : 10;
          const opacity = isActiveInCarousel ? 1 : 0.5;
          const grayscale = isActiveInCarousel ? 0 : 1;

          // Image Logic - Default to geode, switch to crystal when mastered
          const displayImage = slotState === 'MASTERED' ? crystal.image : '/images/geode-closed.png';

          // If it's the ACTIVE path, show cracks based on progress
          const showCracks = slotState === 'ACTIVE' && progress.currentCrackLevel > 0;

          return (
            <div
              key={crystal.id}
              className="snap-center shrink-0 w-[25vw] max-w-[80px] flex flex-col items-center justify-center transition-all duration-500 relative cursor-pointer"
              style={{
                transform: `scale(${scale}) translateY(${translateY}px)`,
                opacity,
                filter: `grayscale(${grayscale})`
              }}
              onClick={() => handleItemClick(crystal, slotState)}
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
                  <span className="text-[10px] uppercase tracking-widest text-yellow-400 font-bold" style={{ textShadow: '0 0 10px rgba(234, 179, 8, 0.6)' }}>
                    Current Path
                  </span>
                </div>
              )}

              <div className="relative w-14 h-14 sm:w-16 sm:h-16 mb-2">
                {/* Glow Effect for Active/Mastered */}
                {(slotState === 'ACTIVE' || slotState === 'MASTERED') && isActiveInCarousel && (
                  <div className={`absolute inset-0 ${crystal.glow} blur-2xl rounded-full animate-pulse`} />
                )}

                {/* Main Image (Geode or Crystal) */}
                <img
                  src={displayImage}
                  alt={crystal.name}
                  className="relative w-full h-full object-contain z-10"
                  style={{ filter: 'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.5))' }}
                />

                {/* Crack Overlay for Active Geode */}
                {showCracks && (
                  <img
                    src={`/images/geode-crack-mask-${progress.currentCrackLevel}.png`}
                    alt="Cracks"
                    className={`absolute inset-0 w-full h-full object-contain z-20 ${crystal.crackColor}`}
                  />
                )}

                {/* Mastered badge */}
                {slotState === 'MASTERED' && isActiveInCarousel && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-30">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Area */}
      <div className="text-center mt-4 h-32 px-6 w-full max-w-md">
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
            className="w-full max-w-xs py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-transform active:scale-95"
          >
            Begin This Journey
          </button>
        )}

        {getSlotState(CRYSTALS[activeIndex].id) === 'ACTIVE' && (
          <button
            onClick={() => onContinueJourney(CRYSTALS[activeIndex])}
            className="w-full max-w-xs py-4 bg-gradient-to-r from-yellow-200 to-yellow-500 text-black font-bold uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-transform animate-pulse active:scale-95"
          >
            <span className="flex items-center justify-center gap-2">
              <Hammer className="w-4 h-4" />
              Crack Geode
            </span>
          </button>
        )}

        {getSlotState(CRYSTALS[activeIndex].id) === 'LOCKED' && (
          <div className="text-white/30 text-xs uppercase tracking-widest py-4">
            Complete your current path to unlock
          </div>
        )}

        {getSlotState(CRYSTALS[activeIndex].id) === 'MASTERED' && (
          <button
            onClick={() => onDeepenPractice?.(CRYSTALS[activeIndex])}
            className="w-full max-w-xs py-4 bg-white/10 border border-white/20 text-white font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white/20 transition-colors active:scale-95"
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
