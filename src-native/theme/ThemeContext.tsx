/**
 * Abundance Recode - Theme Context Provider
 *
 * Provides theme context throughout the app
 * Supports dark mode (default) and light mode
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import { darkTheme, lightTheme, Theme } from './index';

type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialMode = 'dark', // Dark is the default
}) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialMode);

  // Determine if dark mode based on theme mode setting
  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme !== 'light';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  // Get the appropriate theme
  const theme = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);

  // Toggle between dark and light
  const toggleTheme = useCallback(() => {
    setThemeMode(current => {
      if (current === 'dark') return 'light';
      if (current === 'light') return 'dark';
      // If system, toggle based on current resolved value
      return isDark ? 'light' : 'dark';
    });
  }, [isDark]);

  const value = useMemo(
    () => ({
      theme,
      themeMode,
      isDark,
      setThemeMode,
      toggleTheme,
    }),
    [theme, themeMode, isDark, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook to get just the theme object
export const useAppTheme = (): Theme => {
  const { theme } = useTheme();
  return theme;
};

// Hook to get just the colors
export const useColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

export default ThemeContext;
