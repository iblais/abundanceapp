/**
 * Abundance Recode - Color System
 *
 * Universal Aesthetic: Clean, premium, and universally appealing
 * Inspired by Calm and Opal
 */

export const colors = {
  // Primary Gradients - Lavender, Indigo, Cosmic Blues
  primary: {
    lavender: '#8B7BB8',
    lavenderLight: '#A99DD4',
    indigo: '#4B3F72',
    indigoDeep: '#2E2650',
    cosmicBlue: '#1A1A3E',
    cosmicBlueDeep: '#0D0D24',
  },

  // Accent - Muted Gold (for highlights and CTAs only)
  accent: {
    gold: '#C9A961',
    goldMuted: '#B89B4F',
    goldLight: '#DBC588',
    goldSoft: 'rgba(201, 169, 97, 0.3)',
  },

  // Neutral palette
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

  // Semantic colors
  semantic: {
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#5AC8FA',
  },

  // Glassmorphism
  glass: {
    background: 'rgba(255, 255, 255, 0.08)',
    backgroundLight: 'rgba(255, 255, 255, 0.12)',
    backgroundMedium: 'rgba(255, 255, 255, 0.16)',
    border: 'rgba(255, 255, 255, 0.15)',
    borderLight: 'rgba(255, 255, 255, 0.25)',
  },

  // Gradients (for LinearGradient component)
  gradients: {
    primaryBackground: ['#1A1A3E', '#2E2650', '#0D0D24'],
    cardGlass: ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)'],
    goldButton: ['#DBC588', '#C9A961', '#B89B4F'],
    accent: ['#8B7BB8', '#4B3F72'],
    progress: ['#C9A961', '#8B7BB8'],
    softPurple: ['rgba(139, 123, 184, 0.3)', 'rgba(75, 63, 114, 0.1)'],
  },

  // Chart colors
  chart: {
    line: '#C9A961',
    area: 'rgba(201, 169, 97, 0.2)',
    grid: 'rgba(255, 255, 255, 0.1)',
    label: 'rgba(255, 255, 255, 0.6)',
  },

  // Text colors for dark mode (default)
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
    tertiary: 'rgba(255, 255, 255, 0.5)',
    muted: 'rgba(255, 255, 255, 0.3)',
    inverse: '#1C1C1E',
  },
};

// Light mode colors
export const lightColors = {
  ...colors,
  primary: {
    lavender: '#8B7BB8',
    lavenderLight: '#A99DD4',
    indigo: '#6B5B9A',
    indigoDeep: '#4B3F72',
    cosmicBlue: '#F5F5F7',
    cosmicBlueDeep: '#E5E5EA',
  },
  glass: {
    background: 'rgba(0, 0, 0, 0.04)',
    backgroundLight: 'rgba(0, 0, 0, 0.06)',
    backgroundMedium: 'rgba(0, 0, 0, 0.08)',
    border: 'rgba(0, 0, 0, 0.08)',
    borderLight: 'rgba(0, 0, 0, 0.12)',
  },
  gradients: {
    primaryBackground: ['#F5F5F7', '#E5E5EA', '#D1D1D6'],
    cardGlass: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)'],
    goldButton: ['#DBC588', '#C9A961', '#B89B4F'],
    accent: ['#A99DD4', '#8B7BB8'],
    progress: ['#C9A961', '#8B7BB8'],
    softPurple: ['rgba(139, 123, 184, 0.2)', 'rgba(75, 63, 114, 0.05)'],
  },
  chart: {
    line: '#4B3F72',
    area: 'rgba(75, 63, 114, 0.2)',
    grid: 'rgba(0, 0, 0, 0.1)',
    label: 'rgba(0, 0, 0, 0.6)',
  },
  text: {
    primary: '#1C1C1E',
    secondary: 'rgba(0, 0, 0, 0.6)',
    tertiary: 'rgba(0, 0, 0, 0.4)',
    muted: 'rgba(0, 0, 0, 0.25)',
    inverse: '#FFFFFF',
  },
};

export default colors;
