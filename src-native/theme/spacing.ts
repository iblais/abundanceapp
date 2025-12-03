/**
 * Abundance Flow - Premium Spacing System
 *
 * Exact values from spec: 4, 8, 12, 16, 24, 32
 * Everything must breathe - generous spacing throughout
 */

// Spacing scale (exact from spec)
export const spacing = {
  // Core scale (only these values per spec)
  xs: 4,       // Tight internal gaps
  sm: 8,       // Related element gaps
  md: 12,      // Related element gaps
  base: 16,    // Standard gaps
  lg: 20,      // Card padding
  xl: 24,      // Screen padding, section gaps
  '2xl': 32,   // Section spacing

  // Extended scale for larger layouts
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
  '7xl': 96,
  '8xl': 128,
} as const;

// Border radius scale (premium soft glass tiles)
// Cards: rounded-3xl (28–32) per spec
// Buttons: rounded-full for pills, rounded-2xl for large CTAs
// Inputs: rounded-2xl
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 28,     // Large CTAs, inputs
  '3xl': 32,     // Default for glass cards (soft tiles)
  full: 9999,    // Pills, circular buttons
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

  // Button heights (spec: primary pill height 48)
  buttonSm: 36,
  buttonBase: 44,
  buttonLg: 48,      // Primary pill button (exact from spec)
  buttonXl: 56,

  // Input heights
  inputSm: 40,
  inputBase: 48,
  inputLg: 56,

  // Card dimensions
  cardMinHeight: 80,
  cardPaddingDefault: 20,  // 16-20 per spec

  // Avatar sizes
  avatarXs: 24,
  avatarSm: 32,
  avatarBase: 40,
  avatarMd: 48,
  avatarLg: 64,
  avatarXl: 80,
  avatar2xl: 120,

  // Navigation
  tabBarHeight: 72,
  headerHeight: 56,
  statusBarHeight: 44,

  // Progress/Meter ring sizes
  progressRingXl: 240,   // Large alignment score
  progressRingLg: 200,   // Dashboard score
  progressRingMd: 140,   // Medium meters
  progressRingSm: 100,   // Small meters (coherence/consistency)
  progressRingXs: 80,    // Inline metrics

  // Glass tile icon containers
  iconContainerSm: 40,
  iconContainerBase: 44,
  iconContainerLg: 48,
} as const;

// Layout helpers matching spec exactly
export const layout = {
  // Screen padding: 24 per spec
  screenPaddingHorizontal: spacing.xl,  // 24
  screenPaddingVertical: spacing.base,  // 16

  // Card padding: 16-20 per spec
  cardPadding: spacing.lg,              // 20
  cardPaddingTight: spacing.base,       // 16
  cardMargin: spacing.base,             // 16

  // Section spacing: 24-32 per spec
  sectionSpacing: spacing['2xl'],       // 32
  sectionSpacingSmall: spacing.xl,      // 24

  // Gaps between related elements: 12-16 per spec
  elementGap: spacing.base,             // 16
  elementGapSmall: spacing.md,          // 12
  listItemSpacing: spacing.md,          // 12
} as const;

export default {
  spacing,
  borderRadius,
  sizing,
  layout,
};
