/**
 * Abundance Flow - Typography System
 *
 * Font Family: Inter (or SF Pro fallback)
 * Ensures high contrast and clean, professional typography
 */

import { Platform, TextStyle } from 'react-native';

// Font family with platform-specific fallbacks
const fontFamily = Platform.select({
  ios: 'Inter',
  android: 'Inter',
  default: 'Inter',
});

// Font weights mapped to font family names
export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// Type scale following 8pt grid
export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 34,
  '4xl': 40,
  '5xl': 48,
  hero: 64,
} as const;

// Line heights
export const lineHeight = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.4,
  relaxed: 1.5,
  loose: 1.75,
} as const;

// Letter spacing
export const letterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
  widest: 1,
} as const;

// Pre-defined text styles
export const textStyles: Record<string, TextStyle> = {
  // Display styles - for hero sections
  displayLarge: {
    fontFamily,
    fontSize: fontSize.hero,
    fontWeight: fontWeights.bold,
    lineHeight: fontSize.hero * lineHeight.tight,
    letterSpacing: letterSpacing.tighter,
  },
  displayMedium: {
    fontFamily,
    fontSize: fontSize['5xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSize['5xl'] * lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  displaySmall: {
    fontFamily,
    fontSize: fontSize['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSize['4xl'] * lineHeight.snug,
    letterSpacing: letterSpacing.tight,
  },

  // Heading styles
  h1: {
    fontFamily,
    fontSize: fontSize['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSize['3xl'] * lineHeight.snug,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontFamily,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSize['2xl'] * lineHeight.snug,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontFamily,
    fontSize: fontSize.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSize.xl * lineHeight.snug,
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontFamily,
    fontSize: fontSize.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSize.lg * lineHeight.snug,
    letterSpacing: letterSpacing.normal,
  },
  h5: {
    fontFamily,
    fontSize: fontSize.md,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSize.md * lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Body styles
  bodyLarge: {
    fontFamily,
    fontSize: fontSize.md,
    fontWeight: fontWeights.regular,
    lineHeight: fontSize.md * lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontFamily,
    fontSize: fontSize.base,
    fontWeight: fontWeights.regular,
    lineHeight: fontSize.base * lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    fontFamily,
    fontSize: fontSize.sm,
    fontWeight: fontWeights.regular,
    lineHeight: fontSize.sm * lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },

  // Label styles
  labelLarge: {
    fontFamily,
    fontSize: fontSize.base,
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.base * lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },
  label: {
    fontFamily,
    fontSize: fontSize.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.sm * lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },
  labelSmall: {
    fontFamily,
    fontSize: fontSize.xs,
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.xs * lineHeight.normal,
    letterSpacing: letterSpacing.wider,
  },

  // Caption and overline
  caption: {
    fontFamily,
    fontSize: fontSize.xs,
    fontWeight: fontWeights.regular,
    lineHeight: fontSize.xs * lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  overline: {
    fontFamily,
    fontSize: fontSize.xs,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSize.xs * lineHeight.normal,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase',
  },

  // Button text
  buttonLarge: {
    fontFamily,
    fontSize: fontSize.md,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSize.md * lineHeight.tight,
    letterSpacing: letterSpacing.wide,
  },
  button: {
    fontFamily,
    fontSize: fontSize.base,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSize.base * lineHeight.tight,
    letterSpacing: letterSpacing.wide,
  },
  buttonSmall: {
    fontFamily,
    fontSize: fontSize.sm,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSize.sm * lineHeight.tight,
    letterSpacing: letterSpacing.wide,
  },

  // Score/number display
  scoreDisplay: {
    fontFamily,
    fontSize: fontSize.hero,
    fontWeight: fontWeights.bold,
    lineHeight: fontSize.hero * lineHeight.tight,
    letterSpacing: letterSpacing.tighter,
  },
  scoreMedium: {
    fontFamily,
    fontSize: fontSize['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSize['4xl'] * lineHeight.tight,
    letterSpacing: letterSpacing.tighter,
  },
};

export default {
  fontFamily,
  fontWeights,
  fontSize,
  lineHeight,
  letterSpacing,
  textStyles,
};
