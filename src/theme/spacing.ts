/**
 * Abundance Flow - Spacing System
 *
 * Based on 8pt grid for consistent, harmonious spacing
 */

// Base spacing unit
const BASE_UNIT = 8;

// Spacing scale
export const spacing = {
  // Tiny spaces
  xs: BASE_UNIT * 0.5,    // 4
  sm: BASE_UNIT,          // 8

  // Standard spaces
  md: BASE_UNIT * 1.5,    // 12
  base: BASE_UNIT * 2,    // 16
  lg: BASE_UNIT * 2.5,    // 20
  xl: BASE_UNIT * 3,      // 24

  // Large spaces
  '2xl': BASE_UNIT * 4,   // 32
  '3xl': BASE_UNIT * 5,   // 40
  '4xl': BASE_UNIT * 6,   // 48
  '5xl': BASE_UNIT * 8,   // 64

  // Extra large spaces
  '6xl': BASE_UNIT * 10,  // 80
  '7xl': BASE_UNIT * 12,  // 96
  '8xl': BASE_UNIT * 16,  // 128
} as const;

// Border radius scale (20px default for cards as per spec)
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,      // Default for glassmorphic cards
  xl: 24,
  '2xl': 32,
  full: 9999,  // For pill shapes
} as const;

// Component-specific sizing
export const sizing = {
  // Icon sizes
  iconXs: 16,
  iconSm: 20,
  iconBase: 24,
  iconMd: 28,
  iconLg: 32,
  iconXl: 40,
  icon2xl: 48,

  // Button heights
  buttonSm: 36,
  buttonBase: 44,
  buttonLg: 52,
  buttonXl: 60,

  // Input heights
  inputSm: 40,
  inputBase: 48,
  inputLg: 56,

  // Card dimensions
  cardMinHeight: 80,

  // Avatar sizes
  avatarXs: 24,
  avatarSm: 32,
  avatarBase: 40,
  avatarMd: 48,
  avatarLg: 64,
  avatarXl: 80,
  avatar2xl: 120,

  // Navigation
  tabBarHeight: 84,
  headerHeight: 56,
  statusBarHeight: 44,

  // Progress ring
  progressRingLg: 200,
  progressRingMd: 150,
  progressRingSm: 100,
} as const;

// Layout helpers
export const layout = {
  screenPaddingHorizontal: spacing.xl,
  screenPaddingVertical: spacing.base,
  cardPadding: spacing.lg,
  cardMargin: spacing.base,
  sectionSpacing: spacing['2xl'],
  listItemSpacing: spacing.md,
} as const;

export default {
  spacing,
  borderRadius,
  sizing,
  layout,
};
