/**
 * Abundance Flow - Premium Dashboard Screen
 *
 * Matches reference screen exactly:
 * - Top: Large circular alignment meter with score
 * - Below: Stacked glass tiles (Morning Visioneering, Quick Shifts, Reality Shift Board)
 * - Bottom: Glass bottom nav (handled by TabNavigator)
 */

import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScreenWrapper,
  GlassCard,
  ProgressRing,
  H4,
  BodySmall,
  Icon,
  IconName,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { useProgressStore } from '@store/useProgressStore';
import { useUserStore } from '@store/useUserStore';
import { spacing, borderRadius, sizing, layout } from '@theme/spacing';
import { textStyles } from '@theme/typography';
import { duration } from '@theme/animations';
import { RootStackParamList } from '@navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type DashboardNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ActionTileProps {
  title: string;
  subtitle: string;
  icon: IconName;
  onPress: () => void;
  delay: number;
}

// Premium glass action tile matching reference
const ActionTile: React.FC<ActionTileProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  delay,
}) => {
  const theme = useAppTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: duration.normal }));
    translateY.value = withDelay(delay, withTiming(0, { duration: duration.normal }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <GlassCard
        variant="light"
        onPress={onPress}
        style={styles.actionTile}
        padding="lg"
      >
        <View style={styles.tileContent}>
          {/* Icon with subtle glow */}
          <View
            style={[
              styles.tileIconContainer,
              { backgroundColor: theme.colors.halo.violetGlow },
            ]}
          >
            <Icon
              name={icon}
              size={sizing.iconBase}
              color={theme.colors.halo.violet}
            />
          </View>

          {/* Text content */}
          <View style={styles.tileTextContainer}>
            <H4 style={styles.tileTitle}>{title}</H4>
            <BodySmall color={theme.colors.text.muted}>
              {subtitle}
            </BodySmall>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
};

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const theme = useAppTheme();
  const { user } = useUserStore();
  const { todayScore, calculateAlignmentScore } = useProgressStore();

  // Recalculate score on mount
  useEffect(() => {
    calculateAlignmentScore();
  }, []);

  const alignmentScore = todayScore || calculateAlignmentScore();

  const handleNavigateToMeditation = () => {
    navigation.navigate('MeditationPlayer', {
      meditationId: 'morning-visioneering',
      duration: 10,
    });
  };

  const handleNavigateToQuickShift = () => {
    // Navigate to quick shifts
  };

  const handleNavigateToShiftBoard = () => {
    navigation.navigate('Main', { screen: 'Progress' });
  };

  const handleNavigateToSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <ScreenWrapper padded={false}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Settings icon in top right */}
        <View style={styles.topBar}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            onPress={handleNavigateToSettings}
            style={styles.settingsButton}
          >
            <Icon
              name="settings"
              size={sizing.iconBase}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
        </View>

        {/* Large Alignment Score Ring */}
        <View style={styles.scoreSection}>
          <ProgressRing
            progress={alignmentScore}
            size="xl"
            showGlow
            animated
          >
            <View style={styles.scoreContent}>
              <Text style={[textStyles.scoreDisplay, styles.scoreNumber]}>
                {alignmentScore}
              </Text>
              <BodySmall color={theme.colors.text.secondary}>
                Alignment Score
              </BodySmall>
            </View>
          </ProgressRing>
        </View>

        {/* Action Tiles */}
        <View style={styles.tilesSection}>
          <ActionTile
            title="Morning Visioneering"
            subtitle="Guided Focus for 10 mins."
            icon="sparkle"
            onPress={handleNavigateToMeditation}
            delay={100}
          />

          <ActionTile
            title="Quick Shifts"
            subtitle="Instant reset exercises."
            icon="refresh"
            onPress={handleNavigateToQuickShift}
            delay={200}
          />

          <ActionTile
            title="Reality Shift Board"
            subtitle="Track your progress & insights."
            icon="grid"
            onPress={handleNavigateToShiftBoard}
            delay={300}
          />
        </View>

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreSection: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    marginBottom: spacing.xl,
  },
  scoreContent: {
    alignItems: 'center',
  },
  scoreNumber: {
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  tilesSection: {
    gap: spacing.base,
  },
  actionTile: {
    marginBottom: 0,
  },
  tileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tileIconContainer: {
    width: sizing.iconContainerLg,
    height: sizing.iconContainerLg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  tileTextContainer: {
    flex: 1,
  },
  tileTitle: {
    marginBottom: spacing.xs,
  },
  bottomPadding: {
    height: sizing.tabBarHeight + spacing['3xl'],
  },
});

export default DashboardScreen;
