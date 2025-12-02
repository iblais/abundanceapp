/**
 * Abundance Flow - Tab Navigator
 *
 * Bottom tab navigation with custom styling
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
        color={focused ? theme.colors.accent.gold : color}
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
      {Platform.OS === 'ios' ? (
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType={theme.isDark ? 'dark' : 'light'}
          blurAmount={20}
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: theme.colors.primary.cosmicBlueDeep },
          ]}
        />
      )}
      <LinearGradient
        colors={[
          'rgba(255,255,255,0.08)',
          'rgba(255,255,255,0.04)',
          'rgba(255,255,255,0.02)',
        ]}
        style={[StyleSheet.absoluteFill, { borderRadius: borderRadius.xl }]}
      />
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
          bottom: spacing.base,
          left: spacing.base,
          right: spacing.base,
          height: 64,
          borderRadius: borderRadius.full,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarBackground: () => <TabBarBackground />,
        tabBarActiveTintColor: theme.colors.accent.gold,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
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
    paddingTop: spacing.sm,
  },
  iconContainerFocused: {},
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: spacing.xs,
  },
  tabBarBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    overflow: 'hidden',
  },
});

export default TabNavigator;
