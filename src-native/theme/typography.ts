/**
 * Abundance Flow - Premium Typography System
 *
 * Font Family: SF Pro Display, SF Pro Text, Inter
 * iOS-style calm typography matching the reference screens
 */

import { Platform, TextStyle } from 'react-native';

// Font family with platform-specific fallbacks (SF Pro on iOS, Inter on Android)
const fontFamily = Platform.select({
  ios: 'SF Pro Display',
  android: 'Inter',
  default: 'Inter',
});

const fontFamilyText = Platform.select({
  ios: 'SF Pro Text',
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

// Type scale matching the spec exactly
export const fontSize = {
  xs: 11,
  sm: 14,      // Body Small / Caption
  base: 16,    // Body (exact from spec)
  md: 18,
  lg: 20,      // H3 (card titles, metrics)
  xl: 24,      // H2 (section titles)
  '2xl': 28,
  '3xl': 32,   // H1 (main titles)
  '4xl': 40,
  '5xl': 48,
  '6xl': 56,
  hero: 72,    // Large score display
  mega: 82,    // Alignment score number
} as const;

// Line heights (spec: 1.3–1.45)
export const lineHeight = {
  tightest: 1.0,
  tight: 1.15,
  snug: 1.3,      // For big titles
  normal: 1.4,    // Default body text
  relaxed: 1.45,  // Descriptions
  loose: 1.6,
} as const;

// Letter spacing (tighter for big titles as per spec)
export const letterSpacing = {
  tightest: -0.8,  // Big display numbers
  tighter: -0.5,   // Titles
  tight: -0.3,     // Headings
  normal: 0,       // Body
  wide: 0.25,
  wider: 0.5,
  widest: 1,
} as const;

// Pre-defined text styles matching reference screens exactly
export const textStyles: Record<string, TextStyle> = {
  // Display styles - for hero sections and large numbers
  displayLarge: {
    fontFamily,
    fontSize: fontSize.mega,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSize.mega * lineHeight.tightest,
    letterSpacing: letterSpacing.tightest,
  },
  displayMedium: {
    fontFamily,
    fontSize: fontSize.hero,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSize.hero * lineHeight.tight,
    letterSpacing: letterSpacing.tightest,
  },
  displaySmall: {
    fontFamily,
    fontSize: fontSize['5xl'],
    fontWeight: fontWeights.semibold,
    lineHeight: fontSize['5xl'] * lineHeight.tight,
    letterSpacing: letterSpacing.tighter,
  },

  // H1: 32, semibold (main titles like "Abundance Flow", "Your Progress")
  h1: {
    fontFamily,
    fontSize: fontSize['3xl'],  // 32
    fontWeight: fontWeights.semibold,
    lineHeight: fontSize['3xl'] * lineHeight.snug,
    letterSpacing: letterSpacing.tighter,
  },

  // H2: 24, semibold (section titles, screen headers)
  h2: {
    fontFamily,
    fontSize: fontSize.xl,  // 24
    fontWeight: fontWeights.semibold,
    lineHeight: fontSize.xl * lineHeight.snug,
    letterSpacing: letterSpacing.tight,
  },

  // H3: 20, medium (card titles, metrics labels)
  h3: {
    fontFamily,
    fontSize: fontSize.lg,  // 20
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.lg * lineHeight.snug,
    letterSpacing: letterSpacing.tight,
  },

  // H4: 18, medium (smaller card titles)
  h4: {
    fontFamily,
    fontSize: fontSize.md,  // 18
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.md * lineHeight.snug,
    letterSpacing: letterSpacing.normal,
  },

  // H5: 16, medium (subtle headers)
  h5: {
    fontFamily,
    fontSize: fontSize.base,  // 16
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.base * lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Body: 16, regular
  bodyLarge: {
    fontFamily: fontFamilyText,
    fontSize: fontSize.md,  // 18
    fontWeight: fontWeights.regular,
    lineHeight: fontSize.md * lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontFamily: fontFamilyText,
    fontSize: fontSize.base,  // 16 (exact from spec)
    fontWeight: fontWeights.regular,
    lineHeight: fontSize.base * lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },

  // Body Small / Caption: 14, regular
  bodySmall: {
    fontFamily: fontFamilyText,
    fontSize: fontSize.sm,  // 14 (exact from spec)
    fontWeight: fontWeights.regular,
    lineHeight: fontSize.sm * lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },

  // Label styles
  labelLarge: {
    fontFamily: fontFamilyText,
    fontSize: fontSize.base,
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.base * lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  label: {
    fontFamily: fontFamilyText,
    fontSize: fontSize.sm,  // 14
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.sm * lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  labelSmall: {
    fontFamily: fontFamilyText,
    fontSize: fontSize.xs,  // 11
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.xs * lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },

  // Caption: 14, regular (same as bodySmall)
  caption: {
    fontFamily: fontFamilyText,
    fontSize: fontSize.sm,  // 14
    fontWeight: fontWeights.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Overline text
  overline: {
    fontFamily: fontFamilyText,
    fontSize: fontSize.xs,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSize.xs * lineHeight.normal,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
  },

  // Button text: 16, medium (spec says medium weight)
  buttonLarge: {
    fontFamily,
    fontSize: fontSize.md,  // 18
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.md * lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  button: {
    fontFamily,
    fontSize: fontSize.base,  // 16 (exact from spec)
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.base * lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  buttonSmall: {
    fontFamily,
    fontSize: fontSize.sm,  // 14
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.sm * lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },

  // Score/number display (alignment score like "82")
  scoreDisplay: {
    fontFamily,
    fontSize: fontSize.mega,  // 82 - matches the alignment score
    fontWeight: fontWeights.semibold,
    lineHeight: fontSize.mega * lineHeight.tightest,
    letterSpacing: letterSpacing.tightest,
  },
  scoreMedium: {
    fontFamily,
    fontSize: fontSize['5xl'],  // 48
    fontWeight: fontWeights.semibold,
    lineHeight: fontSize['5xl'] * lineHeight.tight,
    letterSpacing: letterSpacing.tighter,
  },
  scoreSmall: {
    fontFamily,
    fontSize: fontSize['4xl'],  // 40
    fontWeight: fontWeights.semibold,
    lineHeight: fontSize['4xl'] * lineHeight.tight,
    letterSpacing: letterSpacing.tighter,
  },
};

export default {
  fontFamily,
  fontFamilyText,
  fontWeights,
  fontSize,
  lineHeight,
  letterSpacing,
  textStyles,
};
