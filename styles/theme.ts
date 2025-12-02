/**
 * Abundance Flow - Design System Theme
 * Central theme file with all design tokens
 */

export const theme = {
  colors: {
    // Background gradients
    primaryBgTop: '#050716',
    primaryBgMid: '#0A0E1F',
    primaryBgBottom: '#171C3F',

    // Glass surfaces
    glassBg: 'rgba(255, 255, 255, 0.08)',
    glassBgMedium: 'rgba(255, 255, 255, 0.10)',
    glassBgStrong: 'rgba(255, 255, 255, 0.14)',
    glassBgElevated: 'rgba(255, 255, 255, 0.18)',
    glassBorder: 'rgba(255, 255, 255, 0.20)',
    glassBorderStrong: 'rgba(255, 255, 255, 0.35)',
    glassHighlight: 'rgba(255, 255, 255, 0.25)',

    // Accent colors
    gold: '#F4CF77',
    goldLight: '#FAE4A8',
    goldDark: '#E9BB51',
    goldSoft: '#D4B55D',
    goldGlow: 'rgba(244, 207, 119, 0.4)',

    // Secondary accents
    violet: '#9382FF',
    violetSoft: '#A99DD4',
    teal: '#5ECDDE',
    tealSoft: '#7ED4E0',
    coral: '#FF8B8B',

    // Chart colors
    chartGold: '#F4CF77',
    chartViolet: '#9382FF',
    chartTeal: '#5ECDDE',
    chartBlue: '#6B8EFF',
    chartPink: '#FF8BA7',

    // Text
    textPrimary: '#FFFFFF',
    textSecondary: '#C6CBDA',
    textMuted: '#9BA3C3',
    textDisabled: 'rgba(255, 255, 255, 0.35)',

    // Dividers
    divider: 'rgba(255, 255, 255, 0.18)',
    dividerStrong: 'rgba(255, 255, 255, 0.25)',
  },

  radius: {
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '40px',
    full: '999px',
    button: '999px',
  },

  shadows: {
    glass: '0 24px 60px rgba(0, 0, 0, 0.55)',
    glassLight: '0 16px 40px rgba(0, 0, 0, 0.35)',
    glassSubtle: '0 8px 24px rgba(0, 0, 0, 0.25)',
    button: '0 8px 32px rgba(244, 207, 119, 0.35)',
    buttonHover: '0 12px 40px rgba(244, 207, 119, 0.5)',
    glow: '0 0 20px rgba(244, 207, 119, 0.4)',
    glowStrong: '0 0 30px rgba(244, 207, 119, 0.6)',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
  },

  typography: {
    h1: {
      fontSize: '32px',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontSize: '28px',
      fontWeight: 700,
      lineHeight: 1.15,
      letterSpacing: '-0.3px',
    },
    h3: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.2px',
    },
    h4: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: '0',
    },
    body: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    bodySmall: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.5px',
    },
    button: {
      fontSize: '15px',
      fontWeight: 600,
      letterSpacing: '0.5px',
      textTransform: 'uppercase' as const,
    },
    label: {
      fontSize: '13px',
      fontWeight: 500,
      lineHeight: 1.4,
    },
  },

  transitions: {
    fast: '0.15s ease',
    normal: '0.2s ease',
    slow: '0.3s ease',
    smooth: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  blur: {
    sm: '12px',
    md: '20px',
    lg: '24px',
    xl: '32px',
  },
};

export type Theme = typeof theme;
export default theme;
