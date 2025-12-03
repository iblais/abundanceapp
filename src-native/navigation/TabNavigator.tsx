/**
 * Abundance Flow - Premium Tab Navigator
 *
 * Bottom tab navigation with glass styling:
 * - Semi-transparent glass bar on gradient background
 * - Icons in textSecondary, active state accentGold or haloViolet
 * - Small pill/dot indicator under active icon
 */

import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { useAppTheme } from '@theme/ThemeContext';
import { sizing, borderRadius, spacing } from '@theme/spacing';
import { Icon, IconName } from '@components/common';
import { MainTabParamList } from './types';

// Import screens
import DashboardScreen from '@screens/Dashboard/DashboardScreen';
import MeditationLibraryScreen from '@screens/Meditation/MeditationLibraryScreen';
import JournalListScreen from '@screens/Journal/JournalListScreen';
import ProgressScreen from '@screens/Progress/ProgressScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabIconProps {
  name: IconName;
  focused: boolean;
  color: string;
}

const TabIcon: React.FC<TabIconProps> = ({ name, focused, color }) => {
  const theme = useAppTheme();

  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <Icon
        name={name}
        size={sizing.iconBase}
        color={focused ? theme.colors.accent.gold : theme.colors.text.muted}
      />
      {focused && (
        <View
          style={[
            styles.indicator,
            { backgroundColor: theme.colors.accent.gold },
          ]}
        />
      )}
    </View>
  );
};

const TabBarBackground: React.FC = () => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBarBackground,
        {
          height: sizing.tabBarHeight + insets.bottom,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {/* Blur effect for iOS */}
      {Platform.OS === 'ios' && (
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={25}
        />
      )}

      {/* Glass gradient overlay */}
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.12)',
          'rgba(255, 255, 255, 0.06)',
          'rgba(255, 255, 255, 0.03)',
        ]}
        style={StyleSheet.absoluteFill}
      />

      {/* Top border line */}
      <View style={styles.topBorder} />
    </View>
  );
};

export const TabNavigator: React.FC = () => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: sizing.tabBarHeight + insets.bottom,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarBackground: () => <TabBarBackground />,
        tabBarActiveTintColor: theme.colors.accent.gold,
        tabBarInactiveTintColor: theme.colors.text.muted,
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="home" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Meditations"
        component={MeditationLibraryScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="meditation" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalListScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="journal" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="chart" focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.md,
  },
  iconContainerFocused: {},
  indicator: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: spacing.xs,
  },
  tabBarBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Platform.OS === 'android' ? 'rgba(5, 8, 25, 0.95)' : 'transparent',
    overflow: 'hidden',
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default TabNavigator;
