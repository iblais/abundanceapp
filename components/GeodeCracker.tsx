import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { CRYSTALS, Crystal, FocusSelector, CrownOfAbundance } from './AbundanceComponents';

interface GeodeCrackerProps {
  onCrackComplete?: () => void;
}

export const GeodeCracker: React.FC<GeodeCrackerProps> = ({ onCrackComplete }) => {
  const [mode, setMode] = useState<'select' | 'charge' | 'crack' | 'reveal'>('select');
  const [selectedCrystal, setSelectedCrystal] = useState<Crystal | null>(null);
  const [chargeLevel, setChargeLevel] = useState(0); // 0 to 100
  const [taps, setTaps] = useState(0);
  const [collectedIds, setCollectedIds] = useState<string[]>([]);
  const controls = useAnimation();
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; angle: number; scale: number; speed: number }[]>([]);

  const MAX_TAPS = 3;
  const CHARGE_TARGET = 100;

  // Simulate "Task Completion" to charge the geode
  useEffect(() => {
    if (mode === 'charge') {
      const interval = setInterval(() => {
        setChargeLevel(prev => {
          if (prev >= CHARGE_TARGET) {
            clearInterval(interval);
            setMode('crack');
            return CHARGE_TARGET;
          }
          return prev + 2; // Slow charge to simulate "work"
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [mode]);

  const handleSelect = (crystal: Crystal) => {
    setSelectedCrystal(crystal);
    setMode('charge');
  };

  const handleTap = async () => {
    if (mode !== 'crack') return;

    const newTaps = taps + 1;
    setTaps(newTaps);

    const intensity = newTaps * 2;
    await controls.start({
      x: [0, -5 * intensity, 5 * intensity, -3 * intensity, 3 * intensity, 0],
      rotate: [0, -2 * intensity, 2 * intensity, -1 * intensity, 1 * intensity, 0],
      scale: [1, 0.95, 1.05, 1],
      transition: { duration: 0.3, ease: "easeInOut" }
    });

    if (newTaps >= MAX_TAPS) {
      setMode('reveal');
      generateParticles();
      if (selectedCrystal) {
        setCollectedIds(prev => [...prev, selectedCrystal.id]);
      }
      if (onCrackComplete) setTimeout(onCrackComplete, 4000);
    }
  };

  const generateParticles = () => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: 0,
      y: 0,
      angle: (Math.random() * 360) * (Math.PI / 180),
      scale: Math.random() * 0.5 + 0.5,
      speed: Math.random() * 200 + 100
    }));
    setParticles(newParticles);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[700px]">
      {/* Crown of Abundance (Top Bar) */}
      <CrownOfAbundance collectedIds={collectedIds} />

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md relative">
        <AnimatePresence mode="wait">

          {/* PHASE 1: SELECTOR */}
          {mode === 'select' && (
            <motion.div
              key="selector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col items-center"
            >
              <h2 className="text-center text-xl font-heading text-white mb-2 tracking-widest uppercase">Choose Your Anchor</h2>
              <p className="text-center text-white/50 text-sm mb-8 font-light">What energy are you calling in today?</p>
              <FocusSelector onSelect={handleSelect} />
            </motion.div>
          )}

          {/* PHASE 2: CHARGING (The Closed Geode) */}
          {(mode === 'charge' || mode === 'crack') && selectedCrystal && (
            <motion.div
              key="charging-geode"
              className="relative cursor-pointer group z-10 mt-10"
              onClick={mode === 'crack' ? handleTap : undefined}
              animate={mode === 'crack' ? controls : { scale: 1, opacity: 1 }}
              initial={{ scale: 0.8, opacity: 0 }}
            >
              {/* Progress Ring */}
              <svg className="absolute -inset-12 w-[calc(100%+6rem)] h-[calc(100%+6rem)] rotate-[-90deg] opacity-50">
                <circle cx="50%" cy="50%" r="46%" fill="none" stroke="#1e293b" strokeWidth="2" />
                <motion.circle
                  cx="50%" cy="50%" r="46%" fill="none" stroke={mode === 'crack' ? '#F5D547' : '#334155'}
                  strokeWidth="4" strokeDasharray="100 100"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: chargeLevel / 100 }}
                  transition={{ duration: 0.5 }}
                  className={mode === 'crack' ? "drop-shadow-[0_0_10px_rgba(245,213,71,0.8)]" : ""}
                />
              </svg>

              {/* The Rock */}
              <div className="relative w-72 h-72">
                <img src="/images/geode-closed.png" alt="Geode" className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl z-10" />

                {/* Cracks appear when fully charged/tapping */}
                <AnimatePresence>
                  {(mode === 'crack' && taps >= 1) && (
                    <motion.img
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      src="/images/geode-crack-mask-1.png"
                      className={`absolute inset-0 z-20 w-full h-full object-contain ${selectedCrystal.crackColor}`}
                    />
                  )}
                  {(mode === 'crack' && taps >= 2) && (
                    <motion.img
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      src="/images/geode-crack-mask-2.png"
                      className={`absolute inset-0 z-30 w-full h-full object-contain ${selectedCrystal.crackColor}`}
                    />
                  )}
                </AnimatePresence>

                {/* Pulsing Glow while charging */}
                <motion.div
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`absolute inset-0 ${selectedCrystal.glow.replace('/20', '/40')} blur-2xl rounded-full z-0`}
                />
              </div>

              {/* Status Text */}
              <motion.div className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-center w-full">
                {mode === 'charge' ? (
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-xs font-heading tracking-widest text-white/50 uppercase animate-pulse">
                      Charging Energy... {chargeLevel}%
                    </p>
                    <p className="text-[10px] text-white/30">Complete tasks to charge</p>
                  </div>
                ) : (
                  <p className="text-xs font-heading tracking-widest text-yellow-400 uppercase animate-bounce">
                    Energy Critical! Tap to Release
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* PHASE 3: REVEAL (The Recode Download) */}
          {mode === 'reveal' && selectedCrystal && (
            <motion.div
              key="reveal"
              className="relative w-full flex flex-col items-center justify-center mt-10"
            >
              {/* Radiant Background */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.5 }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${selectedCrystal.glow} blur-[100px] rounded-full`}
              />

              {/* Gemstone */}
              <motion.img
                src={selectedCrystal.image}
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className={`relative w-48 h-48 object-contain ${selectedCrystal.shadow} z-20 mb-8`}
              />

              {/* Debris Particles */}
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute left-1/2 top-1/3 w-4 h-4"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                  animate={{
                    x: Math.cos(p.angle) * p.speed,
                    y: Math.sin(p.angle) * p.speed,
                    opacity: 0,
                    scale: p.scale,
                    rotate: p.angle * 50
                  }}
                >
                  <img src="/images/rock-debris.png" className="w-full h-full object-contain opacity-80" />
                </motion.div>
              ))}

              {/* The Recode Content */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative z-30 max-w-sm text-center bg-black/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
              >
                <h3 className={`text-sm font-bold tracking-widest uppercase mb-4 ${selectedCrystal.color}`}>
                  {selectedCrystal.recodeTitle}
                </h3>
                <div className="h-px w-12 bg-white/20 mx-auto mb-6" />
                <p className="text-white/90 text-sm leading-relaxed font-serif italic mb-6">
                  "{selectedCrystal.recodeTask}"
                </p>
                <button
                  onClick={() => setMode('select')}
                  className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-full hover:bg-white/5"
                >
                  Close & Collect
                </button>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default GeodeCracker;
