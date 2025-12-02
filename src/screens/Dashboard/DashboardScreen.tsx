/**
 * Abundance Flow - Dashboard Screen
 *
 * Primary home screen with Alignment Score hero
 * Quick access to daily practices
 */

import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
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
  H3,
  H4,
  Body,
  BodySmall,
  Label,
  LabelSmall,
  ScoreDisplay,
  Icon,
  IconName,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { useProgressStore } from '@store/useProgressStore';
import { useUserStore } from '@store/useUserStore';
import { spacing, borderRadius, sizing } from '@theme/spacing';
import { duration } from '@theme/animations';
import { RootStackParamList } from '@navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type DashboardNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  icon: IconName;
  onPress: () => void;
  delay: number;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
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
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <GlassCard variant="light" style={styles.actionCard}>
          <View style={styles.actionCardContent}>
            <View
              style={[
                styles.actionIconContainer,
                { backgroundColor: theme.colors.accent.goldSoft },
              ]}
            >
              <Icon
                name={icon}
                size={sizing.iconBase}
                color={theme.colors.accent.gold}
              />
            </View>
            <View style={styles.actionTextContainer}>
              <H4>{title}</H4>
              <BodySmall color={theme.colors.text.tertiary}>
                {subtitle}
              </BodySmall>
            </View>
          </View>
          <Icon
            name="chevronRight"
            size={sizing.iconSm}
            color={theme.colors.text.muted}
          />
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const theme = useAppTheme();
  const { user } = useUserStore();
  const { todayScore, streaks, calculateAlignmentScore } = useProgressStore();

  // Recalculate score on mount
  useEffect(() => {
    const score = calculateAlignmentScore();
  }, []);

  const alignmentScore = todayScore || calculateAlignmentScore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleNavigateToMeditation = () => {
    navigation.navigate('MeditationPlayer', {
      meditationId: 'morning-visioneering',
      duration: 8,
    });
  };

  const handleNavigateToQuickShift = () => {
    // Quick shift is part of dashboard, could expand to dedicated screen
  };

  const handleNavigateToShiftBoard = () => {
    navigation.navigate('Main', { screen: 'Journal' });
  };

  const handleNavigateToMentor = () => {
    navigation.navigate('MentorChat');
  };

  const handleNavigateToProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <ScreenWrapper padded={false}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Body color={theme.colors.text.secondary}>{getGreeting()}</Body>
            <H3>{user?.displayName || 'Welcome back'}</H3>
          </View>
          <TouchableOpacity onPress={handleNavigateToProfile}>
            <View
              style={[
                styles.profileButton,
                { backgroundColor: theme.colors.glass.background },
              ]}
            >
              <Icon
                name="profile"
                size={sizing.iconBase}
                color={theme.colors.text.primary}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Alignment Score Card */}
        <View style={styles.scoreSection}>
          <GlassCard variant="accent" style={styles.scoreCard}>
            <ProgressRing
              progress={alignmentScore}
              size="large"
              showGlow
            >
              <View style={styles.scoreContent}>
                <ScoreDisplay>{alignmentScore}</ScoreDisplay>
                <LabelSmall color={theme.colors.text.secondary}>
                  Alignment Score
                </LabelSmall>
              </View>
            </ProgressRing>
          </GlassCard>
        </View>

        {/* Streak indicator */}
        <View style={styles.streakContainer}>
          <GlassCard variant="light" style={styles.streakCard} noPadding>
            <View style={styles.streakContent}>
              <Icon
                name="streak"
                size={sizing.iconSm}
                color={theme.colors.accent.gold}
              />
              <Label style={styles.streakText}>
                {streaks.overall.currentStreak} day streak
              </Label>
            </View>
          </GlassCard>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <QuickActionCard
            title="Morning Visioneering"
            subtitle="Guided Focus for 10 mins."
            icon="sparkle"
            onPress={handleNavigateToMeditation}
            delay={100}
          />

          <QuickActionCard
            title="Quick Shifts"
            subtitle="Instant reset exercises."
            icon="refresh"
            onPress={handleNavigateToQuickShift}
            delay={200}
          />

          <QuickActionCard
            title="Reality Shift Board"
            subtitle="Track your progress & insights."
            icon="grid"
            onPress={handleNavigateToShiftBoard}
            delay={300}
          />

          <QuickActionCard
            title="Inner Mentor"
            subtitle="Chat with your AI guide."
            icon="chat"
            onPress={handleNavigateToMentor}
            delay={400}
          />
        </View>

        {/* Quick Shift Tools Grid */}
        <View style={styles.quickShiftSection}>
          <H4 style={styles.sectionTitle}>Quick Shifts</H4>
          <View style={styles.quickShiftGrid}>
            <TouchableOpacity style={styles.quickShiftItem}>
              <GlassCard variant="light" style={styles.quickShiftCard}>
                <Icon
                  name="sparkle"
                  size={sizing.iconMd}
                  color={theme.colors.primary.lavender}
                />
                <LabelSmall style={styles.quickShiftLabel}>
                  60s Breath
                </LabelSmall>
              </GlassCard>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickShiftItem}>
              <GlassCard variant="light" style={styles.quickShiftCard}>
                <Icon
                  name="heart"
                  size={sizing.iconMd}
                  color={theme.colors.accent.gold}
                />
                <LabelSmall style={styles.quickShiftLabel}>
                  Gratitude
                </LabelSmall>
              </GlassCard>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickShiftItem}>
              <GlassCard variant="light" style={styles.quickShiftCard}>
                <Icon
                  name="meditation"
                  size={sizing.iconMd}
                  color={theme.colors.semantic.info}
                />
                <LabelSmall style={styles.quickShiftLabel}>
                  Grounding
                </LabelSmall>
              </GlassCard>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  scoreCard: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    width: '100%',
  },
  scoreContent: {
    alignItems: 'center',
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  streakCard: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    marginLeft: spacing.sm,
  },
  actionsSection: {
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.base,
  },
  actionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  actionTextContainer: {
    flex: 1,
  },
  quickShiftSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.base,
  },
  quickShiftGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickShiftItem: {
    flex: 1,
  },
  quickShiftCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  quickShiftLabel: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  bottomPadding: {
    height: sizing.tabBarHeight + spacing['2xl'],
  },
});

export default DashboardScreen;
