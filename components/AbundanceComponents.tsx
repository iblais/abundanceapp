import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { Check, Lock } from 'lucide-react';

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
