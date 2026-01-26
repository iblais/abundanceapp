/**
 * GeodeCracker Component - Premium 8-Crystal Edition
 * Features 8 unique crystals with dynamic crack coloring
 * The glowing cracks match the color of the crystal inside
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Sparkles } from 'lucide-react';

// Daily affirmations pool
const dailyAffirmations = [
  "I am worthy of abundance in all forms",
  "Today, I choose to see opportunities everywhere",
  "I am aligned with the energy of prosperity",
  "My potential is limitless",
  "I attract success effortlessly",
  "I am grateful for all that flows to me",
  "I release all resistance to receiving",
  "My thoughts create my reality",
  "I am becoming more abundant every day",
  "The universe supports my highest good",
  "I welcome wealth and success into my life",
  "Every day, I grow stronger and more confident",
  "I am open to receiving unexpected blessings",
  "My positive energy attracts positive outcomes",
  "I trust the journey and embrace the unknown"
];

// Extended Crystal Database - 8 unique crystals with dynamic crack colors
const crystalTypes = [
  {
    id: 'amethyst',
    name: 'Amethyst',
    image: '/images/gem-amethyst.png',
    meaning: 'Clarity • Intuition • Peace',
    primary: '#8B5CF6',
    glow: 'rgba(139, 92, 246, 0.6)',
    // Purple tint for cracks
    crackFilter: 'brightness(1.5) sepia(0) hue-rotate(260deg) saturate(2)',
    crackBlendMode: 'color-dodge' as const
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    image: '/images/gem-rose-quartz.png',
    meaning: 'Love • Compassion • Healing',
    primary: '#F472B6',
    glow: 'rgba(244, 114, 182, 0.6)',
    // Pink tint for cracks
    crackFilter: 'brightness(1.25) sepia(0) hue-rotate(320deg) saturate(1.5)',
    crackBlendMode: 'color-dodge' as const
  },
  {
    id: 'citrine',
    name: 'Citrine',
    image: '/images/gem-citrine.png',
    meaning: 'Abundance • Joy • Success',
    primary: '#FBBF24',
    glow: 'rgba(251, 191, 36, 0.6)',
    // Gold tint for cracks
    crackFilter: 'brightness(1.5) sepia(1) hue-rotate(40deg) saturate(2)',
    crackBlendMode: 'color-dodge' as const
  },
  {
    id: 'clear-quartz',
    name: 'Clear Quartz',
    image: '/images/gem-clear-quartz.png',
    meaning: 'Amplification • Focus • Energy',
    primary: '#E5E7EB',
    glow: 'rgba(255, 255, 255, 0.6)',
    // White/Blue tint for cracks
    crackFilter: 'brightness(2)',
    crackBlendMode: 'overlay' as const
  },
  {
    id: 'emerald',
    name: 'Emerald',
    image: '/images/gem-emerald.png',
    meaning: 'Growth • Harmony • Renewal',
    primary: '#10B981',
    glow: 'rgba(16, 185, 129, 0.6)',
    // Green tint for cracks
    crackFilter: 'brightness(1.5) sepia(0) hue-rotate(120deg) saturate(2)',
    crackBlendMode: 'color-dodge' as const
  },
  {
    id: 'sapphire',
    name: 'Sapphire',
    image: '/images/gem-sapphire.png',
    meaning: 'Wisdom • Truth • Insight',
    primary: '#2563EB',
    glow: 'rgba(37, 99, 235, 0.6)',
    // Deep Blue tint for cracks
    crackFilter: 'brightness(1.5) sepia(0) hue-rotate(220deg) saturate(2)',
    crackBlendMode: 'color-dodge' as const
  },
  {
    id: 'ruby',
    name: 'Ruby',
    image: '/images/gem-ruby.png',
    meaning: 'Passion • Vitality • Courage',
    primary: '#DC2626',
    glow: 'rgba(220, 38, 38, 0.6)',
    // Red tint for cracks
    crackFilter: 'brightness(1.5) sepia(0) hue-rotate(340deg) saturate(2)',
    crackBlendMode: 'color-dodge' as const
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    image: '/images/gem-obsidian.png',
    meaning: 'Protection • Grounding • Truth',
    primary: '#4B5563',
    glow: 'rgba(75, 85, 99, 0.6)',
    // Dark/Silver tint for cracks
    crackFilter: 'brightness(0.5)',
    crackBlendMode: 'overlay' as const
  }
];

// Haptic feedback helper
const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy' | 'success' | 'crack') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    const patterns: Record<string, number | number[]> = {
      light: 8,
      medium: 20,
      heavy: 40,
      crack: [20, 30, 40, 30, 50],
      success: [30, 50, 30, 80, 100]
    };
    navigator.vibrate(patterns[intensity]);
  }
};

interface GeodeCrackerProps {
  onCheckIn?: (affirmation: string, points: number) => void;
}

const GeodeCracker: React.FC<GeodeCrackerProps> = ({ onCheckIn }) => {
  const [taps, setTaps] = useState(0);
  const [isCracked, setIsCracked] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [affirmation, setAffirmation] = useState('');
  const [crystal, setCrystal] = useState(crystalTypes[0]);
  const controls = useAnimation();
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; angle: number; scale: number; speed: number }[]>([]);

  const MAX_TAPS = 3;

  // Check if already checked in today
  useEffect(() => {
    const today = new Date().toDateString();
    const lastCheckIn = localStorage.getItem('lastGeodeCheckIn');
    if (lastCheckIn === today) {
      setHasCheckedIn(true);
      const savedAffirmation = localStorage.getItem('todayAffirmation') || dailyAffirmations[0];
      const savedCrystalId = localStorage.getItem('todayCrystalId');
      const savedCrystal = crystalTypes.find(c => c.id === savedCrystalId) || crystalTypes[0];
      setAffirmation(savedAffirmation);
      setCrystal(savedCrystal);
      setIsCracked(true);
      setTaps(MAX_TAPS);
    }
  }, []);

  const handleTap = useCallback(async () => {
    if (isCracked || hasCheckedIn) return;

    const newTaps = taps + 1;
    setTaps(newTaps);

    // Progressive haptic feedback
    triggerHaptic(newTaps === MAX_TAPS ? 'crack' : newTaps === 2 ? 'heavy' : 'medium');

    // Progressive shake intensity based on taps
    const intensity = newTaps * 2;

    await controls.start({
      x: [0, -5 * intensity, 5 * intensity, -3 * intensity, 3 * intensity, 0],
      rotate: [0, -2 * intensity, 2 * intensity, -1 * intensity, 1 * intensity, 0],
      scale: [1, 0.95, 1.05, 1],
      transition: { duration: 0.3, ease: "easeInOut" }
    });

    if (newTaps >= MAX_TAPS) {
      // Generate debris particles
      const newParticles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: 0,
        y: 0,
        angle: (Math.random() * 360) * (Math.PI / 180),
        scale: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 200 + 100
      }));
      setParticles(newParticles);

      triggerHaptic('success');

      setTimeout(() => {
        setIsCracked(true);

        // Pick random affirmation and crystal
        const randomAffirmation = dailyAffirmations[Math.floor(Math.random() * dailyAffirmations.length)];
        const randomCrystal = crystalTypes[Math.floor(Math.random() * crystalTypes.length)];

        setAffirmation(randomAffirmation);
        setCrystal(randomCrystal);

        // Save check-in with crystal ID for reliable lookup
        const today = new Date().toDateString();
        localStorage.setItem('lastGeodeCheckIn', today);
        localStorage.setItem('todayAffirmation', randomAffirmation);
        localStorage.setItem('todayCrystalId', randomCrystal.id);
        setHasCheckedIn(true);

        onCheckIn?.(randomAffirmation, 25);
      }, 400);
    }
  }, [controls, hasCheckedIn, isCracked, onCheckIn, taps]);

  return (
    <div style={styles.container}>
      {/* Title */}
      <motion.div
        style={styles.title}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Sparkles size={18} style={{ marginRight: 8, color: '#D4AF37' }} />
        {hasCheckedIn ? "Today's Crystal" : "Daily Geode"}
      </motion.div>

      {/* Main Geode Container */}
      <div style={styles.geodeContainer}>
        <AnimatePresence mode="wait">
          {!isCracked ? (
            <motion.div
              key="closed-geode"
              style={styles.closedGeode}
              onClick={handleTap}
              animate={controls}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Progress Ring */}
              <svg style={styles.progressRing}>
                <circle
                  cx="50%"
                  cy="50%"
                  r="46%"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="1"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="46%"
                  fill="none"
                  stroke="#F5D547"
                  strokeWidth="2"
                  strokeDasharray="289 289"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 289 }}
                  animate={{ strokeDashoffset: 289 - (289 * (taps / MAX_TAPS)) }}
                  transition={{ duration: 0.3 }}
                  style={{ filter: 'drop-shadow(0 0 8px rgba(245,213,71,0.5))' }}
                />
              </svg>

              {/* The Rock Container */}
              <div style={styles.rockContainer}>
                {/* Base Rock */}
                <img
                  src="/images/geode-closed.png"
                  alt="Mysterious Geode"
                  style={styles.geodeImage}
                  draggable={false}
                />

                {/* Progressive Cracks Overlay with Dynamic Tinting */}
                <AnimatePresence>
                  {taps >= 1 && (
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src="/images/geode-crack-mask-1.png"
                      alt=""
                      style={{
                        ...styles.crackOverlay,
                        zIndex: 20,
                        filter: crystal.crackFilter,
                        mixBlendMode: crystal.crackBlendMode
                      }}
                    />
                  )}
                  {taps >= 2 && (
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src="/images/geode-crack-mask-2.png"
                      alt=""
                      style={{
                        ...styles.crackOverlay,
                        zIndex: 30,
                        filter: crystal.crackFilter,
                        mixBlendMode: crystal.crackBlendMode
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Internal Glow Leak - Matches Crystal Color */}
                <motion.div
                  animate={{ opacity: taps * 0.4 }}
                  style={{
                    ...styles.internalGlow,
                    background: `radial-gradient(circle, ${crystal.glow.replace('0.6', '0.8')} 0%, transparent 70%)`
                  }}
                />
              </div>

              {/* Debris Particles (shown during final crack) */}
              {particles.length > 0 && (
                <div style={styles.particlesContainer}>
                  {particles.map((p) => (
                    <motion.div
                      key={p.id}
                      style={styles.debrisWrapper}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                      animate={{
                        x: Math.cos(p.angle) * p.speed,
                        y: Math.sin(p.angle) * p.speed,
                        opacity: 0,
                        scale: p.scale,
                        rotate: p.angle * 50
                      }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                      <img
                        src="/images/rock-debris.png"
                        alt=""
                        style={styles.debrisImage}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="open-geode"
              style={styles.openGeode}
            >
              {/* Radiant Glow Background */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.5 }}
                transition={{ duration: 1 }}
                style={{
                  ...styles.radiantGlow,
                  background: `radial-gradient(circle, ${crystal.glow} 0%, transparent 70%)`
                }}
              />

              {/* The Gemstone - Uses crystal-specific image */}
              <motion.img
                src={crystal.image}
                alt={`Revealed ${crystal.name}`}
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.1
                }}
                style={{
                  ...styles.gemImage,
                  filter: `drop-shadow(0 0 60px ${crystal.glow})`
                }}
              />

              {/* Floating sparkles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    ...styles.sparkle,
                    top: `${25 + (i % 4) * 15}%`,
                    left: `${20 + (i % 5) * 15}%`,
                    background: i % 2 === 0 ? crystal.primary : '#ffffff',
                  }}
                  animate={{
                    scale: [0, 1.2, 0],
                    opacity: [0, 1, 0],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Crystal Name and Affirmation */}
      <AnimatePresence>
        {isCracked && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, type: "spring" }}
            style={styles.messageContainer}
          >
            <h3 style={{
              ...styles.crystalName,
              color: crystal.primary,
              textShadow: `0 0 20px ${crystal.glow}`
            }}>
              {crystal.name.toUpperCase()}
            </h3>
            <div style={{
              ...styles.divider,
              background: `linear-gradient(to right, transparent, ${crystal.glow}, transparent)`
            }} />
            <p style={{
              ...styles.meaning,
              color: crystal.primary,
              opacity: 0.9
            }}>
              {crystal.meaning}
            </p>
            <motion.p
              style={styles.affirmation}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              "{affirmation}"
            </motion.p>
            {!hasCheckedIn && (
              <motion.div
                style={{
                  ...styles.points,
                  background: `linear-gradient(135deg, ${crystal.glow} 0%, rgba(212, 175, 55, 0.2) 100%)`,
                  borderColor: crystal.primary
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, type: 'spring' }}
              >
                +25 Alignment Points
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tap Hint */}
      <AnimatePresence>
        {!isCracked && !hasCheckedIn && (
          <motion.div
            style={styles.tapHint}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <motion.p
              style={styles.tapText}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              {taps === 0 ? "Tap to Reveal" : `${MAX_TAPS - taps} tap${MAX_TAPS - taps !== 1 ? 's' : ''} left`}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Dots */}
      {!isCracked && !hasCheckedIn && (
        <div style={styles.progressDots}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{
                ...styles.dot,
                background: i < taps
                  ? `linear-gradient(135deg, ${crystal.primary}, #F5D547)`
                  : 'rgba(255,255,255,0.15)',
                boxShadow: i < taps ? `0 0 8px ${crystal.glow}` : 'none'
              }}
              animate={i < taps ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 16px',
    marginBottom: '16px',
    minHeight: '420px',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    marginBottom: '20px',
  },
  geodeContainer: {
    position: 'relative',
    width: '288px',
    height: '288px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  closedGeode: {
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  progressRing: {
    position: 'absolute',
    width: 'calc(100% + 4rem)',
    height: 'calc(100% + 4rem)',
    transform: 'rotate(-90deg)',
    opacity: 0.5,
    left: '-2rem',
    top: '-2rem',
  },
  rockContainer: {
    position: 'relative',
    width: '288px',
    height: '288px',
  },
  geodeImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.5))',
    zIndex: 10,
    userSelect: 'none',
  },
  crackOverlay: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    userSelect: 'none',
    pointerEvents: 'none',
  },
  internalGlow: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    zIndex: 0,
  },
  particlesContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 0,
    height: 0,
    zIndex: 50,
  },
  debrisWrapper: {
    position: 'absolute',
    width: '16px',
    height: '16px',
  },
  debrisImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    opacity: 0.8,
  },
  openGeode: {
    position: 'relative',
    width: '320px',
    height: '320px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radiantGlow: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
  },
  gemImage: {
    position: 'relative',
    width: '256px',
    height: '256px',
    objectFit: 'contain',
    zIndex: 20,
    userSelect: 'none',
  },
  sparkle: {
    position: 'absolute',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    boxShadow: '0 0 10px currentColor',
  },
  messageContainer: {
    textAlign: 'center',
    marginTop: '20px',
    width: '100%',
    zIndex: 30,
  },
  crystalName: {
    fontSize: '24px',
    fontWeight: 700,
    letterSpacing: '4px',
    marginBottom: '8px',
  },
  divider: {
    height: '1px',
    width: '48px',
    margin: '0 auto 8px',
  },
  meaning: {
    fontSize: '12px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    fontWeight: 500,
    marginBottom: '16px',
  },
  affirmation: {
    fontSize: '16px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 1.6,
    fontStyle: 'italic',
    maxWidth: '280px',
    margin: '0 auto',
  },
  points: {
    marginTop: '14px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#D4AF37',
    padding: '8px 16px',
    borderRadius: '20px',
    display: 'inline-block',
    border: '1px solid',
  },
  tapHint: {
    marginTop: '16px',
    textAlign: 'center',
    width: '100%',
  },
  tapText: {
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '3px',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
  },
  progressDots: {
    display: 'flex',
    gap: '10px',
    marginTop: '14px',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
  },
};

export default GeodeCracker;
