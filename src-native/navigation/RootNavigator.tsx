/**
 * Abundance Flow - Root Navigator
 *
 * Main navigation container with all routes
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUserStore } from '@store/useUserStore';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';

// Import screens
import WelcomeScreen from '@screens/Onboarding/WelcomeScreen';
import OnboardingScreen from '@screens/Onboarding/OnboardingScreen';
import RhythmSchedulerScreen from '@screens/Onboarding/RhythmSchedulerScreen';
import MeditationPlayerScreen from '@screens/Meditation/MeditationPlayerScreen';
import JournalEntryScreen from '@screens/Journal/JournalEntryScreen';
import MentorChatScreen from '@screens/Mentor/MentorChatScreen';
import IdentityExerciseScreen from '@screens/Exercises/IdentityExerciseScreen';
import ArticleDetailScreen from '@screens/Learn/ArticleDetailScreen';
import LearnScreen from '@screens/Learn/LearnScreen';
import SoundscapesScreen from '@screens/Soundscapes/SoundscapesScreen';
import VoiceSelectorScreen from '@screens/Settings/VoiceSelectorScreen';
import PaywallScreen from '@screens/Subscription/PaywallScreen';
import SettingsScreen from '@screens/Settings/SettingsScreen';
import ProfileScreen from '@screens/Profile/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { user, isLoading } = useUserStore();
  const isOnboarded = user?.onboardingComplete;

  if (isLoading) {
    // Could return a splash screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        {!isOnboarded ? (
          // Onboarding flow
          <>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ animation: 'fade' }}
            />
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="RhythmScheduler"
              component={RhythmSchedulerScreen}
              options={{ animation: 'slide_from_right' }}
            />
          </>
        ) : null}

        {/* Main app */}
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ animation: 'fade' }}
        />

        {/* Modal screens */}
        <Stack.Screen
          name="MeditationPlayer"
          component={MeditationPlayerScreen}
          options={{
            animation: 'slide_from_bottom',
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="JournalEntry"
          component={JournalEntryScreen}
          options={{
            animation: 'slide_from_bottom',
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="MentorChat"
          component={MentorChatScreen}
          options={{
            animation: 'slide_from_bottom',
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="IdentityExercise"
          component={IdentityExerciseScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="ArticleDetail"
          component={ArticleDetailScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="Learn"
          component={LearnScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="Soundscapes"
          component={SoundscapesScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="VoiceSelector"
          component={VoiceSelectorScreen}
          options={{
            animation: 'slide_from_bottom',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="Paywall"
          component={PaywallScreen}
          options={{
            animation: 'slide_from_bottom',
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
