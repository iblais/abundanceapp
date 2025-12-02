/**
 * Abundance Flow - Theme Export
 *
 * Central export for all theme-related modules
 */

import { colors, lightColors } from './colors';
import typography, { textStyles, fontSize, fontWeights } from './typography';
import { spacing, borderRadius, sizing, layout } from './spacing';
import animations, { duration, easing, springConfig, timingConfig, presets } from './animations';

// Theme type definitions
export interface Theme {
  colors: typeof colors;
  typography: typeof typography;
  textStyles: typeof textStyles;
  fontSize: typeof fontSize;
  fontWeights: typeof fontWeights;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  sizing: typeof sizing;
  layout: typeof layout;
  animations: typeof animations;
  isDark: boolean;
}

// Dark theme (default)
export const darkTheme: Theme = {
  colors,
  typography,
  textStyles,
  fontSize,
  fontWeights,
  spacing,
  borderRadius,
  sizing,
  layout,
  animations,
  isDark: true,
};

// Light theme
export const lightTheme: Theme = {
  colors: lightColors,
  typography,
  textStyles,
  fontSize,
  fontWeights,
  spacing,
  borderRadius,
  sizing,
  layout,
  animations,
  isDark: false,
};

// Re-export everything
export {
  colors,
  lightColors,
  typography,
  textStyles,
  fontSize,
  fontWeights,
  spacing,
  borderRadius,
  sizing,
  layout,
  animations,
  duration,
  easing,
  springConfig,
  timingConfig,
  presets,
};

export default darkTheme;
