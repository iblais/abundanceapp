/**
 * Abundance Recode - Main Application Entry Point
 *
 * Premium mindset and transformation app
 * Built with React Native for iOS and Android
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@theme/ThemeContext';
import { RootNavigator } from '@navigation/RootNavigator';
import { useUserStore } from '@store/useUserStore';
import { useMeditationStore } from '@store/useMeditationStore';
import { MEDITATIONS_DATA } from '@content/meditations';

// Ignore specific warnings in development
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

// Splash screen component (simple version)
const SplashScreen: React.FC = () => {
  return null; // Would render a branded splash screen
};

const AppContent: React.FC = () => {
  const { isLoading, setLoading, setUser } = useUserStore();
  const { setMeditations } = useMeditationStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load meditations library
        setMeditations(MEDITATIONS_DATA as any);

        // Check for existing user session
        // In production, this would check Firebase auth state
        // For now, we'll set up a demo user
        const demoUser = {
          id: 'demo-user',
          email: 'user@abundanceflow.app',
          displayName: 'Abundance Seeker',
          createdAt: new Date().toISOString(),
          isPremium: false,
          voicePreference: 'neutral' as const,
          onboardingComplete: false, // Set to true to skip onboarding
        };

        // Uncomment to auto-login demo user
        // setUser(demoUser);

        setLoading(false);
        setIsReady(true);
      } catch (error) {
        console.error('App initialization error:', error);
        setLoading(false);
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }

  return <RootNavigator />;
};

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ThemeProvider initialMode="dark">
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
