/**
 * Abundance Flow - Premium Color System
 *
 * Exact match to reference screens:
 * Deep indigo gradient background, glass cards, soft glow, pill buttons
 */

export const colors = {
  // Background gradients (exact from spec)
  background: {
    primaryStart: '#050819',
    primaryEnd: '#1C1540',
    // Secondary darker shade for depth
    deepStart: '#020510',
    deepEnd: '#0F0A28',
  },

  // Glass surfaces (glassmorphism)
  glass: {
    fill: 'rgba(255, 255, 255, 0.10)',
    fillLight: 'rgba(255, 255, 255, 0.14)',
    fillMedium: 'rgba(255, 255, 255, 0.18)',
    border: 'rgba(255, 255, 255, 0.20)',
    borderLight: 'rgba(255, 255, 255, 0.33)',
    highlight: 'rgba(230, 230, 255, 0.10)',
    // Inner gradient for cards
    innerGradientStart: 'rgba(255, 255, 255, 0.08)',
    innerGradientEnd: 'rgba(255, 255, 255, 0.02)',
  },

  // Brand accent - Gold (exact from spec)
  accent: {
    gold: '#F4D180',
    goldSoft: '#E6C06A',
    goldMuted: '#D4AF5A',
    goldGlow: 'rgba(244, 209, 128, 0.4)',
    goldOverlay: 'rgba(244, 209, 128, 0.15)',
  },

  // Lavender halo / violet accent
  halo: {
    violet: '#C8A8FF',
    violetSoft: '#AE9AFF',
    violetMuted: '#9080E0',
    violetGlow: 'rgba(200, 168, 255, 0.3)',
  },

  // Text colors (exact from spec)
  text: {
    primary: '#FFFFFF',
    secondary: '#D1D5DB',
    muted: '#9CA3AF',
    inverse: '#0F0A28',
  },

  // System states
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#60A5FA',
  },

  // Chart colors (matching accent palette)
  chart: {
    gold: '#F4D180',
    violet: '#C8A8FF',
    teal: '#2DD4BF',
    blue: '#60A5FA',
    pink: '#F472B6',
    // Soft versions for fills
    goldArea: 'rgba(244, 209, 128, 0.2)',
    violetArea: 'rgba(200, 168, 255, 0.2)',
    grid: 'rgba(255, 255, 255, 0.08)',
    label: 'rgba(255, 255, 255, 0.5)',
  },

  // Neutral palette (for UI elements)
  neutral: {
    white: '#FFFFFF',
    offWhite: '#F5F5F7',
    gray100: '#E5E5EA',
    gray200: '#D1D1D6',
    gray300: '#AEAEB2',
    gray400: '#8E8E93',
    gray500: '#636366',
    gray600: '#48484A',
    gray700: '#3A3A3C',
    gray800: '#2C2C2E',
    gray900: '#1C1C1E',
    black: '#000000',
  },

  // Gradients (for LinearGradient component)
  gradients: {
    // Primary screen background
    primaryBackground: ['#050819', '#1C1540'],
    // Deeper variant for nested elements
    deepBackground: ['#020510', '#0F0A28'],
    // Glass card gradient
    glassCard: ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.04)'],
    glassCardLight: ['rgba(255, 255, 255, 0.16)', 'rgba(255, 255, 255, 0.08)'],
    // Gold button gradient (shiny pill effect)
    goldButton: ['#F4D180', '#E6C06A', '#D4AF5A'],
    goldButtonHighlight: ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.05)'],
    // Progress ring gradient
    progressRing: ['#C8A8FF', '#F4D180'],
    progressRingAlt: ['#AE9AFF', '#E6C06A'],
    // Soft purple accent
    softViolet: ['rgba(200, 168, 255, 0.25)', 'rgba(174, 154, 255, 0.08)'],
    // Halo glow effect
    haloGlow: ['rgba(200, 168, 255, 0.4)', 'rgba(200, 168, 255, 0)'],
  },

  // Legacy mappings for compatibility
  primary: {
    lavender: '#C8A8FF',
    lavenderLight: '#AE9AFF',
    indigo: '#1C1540',
    indigoDeep: '#0F0A28',
    cosmicBlue: '#050819',
    cosmicBlueDeep: '#020510',
  },
};

// Light mode colors (keeping dark as default for premium feel)
export const lightColors = {
  ...colors,
  background: {
    primaryStart: '#F8F9FC',
    primaryEnd: '#EEF0F6',
    deepStart: '#FFFFFF',
    deepEnd: '#F5F6FA',
  },
  glass: {
    fill: 'rgba(0, 0, 0, 0.04)',
    fillLight: 'rgba(0, 0, 0, 0.06)',
    fillMedium: 'rgba(0, 0, 0, 0.08)',
    border: 'rgba(0, 0, 0, 0.08)',
    borderLight: 'rgba(0, 0, 0, 0.12)',
    highlight: 'rgba(255, 255, 255, 0.8)',
    innerGradientStart: 'rgba(255, 255, 255, 0.9)',
    innerGradientEnd: 'rgba(255, 255, 255, 0.6)',
  },
  accent: {
    gold: '#D4A84B',
    goldSoft: '#C69A3D',
    goldMuted: '#B88D35',
    goldGlow: 'rgba(212, 168, 75, 0.3)',
    goldOverlay: 'rgba(212, 168, 75, 0.1)',
  },
  halo: {
    violet: '#8B7BB8',
    violetSoft: '#7A6BA8',
    violetMuted: '#695B98',
    violetGlow: 'rgba(139, 123, 184, 0.2)',
  },
  text: {
    primary: '#1C1C1E',
    secondary: '#4B5563',
    muted: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  gradients: {
    primaryBackground: ['#F8F9FC', '#EEF0F6'],
    deepBackground: ['#FFFFFF', '#F5F6FA'],
    glassCard: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)'],
    glassCardLight: ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.8)'],
    goldButton: ['#D4A84B', '#C69A3D', '#B88D35'],
    goldButtonHighlight: ['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.1)'],
    progressRing: ['#8B7BB8', '#D4A84B'],
    progressRingAlt: ['#7A6BA8', '#C69A3D'],
    softViolet: ['rgba(139, 123, 184, 0.15)', 'rgba(122, 107, 168, 0.05)'],
    haloGlow: ['rgba(139, 123, 184, 0.3)', 'rgba(139, 123, 184, 0)'],
  },
  chart: {
    gold: '#D4A84B',
    violet: '#8B7BB8',
    teal: '#14B8A6',
    blue: '#3B82F6',
    pink: '#EC4899',
    goldArea: 'rgba(212, 168, 75, 0.15)',
    violetArea: 'rgba(139, 123, 184, 0.15)',
    grid: 'rgba(0, 0, 0, 0.06)',
    label: 'rgba(0, 0, 0, 0.5)',
  },
  primary: {
    lavender: '#8B7BB8',
    lavenderLight: '#7A6BA8',
    indigo: '#EEF0F6',
    indigoDeep: '#F5F6FA',
    cosmicBlue: '#F8F9FC',
    cosmicBlueDeep: '#FFFFFF',
  },
};

export default colors;
