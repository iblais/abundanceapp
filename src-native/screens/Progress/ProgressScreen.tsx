/**
 * Abundance Flow - Progress Screen
 *
 * Visualizes user journey with charts and metrics
 * Alignment Score, streaks, and practices completed
 */

import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScreenWrapper,
  GlassCard,
  ProgressRing,
  H2,
  H3,
  H4,
  Body,
  BodySmall,
  Label,
  LabelSmall,
  ScoreDisplay,
  Icon,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { useProgressStore } from '@store/useProgressStore';
import { spacing, borderRadius, sizing } from '@theme/spacing';
import { RootStackParamList } from '@navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - spacing.lg * 2 - spacing.lg * 2;

type ProgressNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
  progress?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  color,
  progress,
}) => {
  const theme = useAppTheme();

  return (
    <GlassCard variant="light" style={styles.statCard}>
      <View style={styles.statContent}>
        {progress !== undefined ? (
          <ProgressRing progress={progress} size="small" showGlow={false}>
            <H4 color={theme.colors.text.primary}>{value}</H4>
          </ProgressRing>
        ) : (
          <H3 color={color}>{value}</H3>
        )}
        <LabelSmall
          color={theme.colors.text.secondary}
          style={styles.statTitle}
        >
          {title}
        </LabelSmall>
        {subtitle && (
          <LabelSmall color={theme.colors.text.muted}>{subtitle}</LabelSmall>
        )}
      </View>
    </GlassCard>
  );
};

interface StreakDisplayProps {
  type: string;
  current: number;
  longest: number;
  icon: string;
  color: string;
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({
  type,
  current,
  longest,
  icon,
  color,
}) => {
  const theme = useAppTheme();

  return (
    <GlassCard variant="light" style={styles.streakCard}>
      <View style={styles.streakHeader}>
        <View style={[styles.streakIcon, { backgroundColor: `${color}20` }]}>
          <Icon name={icon as any} size={sizing.iconBase} color={color} />
        </View>
        <View style={styles.streakInfo}>
          <H4>{type}</H4>
          <BodySmall color={theme.colors.text.tertiary}>
            Best: {longest} days
          </BodySmall>
        </View>
      </View>
      <View style={styles.streakValue}>
        <ScoreDisplay color={color}>{current}</ScoreDisplay>
        <LabelSmall color={theme.colors.text.secondary}>
          day streak
        </LabelSmall>
      </View>
    </GlassCard>
  );
};

export const ProgressScreen: React.FC = () => {
  const navigation = useNavigation<ProgressNavigationProp>();
  const theme = useAppTheme();
  const {
    streaks,
    totalMeditations,
    totalJournalEntries,
    totalPracticeMinutes,
    getProgressHistory,
    getWeeklyStats,
  } = useProgressStore();

  // Get last 28 days of progress
  const progressHistory = useMemo(() => getProgressHistory(28), []);
  const weeklyStats = useMemo(() => getWeeklyStats(), []);

  // Prepare chart data
  const chartData = useMemo(() => {
    const last7Days = progressHistory.slice(-7);
    return {
      labels: last7Days.map((d) => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
      }),
      datasets: [
        {
          data: last7Days.map((d) => d.alignmentScore || 0),
          color: () => theme.colors.accent.gold,
          strokeWidth: 2,
        },
      ],
    };
  }, [progressHistory, theme]);

  // Calculate coherence and consistency
  const coherence = useMemo(() => {
    const lastWeek = progressHistory.slice(-7);
    const daysWithPractice = lastWeek.filter(
      (d) => d.meditationsCompleted > 0 || d.journalEntriesCount > 0
    ).length;
    return Math.round((daysWithPractice / 7) * 100);
  }, [progressHistory]);

  const consistency = useMemo(() => {
    const lastMonth = progressHistory;
    const daysWithPractice = lastMonth.filter(
      (d) => d.meditationsCompleted > 0 || d.journalEntriesCount > 0
    ).length;
    return Math.round((daysWithPractice / 28) * 100);
  }, [progressHistory]);

  return (
    <ScreenWrapper padded={false}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <H2>Your Progress</H2>
        </View>

        {/* Weekly Chart */}
        <View style={styles.chartSection}>
          <GlassCard variant="light" style={styles.chartCard}>
            <Label style={styles.chartLabel}>Alignment Score</Label>
            <LineChart
              data={chartData}
              width={CHART_WIDTH}
              height={160}
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: 'transparent',
                backgroundGradientTo: 'transparent',
                decimalPlaces: 0,
                color: () => theme.colors.accent.gold,
                labelColor: () => theme.colors.text.tertiary,
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: theme.colors.accent.gold,
                },
                propsForBackgroundLines: {
                  stroke: theme.colors.glass.border,
                  strokeDasharray: '',
                },
              }}
              bezier
              style={styles.chart}
              withInnerLines={true}
              withOuterLines={false}
              withShadow={false}
            />
            <LabelSmall
              color={theme.colors.text.muted}
              align="center"
            >
              Last 4 Weeks
            </LabelSmall>
          </GlassCard>
        </View>

        {/* Weekly Stats Row */}
        <View style={styles.statsRow}>
          <GlassCard variant="light" style={styles.weeklyStatCard}>
            <View style={styles.weeklyStatContent}>
              <Icon
                name="chart"
                size={sizing.iconSm}
                color={theme.colors.primary.lavender}
              />
              <View style={styles.weeklyStatText}>
                <H4>{weeklyStats.averageScore}</H4>
                <LabelSmall color={theme.colors.text.tertiary}>
                  Avg Score
                </LabelSmall>
              </View>
            </View>
          </GlassCard>

          <GlassCard variant="light" style={styles.weeklyStatCard}>
            <View style={styles.weeklyStatContent}>
              <Icon
                name="check"
                size={sizing.iconSm}
                color={theme.colors.semantic.success}
              />
              <View style={styles.weeklyStatText}>
                <H4>{weeklyStats.totalPractices}</H4>
                <LabelSmall color={theme.colors.text.tertiary}>
                  Practices
                </LabelSmall>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Coherence and Consistency */}
        <View style={styles.metricsRow}>
          <StatCard
            title="Coherence"
            value={`${coherence}%`}
            progress={coherence}
            color={theme.colors.primary.lavender}
          />
          <StatCard
            title="Consistency"
            value={`${consistency}%`}
            progress={consistency}
            color={theme.colors.accent.gold}
          />
        </View>

        {/* Streaks Section */}
        <View style={styles.streaksSection}>
          <H4 style={styles.sectionTitle}>Streaks</H4>
          <StreakDisplay
            type="Overall"
            current={streaks.overall.currentStreak}
            longest={streaks.overall.longestStreak}
            icon="streak"
            color={theme.colors.accent.gold}
          />
          <StreakDisplay
            type="Meditation"
            current={streaks.meditation.currentStreak}
            longest={streaks.meditation.longestStreak}
            icon="meditation"
            color={theme.colors.primary.lavender}
          />
          <StreakDisplay
            type="Journaling"
            current={streaks.journal.currentStreak}
            longest={streaks.journal.longestStreak}
            icon="journal"
            color={theme.colors.semantic.info}
          />
        </View>

        {/* Total Stats */}
        <View style={styles.totalStats}>
          <H4 style={styles.sectionTitle}>All Time</H4>
          <View style={styles.totalRow}>
            <GlassCard variant="light" style={styles.totalCard}>
              <H3 color={theme.colors.accent.gold}>{totalMeditations}</H3>
              <LabelSmall color={theme.colors.text.tertiary}>
                Meditations
              </LabelSmall>
            </GlassCard>
            <GlassCard variant="light" style={styles.totalCard}>
              <H3 color={theme.colors.primary.lavender}>
                {totalJournalEntries}
              </H3>
              <LabelSmall color={theme.colors.text.tertiary}>
                Journal Entries
              </LabelSmall>
            </GlassCard>
            <GlassCard variant="light" style={styles.totalCard}>
              <H3 color={theme.colors.semantic.info}>
                {Math.round(totalPracticeMinutes / 60)}h
              </H3>
              <LabelSmall color={theme.colors.text.tertiary}>
                Practice Time
              </LabelSmall>
            </GlassCard>
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
    paddingBottom: spacing['2xl'],
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  chartSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  chartCard: {
    paddingVertical: spacing.lg,
  },
  chartLabel: {
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  weeklyStatCard: {
    flex: 1,
    paddingVertical: spacing.base,
  },
  weeklyStatContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  weeklyStatText: {
    flex: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  statContent: {
    alignItems: 'center',
  },
  statTitle: {
    marginTop: spacing.sm,
  },
  streaksSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.base,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  streakInfo: {},
  streakValue: {
    alignItems: 'flex-end',
  },
  totalStats: {
    paddingHorizontal: spacing.lg,
  },
  totalRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  totalCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  bottomPadding: {
    height: sizing.tabBarHeight + spacing['2xl'],
  },
});

export default ProgressScreen;
