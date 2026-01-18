/**
 * Abundance Recode - Animation System
 *
 * All animations use subtle ease-out cubic timing
 * No fast or jarring motion - smooth and calming
 */

import { Easing } from 'react-native-reanimated';

// Duration constants (in milliseconds)
export const duration = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 700,
  slowest: 1000,
  meditation: 2000,  // For breathing animations
  transition: 350,   // Screen transitions
} as const;

// Easing curves - all subtle ease-out cubic
export const easing = {
  // Primary easing - use for most animations
  easeOut: Easing.bezier(0.16, 1, 0.3, 1),
  easeOutCubic: Easing.bezier(0.33, 1, 0.68, 1),

  // For entry animations
  easeOutQuart: Easing.bezier(0.25, 1, 0.5, 1),

  // For gentle, slow animations (meditation-like)
  easeOutSine: Easing.bezier(0.61, 1, 0.88, 1),

  // For spring-like bounces (very subtle)
  easeOutBack: Easing.bezier(0.34, 1.56, 0.64, 1),

  // Linear for progress bars
  linear: Easing.linear,

  // Breathing animation - very smooth
  breathing: Easing.bezier(0.37, 0, 0.63, 1),
} as const;

// Spring configurations for react-native-reanimated
export const springConfig = {
  // Default spring - smooth and responsive
  default: {
    damping: 20,
    stiffness: 150,
    mass: 1,
  },

  // Gentle spring - for subtle movements
  gentle: {
    damping: 25,
    stiffness: 100,
    mass: 1,
  },

  // Snappy spring - for quick feedback
  snappy: {
    damping: 15,
    stiffness: 300,
    mass: 0.8,
  },

  // Bouncy spring - very subtle bounce
  bouncy: {
    damping: 12,
    stiffness: 200,
    mass: 1,
  },

  // Stiff spring - minimal overshoot
  stiff: {
    damping: 30,
    stiffness: 250,
    mass: 1,
  },
} as const;

// Timing configurations
export const timingConfig = {
  // Default timing
  default: {
    duration: duration.normal,
    easing: easing.easeOut,
  },

  // Fast feedback
  fast: {
    duration: duration.fast,
    easing: easing.easeOutCubic,
  },

  // Slow, meditative
  slow: {
    duration: duration.slow,
    easing: easing.easeOutSine,
  },

  // Screen transition
  transition: {
    duration: duration.transition,
    easing: easing.easeOutQuart,
  },

  // Progress ring animation
  progress: {
    duration: duration.slower,
    easing: easing.easeOutCubic,
  },
} as const;

// Pre-defined animation presets
export const presets = {
  // Fade in
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: timingConfig.default,
  },

  // Fade in and slide up
  fadeInUp: {
    from: { opacity: 0, transform: [{ translateY: 20 }] },
    to: { opacity: 1, transform: [{ translateY: 0 }] },
    config: timingConfig.default,
  },

  // Scale in
  scaleIn: {
    from: { opacity: 0, transform: [{ scale: 0.9 }] },
    to: { opacity: 1, transform: [{ scale: 1 }] },
    config: timingConfig.default,
  },

  // Slide from right
  slideInRight: {
    from: { opacity: 0, transform: [{ translateX: 30 }] },
    to: { opacity: 1, transform: [{ translateX: 0 }] },
    config: timingConfig.default,
  },

  // Press feedback
  press: {
    pressed: { transform: [{ scale: 0.98 }] },
    default: { transform: [{ scale: 1 }] },
    config: springConfig.snappy,
  },

  // Glow pulse (for progress ring)
  glowPulse: {
    from: { opacity: 0.6 },
    to: { opacity: 1 },
    config: {
      duration: duration.meditation,
      easing: easing.breathing,
    },
  },
} as const;

// Stagger delays for list animations
export const staggerDelay = {
  fast: 50,
  normal: 100,
  slow: 150,
} as const;

export default {
  duration,
  easing,
  springConfig,
  timingConfig,
  presets,
  staggerDelay,
};
