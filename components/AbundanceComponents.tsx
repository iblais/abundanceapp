import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="flex items-center justify-center gap-2 py-4 px-6 bg-black/40 backdrop-blur-md border-b border-white/5 w-full overflow-x-auto">
      {CRYSTALS.map((crystal) => {
        const isCollected = collectedIds.includes(crystal.id);
        return (
          <div key={crystal.id} className="relative group flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isCollected ? 'opacity-100 scale-100' : 'opacity-30 scale-90 grayscale'}`}>
              <img src={crystal.image} alt={crystal.name} className="w-full h-full object-contain drop-shadow-md" />
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
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedCrystal = CRYSTALS[selectedIndex];

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold && selectedIndex < CRYSTALS.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else if (info.offset.x > swipeThreshold && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleCrystalClick = (index: number) => {
    if (!isDragging) {
      if (index === selectedIndex) {
        onSelect(CRYSTALS[index]);
      } else {
        setSelectedIndex(index);
      }
    }
  };

  // Get visible crystals (prev, current, next)
  const getVisibleCrystals = () => {
    const prev = selectedIndex > 0 ? selectedIndex - 1 : null;
    const next = selectedIndex < CRYSTALS.length - 1 ? selectedIndex + 1 : null;
    return { prev, current: selectedIndex, next };
  };

  const { prev, current, next } = getVisibleCrystals();

  return (
    <div className="w-full flex flex-col items-center">
      {/* Achievement Badge - above the carousel */}
      <motion.div
        key={selectedCrystal.id + '-badge'}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
      >
        <p className="text-[10px] text-white/50 uppercase tracking-widest">{selectedCrystal.meaning.split('•')[0].trim()}</p>
        <p className={`text-xs ${selectedCrystal.color} text-center`}>{selectedCrystal.meaning.split('•')[1]?.trim() || ''}</p>
      </motion.div>

      {/* Crystal Carousel */}
      <motion.div
        ref={containerRef}
        className="relative w-full h-40 flex items-center justify-center overflow-hidden"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
      >
        {/* Left crystal (previous) */}
        <AnimatePresence mode="popLayout">
          {prev !== null && (
            <motion.div
              key={CRYSTALS[prev].id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 0.4, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="absolute left-4 cursor-pointer"
              onClick={() => handleCrystalClick(prev)}
            >
              <img
                src={CRYSTALS[prev].image}
                alt={CRYSTALS[prev].name}
                className="w-16 h-16 object-contain grayscale-[30%] blur-[0.5px]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center crystal (selected) */}
        <motion.div
          key={selectedCrystal.id + '-center'}
          className="relative flex flex-col items-center cursor-pointer z-10"
          onClick={() => handleCrystalClick(current)}
          whileTap={{ scale: 0.95 }}
          layoutId="selected-crystal"
        >
          {/* Glow effect */}
          <motion.div
            className={`absolute inset-0 ${selectedCrystal.glow.replace('/20', '/40')} blur-3xl rounded-full scale-150`}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Crystal image */}
          <motion.img
            src={selectedCrystal.image}
            alt={selectedCrystal.name}
            className={`w-24 h-24 object-contain relative z-10 ${selectedCrystal.shadow}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />

          {/* Pedestal */}
          <div className="w-12 h-3 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full mt-1 shadow-lg" />
        </motion.div>

        {/* Right crystal (next) */}
        <AnimatePresence mode="popLayout">
          {next !== null && (
            <motion.div
              key={CRYSTALS[next].id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 0.4, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="absolute right-4 cursor-pointer"
              onClick={() => handleCrystalClick(next)}
            >
              <img
                src={CRYSTALS[next].image}
                alt={CRYSTALS[next].name}
                className="w-16 h-16 object-contain grayscale-[30%] blur-[0.5px]"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Crystal name and tap instruction */}
      <motion.div
        key={selectedCrystal.id + '-info'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-4"
      >
        <p className="text-white/40 text-xs">Tap crystal to select</p>
      </motion.div>

      {/* Dot indicators */}
      <div className="flex gap-1.5 mt-4">
        {CRYSTALS.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? 'bg-white w-4'
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
