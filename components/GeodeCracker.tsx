/**
 * GeodeCracker Component
 * A tactile, physics-based daily check-in where users tap a geode 3 times
 * to crack it open and reveal a daily crystal/affirmation.
 */

import React, { useState, useEffect } from 'react';
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

// Crystal types for variety
const crystalTypes = [
  { name: 'Amethyst', color: '#9b59b6', glow: 'rgba(155, 89, 182, 0.6)' },
  { name: 'Rose Quartz', color: '#e8a4c4', glow: 'rgba(232, 164, 196, 0.6)' },
  { name: 'Citrine', color: '#f4d03f', glow: 'rgba(244, 208, 63, 0.6)' },
  { name: 'Clear Quartz', color: '#ecf0f1', glow: 'rgba(236, 240, 241, 0.6)' },
  { name: 'Jade', color: '#27ae60', glow: 'rgba(39, 174, 96, 0.6)' },
];

// Haptic feedback helper
const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy' | 'success') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    const patterns: Record<string, number | number[]> = {
      light: 5,
      medium: 15,
      heavy: 30,
      success: [30, 50, 60]
    };
    navigator.vibrate(patterns[intensity]);
  }
};

interface GeodeCrackerProps {
  onCheckIn?: (affirmation: string, points: number) => void;
}

const GeodeCracker: React.FC<GeodeCrackerProps> = ({ onCheckIn }) => {
  const [tapCount, setTapCount] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [affirmation, setAffirmation] = useState('');
  const [crystal, setCrystal] = useState(crystalTypes[0]);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const controls = useAnimation();

  // Check if already checked in today
  useEffect(() => {
    const today = new Date().toDateString();
    const lastCheckIn = localStorage.getItem('lastGeodeCheckIn');
    if (lastCheckIn === today) {
      setHasCheckedIn(true);
      const savedAffirmation = localStorage.getItem('todayAffirmation') || dailyAffirmations[0];
      const savedCrystalIndex = parseInt(localStorage.getItem('todayCrystal') || '0');
      setAffirmation(savedAffirmation);
      setCrystal(crystalTypes[savedCrystalIndex]);
      setIsRevealed(true);
      setTapCount(3);
    }
  }, []);

  const handleTap = async () => {
    if (isRevealed || hasCheckedIn) return;

    // Haptic feedback - intensifies with each tap
    triggerHaptic(tapCount < 2 ? 'medium' : 'heavy');

    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    // Shake animation
    setIsShaking(true);
    await controls.start({
      x: [0, -10, 10, -10, 10, 0],
      rotate: [0, -2, 2, -2, 2, 0],
      transition: { duration: 0.4, ease: 'easeInOut' }
    });
    setIsShaking(false);

    if (newTapCount >= 3) {
      // Trigger the reveal!
      setShowParticles(true);
      triggerHaptic('success');

      // Dramatic pause then reveal
      setTimeout(() => {
        setIsRevealed(true);

        // Pick random affirmation and crystal
        const randomAffirmation = dailyAffirmations[Math.floor(Math.random() * dailyAffirmations.length)];
        const randomCrystalIndex = Math.floor(Math.random() * crystalTypes.length);
        const randomCrystal = crystalTypes[randomCrystalIndex];

        setAffirmation(randomAffirmation);
        setCrystal(randomCrystal);

        // Save check-in
        const today = new Date().toDateString();
        localStorage.setItem('lastGeodeCheckIn', today);
        localStorage.setItem('todayAffirmation', randomAffirmation);
        localStorage.setItem('todayCrystal', randomCrystalIndex.toString());
        setHasCheckedIn(true);

        // Callback with points
        onCheckIn?.(randomAffirmation, 25);

        // Clear particles after animation
        setTimeout(() => setShowParticles(false), 1000);
      }, 600);
    }
  };

  // Generate particle positions for explosion effect
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const distance = 100 + Math.random() * 60;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      scale: 0.5 + Math.random() * 0.5,
      delay: Math.random() * 0.3
    };
  });

  // Crack lines SVG paths that appear progressively
  const crackPaths = [
    "M70 25 L68 45 L75 55 L70 70",
    "M70 25 L68 45 L75 55 L70 70 M55 40 L70 50 L85 42",
    "M70 25 L68 45 L75 55 L70 70 M55 40 L70 50 L85 42 M60 65 L70 70 L80 68 M45 55 L55 50 L50 40"
  ];

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

      {/* Geode Container */}
      <motion.div
        style={styles.geodeWrapper}
        animate={controls}
        onClick={handleTap}
        whileTap={{ scale: 0.95 }}
      >
        {/* Closed Geode Rock */}
        <AnimatePresence>
          {!isRevealed && (
            <motion.div
              style={styles.rockContainer}
              initial={{ scale: 1, opacity: 1 }}
              exit={{
                scale: 1.2,
                opacity: 0,
                filter: 'brightness(2)',
                transition: { duration: 0.5 }
              }}
            >
              {/* Rock Image or Fallback */}
              <motion.img
                src="/images/geode-closed.png"
                alt="Geode"
                style={styles.rockImage}
                onError={(e) => {
                  // Fallback to gradient rock if image fails
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />

              {/* Fallback rock visualization */}
              <div style={styles.fallbackRock}>
                <svg viewBox="0 0 140 140" style={{ width: '100%', height: '100%' }}>
                  <defs>
                    <radialGradient id="rockGradient" cx="30%" cy="30%">
                      <stop offset="0%" stopColor="#4a4a4a" />
                      <stop offset="70%" stopColor="#2a2a2a" />
                      <stop offset="100%" stopColor="#1a1a1a" />
                    </radialGradient>
                    <filter id="rockTexture">
                      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" />
                      <feDisplacementMap in="SourceGraphic" scale="5" />
                    </filter>
                  </defs>
                  <ellipse
                    cx="70" cy="75" rx="55" ry="50"
                    fill="url(#rockGradient)"
                    filter="url(#rockTexture)"
                  />
                </svg>
              </div>

              {/* Crack Lines - Progressive */}
              <svg style={styles.crackOverlay} viewBox="0 0 140 140">
                <defs>
                  <linearGradient id="crackGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={crystal.color} />
                    <stop offset="100%" stopColor={crystal.glow} />
                  </linearGradient>
                  <filter id="glowFilter">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                {tapCount > 0 && (
                  <motion.path
                    d={crackPaths[Math.min(tapCount - 1, crackPaths.length - 1)]}
                    stroke="url(#crackGlow)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#glowFilter)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                )}
              </svg>

              {/* Inner Glow through cracks */}
              <motion.div
                style={{
                  ...styles.innerGlow,
                  background: `radial-gradient(circle, ${crystal.glow} 0%, transparent 70%)`
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: tapCount * 0.3 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Explosion Particles */}
        <AnimatePresence>
          {showParticles && (
            <div style={styles.particlesContainer}>
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  style={{
                    ...styles.particle,
                    background: crystal.color,
                    boxShadow: `0 0 10px ${crystal.glow}`
                  }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{
                    x: p.x,
                    y: p.y,
                    scale: [0, p.scale, 0],
                    opacity: [1, 1, 0]
                  }}
                  transition={{
                    duration: 0.8,
                    delay: p.delay,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Revealed Crystal */}
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              style={styles.crystalContainer}
              initial={{ scale: 0, opacity: 0, rotate: -30 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.2
              }}
            >
              {/* Open Geode Image or Fallback */}
              <motion.img
                src="/images/geode-open.png"
                alt="Crystal"
                style={styles.crystalImage}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />

              {/* Fallback crystal visualization */}
              <div style={styles.fallbackCrystal}>
                <motion.div
                  style={{
                    ...styles.crystalCore,
                    background: `linear-gradient(135deg, ${crystal.color} 0%, ${crystal.glow} 50%, #ffffff 100%)`
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 30px ${crystal.glow}`,
                      `0 0 50px ${crystal.glow}`,
                      `0 0 30px ${crystal.glow}`
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  {/* Crystal facets */}
                  <div style={styles.facet1} />
                  <div style={styles.facet2} />
                  <div style={styles.facet3} />
                </motion.div>
              </div>

              {/* Sparkle effects around crystal */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    ...styles.sparkle,
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Affirmation Message */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            style={styles.messageContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.div
              style={styles.crystalName}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {crystal.name}
            </motion.div>
            <motion.div
              style={styles.affirmation}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              "{affirmation}"
            </motion.div>
            {!hasCheckedIn && (
              <motion.div
                style={styles.points}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
              >
                +25 Alignment Points
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tap Hint */}
      <AnimatePresence>
        {!isRevealed && !hasCheckedIn && (
          <motion.div
            style={styles.tapHint}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Tap {3 - tapCount} more time{3 - tapCount !== 1 ? 's' : ''} to crack open
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Dots */}
      {!isRevealed && !hasCheckedIn && (
        <div style={styles.progressDots}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{
                ...styles.dot,
                background: i < tapCount ? '#D4AF37' : 'rgba(255,255,255,0.2)'
              }}
              animate={i < tapCount ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Inline styles for the component
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 16px',
    marginBottom: '16px',
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
  geodeWrapper: {
    position: 'relative',
    width: '160px',
    height: '160px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  rockContainer: {
    position: 'absolute',
    width: '140px',
    height: '140px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rockImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    zIndex: 1,
  },
  fallbackRock: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  crackOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  innerGlow: {
    position: 'absolute',
    width: '60%',
    height: '60%',
    borderRadius: '50%',
    zIndex: 1,
    pointerEvents: 'none',
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    top: '50%',
    left: '50%',
    marginTop: '-4px',
    marginLeft: '-4px',
  },
  crystalContainer: {
    position: 'relative',
    width: '140px',
    height: '140px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crystalImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    zIndex: 1,
  },
  fallbackCrystal: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  crystalCore: {
    width: '80px',
    height: '100px',
    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
    position: 'relative',
    overflow: 'hidden',
  },
  facet1: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    left: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
  },
  facet2: {
    position: 'absolute',
    width: '100%',
    height: '30%',
    top: '35%',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
  },
  facet3: {
    position: 'absolute',
    width: '30%',
    height: '50%',
    right: '10%',
    top: '20%',
    background: 'rgba(255,255,255,0.15)',
    transform: 'skewY(-15deg)',
  },
  sparkle: {
    position: 'absolute',
    width: '6px',
    height: '6px',
    background: '#ffffff',
    borderRadius: '50%',
    boxShadow: '0 0 10px #ffffff',
  },
  messageContainer: {
    textAlign: 'center',
    marginTop: '20px',
    maxWidth: '280px',
  },
  crystalName: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#D4AF37',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: '8px',
  },
  affirmation: {
    fontSize: '16px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 1.5,
    fontStyle: 'italic',
  },
  points: {
    marginTop: '12px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#D4AF37',
    background: 'rgba(212, 175, 55, 0.15)',
    padding: '6px 12px',
    borderRadius: '20px',
    display: 'inline-block',
  },
  tapHint: {
    marginTop: '16px',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
  },
  progressDots: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    transition: 'background 0.3s ease',
  },
};

export default GeodeCracker;
