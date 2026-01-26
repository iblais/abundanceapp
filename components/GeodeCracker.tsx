/**
 * GeodeCracker Component - Premium Quality
 * A tactile, physics-based daily check-in with realistic 3D geode
 * and organic cracking mechanics revealing a crystal cluster.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

// Crystal types with richer color palettes
const crystalTypes = [
  {
    name: 'Amethyst',
    primary: '#8B5CF6',
    secondary: '#A78BFA',
    highlight: '#C4B5FD',
    glow: 'rgba(139, 92, 246, 0.7)',
    deep: '#5B21B6'
  },
  {
    name: 'Rose Quartz',
    primary: '#F472B6',
    secondary: '#F9A8D4',
    highlight: '#FBCFE8',
    glow: 'rgba(244, 114, 182, 0.7)',
    deep: '#BE185D'
  },
  {
    name: 'Citrine',
    primary: '#FBBF24',
    secondary: '#FCD34D',
    highlight: '#FDE68A',
    glow: 'rgba(251, 191, 36, 0.7)',
    deep: '#B45309'
  },
  {
    name: 'Clear Quartz',
    primary: '#E5E7EB',
    secondary: '#F3F4F6',
    highlight: '#FFFFFF',
    glow: 'rgba(255, 255, 255, 0.7)',
    deep: '#9CA3AF'
  },
  {
    name: 'Emerald',
    primary: '#10B981',
    secondary: '#34D399',
    highlight: '#6EE7B7',
    glow: 'rgba(16, 185, 129, 0.7)',
    deep: '#047857'
  },
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

// Generate organic crack paths with branching
const generateCrackNetwork = (stage: number, seed: number): string[] => {
  const paths: string[] = [];
  const random = (min: number, max: number, s: number) => {
    const x = Math.sin(s * 9999) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  };

  if (stage >= 1) {
    // Main crack from top
    const mainStart = { x: 85 + random(-5, 5, seed), y: 30 };
    const mainMid1 = { x: 80 + random(-8, 8, seed + 1), y: 50 + random(-5, 5, seed + 2) };
    const mainMid2 = { x: 85 + random(-10, 10, seed + 3), y: 70 + random(-5, 5, seed + 4) };
    const mainEnd = { x: 80 + random(-8, 8, seed + 5), y: 90 };
    paths.push(`M${mainStart.x},${mainStart.y} Q${mainMid1.x - 10},${mainMid1.y} ${mainMid1.x},${mainMid1.y} T${mainMid2.x},${mainMid2.y} T${mainEnd.x},${mainEnd.y}`);

    // Small branch
    paths.push(`M${mainMid1.x},${mainMid1.y} L${mainMid1.x + 15},${mainMid1.y + 8}`);
  }

  if (stage >= 2) {
    // Secondary crack system
    const sec1Start = { x: 55 + random(-5, 5, seed + 10), y: 45 };
    const sec1Mid = { x: 70 + random(-8, 8, seed + 11), y: 60 + random(-5, 5, seed + 12) };
    const sec1End = { x: 65 + random(-8, 8, seed + 13), y: 85 };
    paths.push(`M${sec1Start.x},${sec1Start.y} Q${sec1Mid.x},${sec1Mid.y - 10} ${sec1Mid.x},${sec1Mid.y} T${sec1End.x},${sec1End.y}`);

    // Branches from secondary
    paths.push(`M${sec1Mid.x},${sec1Mid.y} L${sec1Mid.x - 12},${sec1Mid.y + 10}`);
    paths.push(`M${sec1Mid.x},${sec1Mid.y} L${sec1Mid.x + 8},${sec1Mid.y - 12}`);

    // Connecting crack
    paths.push(`M${70},${65} L${80},${70}`);
  }

  if (stage >= 3) {
    // Tertiary crack network - more fragmentation
    paths.push(`M${95},${55} Q${90},${65} ${85},${75}`);
    paths.push(`M${50},${60} L${58},${55} L${55},${48}`);
    paths.push(`M${60},${75} L${72},${78} L${68},${88}`);
    paths.push(`M${75},${50} L${82},${55}`);
    paths.push(`M${90},${70} L${98},${75}`);
    // Surface micro-cracks
    paths.push(`M${45},${70} L${52},${72}`);
    paths.push(`M${95},${45} L${102},${50}`);
  }

  return paths;
};

// Generate rock debris particles
const generateDebris = (count: number, crystalColor: string) => {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.random() * Math.PI * 2);
    const speed = 80 + Math.random() * 120;
    const isRock = i < count * 0.6;
    return {
      id: i,
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed - 30, // Bias upward initially
      rotation: Math.random() * 720 - 360,
      scale: isRock ? 0.4 + Math.random() * 0.6 : 0.2 + Math.random() * 0.4,
      delay: Math.random() * 0.15,
      isRock,
      color: isRock ? `hsl(${30 + Math.random() * 20}, ${10 + Math.random() * 15}%, ${25 + Math.random() * 20}%)` : crystalColor,
      shape: isRock ? Math.floor(Math.random() * 3) : 3, // 0-2 for rocks, 3 for crystal
    };
  });
};

const GeodeCracker: React.FC<GeodeCrackerProps> = ({ onCheckIn }) => {
  const [tapCount, setTapCount] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCracking, setIsCracking] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [affirmation, setAffirmation] = useState('');
  const [crystal, setCrystal] = useState(crystalTypes[0]);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [crackSeed] = useState(() => Math.random() * 1000);
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

  const crackPaths = useMemo(() => generateCrackNetwork(tapCount, crackSeed), [tapCount, crackSeed]);
  const debris = useMemo(() => generateDebris(35, crystal.primary), [crystal.primary]);

  const handleTap = useCallback(async () => {
    if (isRevealed || hasCheckedIn || isCracking) return;

    setIsCracking(true);
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    // Progressive haptic feedback
    triggerHaptic(newTapCount === 3 ? 'crack' : newTapCount === 2 ? 'heavy' : 'medium');

    // Impact shake - more intense with each tap
    const intensity = 4 + newTapCount * 3;
    await controls.start({
      x: [0, -intensity, intensity, -intensity/2, intensity/2, 0],
      y: [0, -intensity/2, 0, intensity/2, 0, 0],
      rotate: [0, -1.5 * newTapCount, 1.5 * newTapCount, -0.5 * newTapCount, 0],
      scale: [1, 0.97, 1.02, 0.99, 1],
      transition: { duration: 0.35, ease: 'easeOut' }
    });

    setIsCracking(false);

    if (newTapCount >= 3) {
      // Final crack - dramatic pause then explode
      setTimeout(() => {
        setShowParticles(true);
        triggerHaptic('success');

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

          onCheckIn?.(randomAffirmation, 25);

          setTimeout(() => setShowParticles(false), 1200);
        }, 400);
      }, 200);
    }
  }, [controls, hasCheckedIn, isCracking, isRevealed, onCheckIn, tapCount]);

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
        whileHover={!isRevealed && !hasCheckedIn ? { scale: 1.02 } : {}}
        whileTap={!isRevealed && !hasCheckedIn ? { scale: 0.96 } : {}}
      >
        {/* Ambient glow behind geode */}
        <motion.div
          style={{
            ...styles.ambientGlow,
            background: `radial-gradient(circle, ${crystal.glow} 0%, transparent 70%)`
          }}
          animate={{
            opacity: tapCount > 0 ? 0.3 + tapCount * 0.2 : 0,
            scale: tapCount > 0 ? 1 + tapCount * 0.1 : 1
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Closed Geode Rock - High Quality */}
        <AnimatePresence>
          {!isRevealed && (
            <motion.div
              style={styles.rockContainer}
              initial={{ scale: 1, opacity: 1 }}
              exit={{
                scale: [1, 1.1, 0.8],
                opacity: [1, 1, 0],
                transition: { duration: 0.4, ease: 'easeOut' }
              }}
            >
              <svg viewBox="0 0 160 150" style={styles.geodeSvg}>
                <defs>
                  {/* Complex rock texture gradient */}
                  <radialGradient id="rockBase" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#5a524a" />
                    <stop offset="40%" stopColor="#3d3632" />
                    <stop offset="70%" stopColor="#2a2523" />
                    <stop offset="100%" stopColor="#1a1614" />
                  </radialGradient>

                  {/* Secondary highlight gradient */}
                  <radialGradient id="rockHighlight" cx="25%" cy="20%" r="50%">
                    <stop offset="0%" stopColor="rgba(120,110,100,0.4)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>

                  {/* Rock surface texture */}
                  <filter id="rockTexture" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" seed="15" result="noise1"/>
                    <feTurbulence type="turbulence" baseFrequency="0.08" numOctaves="3" seed="25" result="noise2"/>
                    <feBlend in="noise1" in2="noise2" mode="multiply" result="blendedNoise"/>
                    <feColorMatrix type="saturate" values="0.1" result="desaturated"/>
                    <feComponentTransfer result="contrast">
                      <feFuncR type="linear" slope="1.5" intercept="-0.1"/>
                      <feFuncG type="linear" slope="1.5" intercept="-0.1"/>
                      <feFuncB type="linear" slope="1.5" intercept="-0.1"/>
                    </feComponentTransfer>
                    <feComposite in="SourceGraphic" in2="contrast" operator="in" result="textured"/>
                    <feBlend in="textured" in2="contrast" mode="soft-light"/>
                  </filter>

                  {/* Inner crystal glow filter */}
                  <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="8" result="blur"/>
                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                  </filter>

                  {/* Crack glow effect */}
                  <filter id="crackGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="3" result="blur1"/>
                    <feGaussianBlur stdDeviation="6" result="blur2"/>
                    <feMerge>
                      <feMergeNode in="blur2"/>
                      <feMergeNode in="blur1"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>

                  {/* Crystal color gradient for cracks */}
                  <linearGradient id="crackColor" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={crystal.highlight} />
                    <stop offset="50%" stopColor={crystal.primary} />
                    <stop offset="100%" stopColor={crystal.secondary} />
                  </linearGradient>

                  {/* Depth shadow */}
                  <filter id="dropShadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.5)"/>
                  </filter>
                </defs>

                {/* Shadow under geode */}
                <ellipse cx="80" cy="135" rx="50" ry="10" fill="rgba(0,0,0,0.3)" filter="url(#dropShadow)"/>

                {/* Main geode body - organic rock shape */}
                <path
                  d="M80,15
                     C105,15 130,30 138,55
                     C145,75 142,100 130,115
                     C118,130 95,135 80,135
                     C65,135 42,130 30,115
                     C18,100 15,75 22,55
                     C30,30 55,15 80,15Z"
                  fill="url(#rockBase)"
                  filter="url(#rockTexture)"
                />

                {/* Rock surface highlights */}
                <path
                  d="M80,15
                     C105,15 130,30 138,55
                     C145,75 142,100 130,115
                     C118,130 95,135 80,135
                     C65,135 42,130 30,115
                     C18,100 15,75 22,55
                     C30,30 55,15 80,15Z"
                  fill="url(#rockHighlight)"
                />

                {/* Surface detail bumps */}
                <ellipse cx="45" cy="50" rx="12" ry="8" fill="rgba(70,60,55,0.5)" transform="rotate(-15 45 50)"/>
                <ellipse cx="110" cy="60" rx="10" ry="7" fill="rgba(50,45,40,0.6)" transform="rotate(20 110 60)"/>
                <ellipse cx="65" cy="100" rx="15" ry="9" fill="rgba(45,40,35,0.4)" transform="rotate(-5 65 100)"/>
                <ellipse cx="100" cy="95" rx="11" ry="7" fill="rgba(55,50,45,0.5)" transform="rotate(10 100 95)"/>

                {/* Rock edge definition */}
                <path
                  d="M80,15
                     C105,15 130,30 138,55
                     C145,75 142,100 130,115
                     C118,130 95,135 80,135
                     C65,135 42,130 30,115
                     C18,100 15,75 22,55
                     C30,30 55,15 80,15Z"
                  fill="none"
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="1"
                />

                {/* Inner crystal cavity hint - glows through cracks */}
                {tapCount > 0 && (
                  <motion.ellipse
                    cx="80"
                    cy="75"
                    rx="30"
                    ry="35"
                    fill={crystal.glow}
                    filter="url(#innerGlow)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 + tapCount * 0.25 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* Crack network - progressive reveal */}
                {crackPaths.map((path, index) => (
                  <motion.g key={index}>
                    {/* Crack depth/shadow */}
                    <motion.path
                      d={path}
                      stroke="rgba(0,0,0,0.8)"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.25, delay: index * 0.03, ease: 'easeOut' }}
                    />
                    {/* Crack inner glow */}
                    <motion.path
                      d={path}
                      stroke="url(#crackColor)"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#crackGlow)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.25, delay: index * 0.03 + 0.05, ease: 'easeOut' }}
                    />
                    {/* Crack highlight edge */}
                    <motion.path
                      d={path}
                      stroke={crystal.highlight}
                      strokeWidth="1"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.8 }}
                      transition={{ duration: 0.2, delay: index * 0.03 + 0.1, ease: 'easeOut' }}
                    />
                  </motion.g>
                ))}
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Debris Particles */}
        <AnimatePresence>
          {showParticles && (
            <div style={styles.particlesContainer}>
              {debris.map((p) => (
                <motion.div
                  key={p.id}
                  style={{
                    ...styles.debris,
                    background: p.color,
                    borderRadius: p.isRock ? '2px' : '0',
                    clipPath: p.isRock
                      ? p.shape === 0
                        ? 'polygon(20% 0%, 80% 0%, 100% 60%, 60% 100%, 0% 80%)'
                        : p.shape === 1
                        ? 'polygon(0% 30%, 50% 0%, 100% 30%, 80% 100%, 20% 100%)'
                        : 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
                      : 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', // Crystal shard
                    boxShadow: p.isRock
                      ? 'inset 1px 1px 2px rgba(255,255,255,0.2), inset -1px -1px 2px rgba(0,0,0,0.3)'
                      : `0 0 8px ${crystal.glow}`,
                    width: p.isRock ? '12px' : '8px',
                    height: p.isRock ? '10px' : '12px',
                  }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                  animate={{
                    x: p.x,
                    y: [0, p.y * 0.3, p.y + 80], // Arc with gravity
                    scale: [0, p.scale * 1.2, p.scale, 0],
                    opacity: [1, 1, 1, 0],
                    rotate: p.rotation,
                  }}
                  transition={{
                    duration: 1,
                    delay: p.delay,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    y: { duration: 1, ease: 'easeIn' }
                  }}
                />
              ))}
              {/* Dust particles */}
              {Array.from({ length: 20 }, (_, i) => (
                <motion.div
                  key={`dust-${i}`}
                  style={{
                    ...styles.dust,
                    background: `rgba(${150 + Math.random() * 50}, ${140 + Math.random() * 40}, ${130 + Math.random() * 30}, 0.6)`
                  }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0.8 }}
                  animate={{
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200,
                    scale: [0, 0.5 + Math.random() * 0.5, 0],
                    opacity: [0.8, 0.4, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    delay: Math.random() * 0.2,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Revealed Crystal Cluster */}
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              style={styles.crystalContainer}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: 0.1
              }}
            >
              <svg viewBox="0 0 160 150" style={styles.crystalSvg}>
                <defs>
                  {/* Crystal gradient */}
                  <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={crystal.highlight} />
                    <stop offset="30%" stopColor={crystal.secondary} />
                    <stop offset="70%" stopColor={crystal.primary} />
                    <stop offset="100%" stopColor={crystal.deep} />
                  </linearGradient>

                  {/* Crystal facet highlights */}
                  <linearGradient id="crystalHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                    <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>

                  {/* Side facet gradient */}
                  <linearGradient id="sideFacet" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={crystal.deep} />
                    <stop offset="100%" stopColor={crystal.primary} />
                  </linearGradient>

                  {/* Crystal glow filter */}
                  <filter id="crystalGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur"/>
                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                  </filter>

                  {/* Outer glow */}
                  <filter id="outerGlow">
                    <feGaussianBlur stdDeviation="8" result="blur"/>
                    <feMerge>
                      <feMergeNode in="blur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>

                  {/* Geode cavity base gradient */}
                  <radialGradient id="cavityGrad" cx="50%" cy="60%" r="50%">
                    <stop offset="0%" stopColor="#1a1614" />
                    <stop offset="60%" stopColor="#0d0b0a" />
                    <stop offset="100%" stopColor="#000000" />
                  </radialGradient>

                  {/* Geode shell gradient */}
                  <radialGradient id="shellGrad" cx="30%" cy="30%" r="80%">
                    <stop offset="0%" stopColor="#4a4240" />
                    <stop offset="50%" stopColor="#2d2826" />
                    <stop offset="100%" stopColor="#1a1614" />
                  </radialGradient>
                </defs>

                {/* Outer shell/rim of opened geode */}
                <path
                  d="M15,75
                     C15,40 35,15 80,15
                     C125,15 145,40 145,75
                     C145,110 125,135 80,135
                     C35,135 15,110 15,75Z"
                  fill="url(#shellGrad)"
                />

                {/* Inner cavity shadow */}
                <ellipse cx="80" cy="78" rx="52" ry="48" fill="url(#cavityGrad)"/>

                {/* Ambient crystal glow in cavity */}
                <motion.ellipse
                  cx="80"
                  cy="80"
                  rx="40"
                  ry="35"
                  fill={crystal.glow}
                  filter="url(#outerGlow)"
                  animate={{
                    opacity: [0.4, 0.6, 0.4],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Crystal cluster - multiple individual crystals */}
                <g filter="url(#crystalGlow)">
                  {/* Center large crystal */}
                  <motion.g
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 400 }}
                  >
                    <polygon
                      points="80,25 95,50 95,95 80,115 65,95 65,50"
                      fill="url(#crystalGrad)"
                    />
                    <polygon
                      points="80,25 95,50 80,55 65,50"
                      fill="url(#crystalHighlight)"
                    />
                    <polygon
                      points="65,50 80,55 80,115 65,95"
                      fill={crystal.deep}
                      opacity="0.7"
                    />
                    <polygon
                      points="95,50 80,55 80,115 95,95"
                      fill="url(#sideFacet)"
                      opacity="0.5"
                    />
                  </motion.g>

                  {/* Left crystal */}
                  <motion.g
                    initial={{ scale: 0, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.25, type: 'spring', stiffness: 400 }}
                  >
                    <polygon
                      points="50,50 60,65 60,100 50,110 40,100 40,65"
                      fill="url(#crystalGrad)"
                    />
                    <polygon
                      points="50,50 60,65 50,68 40,65"
                      fill="url(#crystalHighlight)"
                    />
                    <polygon
                      points="40,65 50,68 50,110 40,100"
                      fill={crystal.deep}
                      opacity="0.6"
                    />
                  </motion.g>

                  {/* Right crystal */}
                  <motion.g
                    initial={{ scale: 0, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
                  >
                    <polygon
                      points="110,48 122,62 122,98 110,112 98,98 98,62"
                      fill="url(#crystalGrad)"
                    />
                    <polygon
                      points="110,48 122,62 110,66 98,62"
                      fill="url(#crystalHighlight)"
                    />
                    <polygon
                      points="122,62 110,66 110,112 122,98"
                      fill="url(#sideFacet)"
                      opacity="0.5"
                    />
                  </motion.g>

                  {/* Small crystal - left back */}
                  <motion.g
                    initial={{ scale: 0, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.35, type: 'spring', stiffness: 400 }}
                  >
                    <polygon
                      points="35,68 42,78 42,95 35,102 28,95 28,78"
                      fill="url(#crystalGrad)"
                      opacity="0.8"
                    />
                    <polygon
                      points="35,68 42,78 35,80 28,78"
                      fill="url(#crystalHighlight)"
                    />
                  </motion.g>

                  {/* Small crystal - right back */}
                  <motion.g
                    initial={{ scale: 0, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.38, type: 'spring', stiffness: 400 }}
                  >
                    <polygon
                      points="128,65 134,74 134,92 128,100 122,92 122,74"
                      fill="url(#crystalGrad)"
                      opacity="0.75"
                    />
                    <polygon
                      points="128,65 134,74 128,76 122,74"
                      fill="url(#crystalHighlight)"
                    />
                  </motion.g>

                  {/* Tiny accent crystals */}
                  <motion.polygon
                    points="70,55 74,62 74,75 70,80 66,75 66,62"
                    fill={crystal.secondary}
                    opacity="0.7"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                  />
                  <motion.polygon
                    points="92,58 96,66 96,78 92,84 88,78 88,66"
                    fill={crystal.secondary}
                    opacity="0.7"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.42, type: 'spring' }}
                  />
                </g>

                {/* Shell rim detail */}
                <path
                  d="M15,75
                     C15,40 35,15 80,15
                     C125,15 145,40 145,75
                     C145,110 125,135 80,135
                     C35,135 15,110 15,75Z"
                  fill="none"
                  stroke="rgba(80,70,65,0.5)"
                  strokeWidth="2"
                />

                {/* Inner rim edge */}
                <ellipse
                  cx="80" cy="78" rx="52" ry="48"
                  fill="none"
                  stroke="rgba(30,25,20,0.8)"
                  strokeWidth="3"
                />
              </svg>

              {/* Floating sparkles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    ...styles.sparkle,
                    top: `${25 + (i % 4) * 15}%`,
                    left: `${20 + (i % 5) * 15}%`,
                    background: i % 2 === 0 ? crystal.highlight : '#ffffff',
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
              style={{
                ...styles.crystalName,
                color: crystal.primary,
                textShadow: `0 0 20px ${crystal.glow}`
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
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
                style={{
                  ...styles.points,
                  background: `linear-gradient(135deg, ${crystal.glow} 0%, rgba(212, 175, 55, 0.2) 100%)`,
                  borderColor: crystal.primary
                }}
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
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              {tapCount === 0 ? 'Tap to crack' : `${3 - tapCount} more tap${3 - tapCount !== 1 ? 's' : ''}`}
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
                background: i < tapCount
                  ? `linear-gradient(135deg, ${crystal.primary}, ${crystal.secondary})`
                  : 'rgba(255,255,255,0.15)',
                boxShadow: i < tapCount ? `0 0 8px ${crystal.glow}` : 'none'
              }}
              animate={i < tapCount ? { scale: [1, 1.4, 1] } : {}}
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
    width: '180px',
    height: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  ambientGlow: {
    position: 'absolute',
    width: '200%',
    height: '200%',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  rockContainer: {
    position: 'absolute',
    width: '160px',
    height: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  geodeSvg: {
    width: '100%',
    height: '100%',
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  debris: {
    position: 'absolute',
  },
  dust: {
    position: 'absolute',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
  },
  crystalContainer: {
    position: 'relative',
    width: '160px',
    height: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crystalSvg: {
    width: '100%',
    height: '100%',
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
    maxWidth: '280px',
  },
  crystalName: {
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '3px',
    marginBottom: '10px',
  },
  affirmation: {
    fontSize: '16px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 1.6,
    fontStyle: 'italic',
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
    marginTop: '18px',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: '0.5px',
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
