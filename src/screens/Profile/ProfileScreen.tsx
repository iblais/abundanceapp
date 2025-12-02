/**
 * Abundance Flow - Profile Screen
 *
 * User profile with stats and quick access to settings
 */

import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScreenWrapper,
  GlassCard,
  H2,
  H3,
  H4,
  Body,
  BodySmall,
  Label,
  LabelSmall,
  Icon,
  Button,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { useUserStore } from '@store/useUserStore';
import { useProgressStore } from '@store/useProgressStore';
import { spacing, borderRadius, sizing } from '@theme/spacing';
import { RootStackParamList } from '@navigation/types';

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const theme = useAppTheme();
  const { user } = useUserStore();
  const { streaks, totalMeditations, totalJournalEntries, totalPracticeMinutes } =
    useProgressStore();

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleUpgrade = () => {
    navigation.navigate('Paywall');
  };

  return (
    <ScreenWrapper padded={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <Icon
            name="chevronLeft"
            size={sizing.iconBase}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSettings} style={styles.headerButton}>
          <Icon
            name="settings"
            size={sizing.iconBase}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileSection}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: theme.colors.accent.goldSoft },
            ]}
          >
            <Icon
              name="profile"
              size={sizing.iconXl}
              color={theme.colors.accent.gold}
            />
          </View>
          <H2 style={styles.name}>
            {user?.displayName || 'Abundance Seeker'}
          </H2>
          <BodySmall color={theme.colors.text.secondary}>
            {user?.email || 'Welcome to your journey'}
          </BodySmall>

          {/* Membership status */}
          <View
            style={[
              styles.membershipBadge,
              {
                backgroundColor: user?.isPremium
                  ? theme.colors.accent.goldSoft
                  : theme.colors.glass.background,
              },
            ]}
          >
            <Icon
              name="star"
              size={sizing.iconXs}
              color={
                user?.isPremium
                  ? theme.colors.accent.gold
                  : theme.colors.text.secondary
              }
            />
            <LabelSmall
              color={
                user?.isPremium
                  ? theme.colors.accent.gold
                  : theme.colors.text.secondary
              }
            >
              {user?.isPremium ? 'Premium Member' : 'Free Member'}
            </LabelSmall>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <GlassCard variant="light" style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <H3 color={theme.colors.accent.gold}>
                  {streaks.overall.currentStreak}
                </H3>
                <LabelSmall color={theme.colors.text.tertiary}>
                  Day Streak
                </LabelSmall>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <H3 color={theme.colors.primary.lavender}>
                  {totalMeditations}
                </H3>
                <LabelSmall color={theme.colors.text.tertiary}>
                  Meditations
                </LabelSmall>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <H3 color={theme.colors.semantic.info}>
                  {Math.round(totalPracticeMinutes / 60)}h
                </H3>
                <LabelSmall color={theme.colors.text.tertiary}>
                  Practice
                </LabelSmall>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Upgrade Card (if not premium) */}
        {!user?.isPremium && (
          <View style={styles.upgradeSection}>
            <GlassCard variant="accent" style={styles.upgradeCard}>
              <View style={styles.upgradeContent}>
                <Icon
                  name="sparkle"
                  size={sizing.iconMd}
                  color={theme.colors.accent.gold}
                />
                <View style={styles.upgradeText}>
                  <H4>Unlock Full Potential</H4>
                  <BodySmall color={theme.colors.text.secondary}>
                    Get unlimited meditations, identity exercises, and more.
                  </BodySmall>
                </View>
              </View>
              <Button
                title="Upgrade"
                onPress={handleUpgrade}
                variant="primary"
                size="medium"
              />
            </GlassCard>
          </View>
        )}

        {/* Quick Links */}
        <View style={styles.linksSection}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Main', { screen: 'Progress' })}
            style={styles.linkItem}
          >
            <GlassCard variant="light" style={styles.linkCard}>
              <View style={styles.linkContent}>
                <View
                  style={[
                    styles.linkIcon,
                    { backgroundColor: theme.colors.accent.goldSoft },
                  ]}
                >
                  <Icon
                    name="chart"
                    size={sizing.iconBase}
                    color={theme.colors.accent.gold}
                  />
                </View>
                <Label>View Progress</Label>
                <Icon
                  name="chevronRight"
                  size={sizing.iconSm}
                  color={theme.colors.text.muted}
                />
              </View>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSettings} style={styles.linkItem}>
            <GlassCard variant="light" style={styles.linkCard}>
              <View style={styles.linkContent}>
                <View
                  style={[
                    styles.linkIcon,
                    { backgroundColor: 'rgba(139, 123, 184, 0.2)' },
                  ]}
                >
                  <Icon
                    name="settings"
                    size={sizing.iconBase}
                    color={theme.colors.primary.lavender}
                  />
                </View>
                <Label>Settings</Label>
                <Icon
                  name="chevronRight"
                  size={sizing.iconSm}
                  color={theme.colors.text.muted}
                />
              </View>
            </GlassCard>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerButton: {
    padding: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  name: {
    marginBottom: spacing.xs,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginTop: spacing.md,
  },
  statsSection: {
    marginBottom: spacing.xl,
  },
  statsCard: {
    paddingVertical: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  upgradeSection: {
    marginBottom: spacing.xl,
  },
  upgradeCard: {
    paddingVertical: spacing.lg,
  },
  upgradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  upgradeText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  linksSection: {
    gap: spacing.md,
  },
  linkItem: {},
  linkCard: {
    paddingVertical: spacing.base,
  },
  linkContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
});

export default ProfileScreen;
