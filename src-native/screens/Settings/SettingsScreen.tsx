/**
 * Abundance Recode - Settings Screen
 *
 * Comprehensive settings management organized by category
 */

import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScreenWrapper,
  GlassCard,
  H2,
  H4,
  Body,
  BodySmall,
  Label,
  Icon,
  IconName,
} from '@components/common';
import { useAppTheme, useTheme } from '@theme/ThemeContext';
import { useUserStore } from '@store/useUserStore';
import { spacing, borderRadius, sizing } from '@theme/spacing';
import { RootStackParamList } from '@navigation/types';

type SettingsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingRowProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
  showChevron = true,
}) => {
  const theme = useAppTheme();

  const content = (
    <View style={styles.settingRow}>
      <View
        style={[
          styles.settingIcon,
          { backgroundColor: theme.colors.glass.background },
        ]}
      >
        <Icon name={icon} size={sizing.iconSm} color={theme.colors.text.secondary} />
      </View>
      <View style={styles.settingText}>
        <Label>{title}</Label>
        {subtitle && (
          <BodySmall color={theme.colors.text.tertiary}>{subtitle}</BodySmall>
        )}
      </View>
      {rightElement || (showChevron && onPress && (
        <Icon
          name="chevronRight"
          size={sizing.iconSm}
          color={theme.colors.text.muted}
        />
      ))}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({ title, children }) => {
  const theme = useAppTheme();

  return (
    <View style={styles.section}>
      <BodySmall color={theme.colors.text.tertiary} style={styles.sectionTitle}>
        {title}
      </BodySmall>
      <GlassCard variant="light" style={styles.sectionCard}>
        {children}
      </GlassCard>
    </View>
  );
};

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsNavigationProp>();
  const theme = useAppTheme();
  const { themeMode, setThemeMode, toggleTheme } = useTheme();
  const { settings, updateSettings, user } = useUserStore();

  const handleVoiceSelector = () => {
    navigation.navigate('VoiceSelector');
  };

  const handleRhythmScheduler = () => {
    navigation.navigate('RhythmScheduler', { fromOnboarding: false });
  };

  const handleManageSubscription = () => {
    navigation.navigate('Paywall');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScreenWrapper padded={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon
            name="chevronLeft"
            size={sizing.iconBase}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
        <H2>Settings</H2>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Preferences */}
        <SettingSection title="PREFERENCES">
          <SettingRow
            icon="bell"
            title="Daily Rhythm"
            subtitle={`${settings.dailyRhythm.morningTime} & ${settings.dailyRhythm.eveningTime}`}
            onPress={handleRhythmScheduler}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="volume"
            title="Voice Selection"
            subtitle={user?.voicePreference || 'Neutral'}
            onPress={handleVoiceSelector}
          />
          <View style={styles.divider} />
          <SettingRow
            icon={themeMode === 'dark' ? 'moon' : 'sun'}
            title="Dark Mode"
            showChevron={false}
            rightElement={
              <Switch
                value={themeMode === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{
                  false: theme.colors.glass.background,
                  true: theme.colors.accent.goldSoft,
                }}
                thumbColor={
                  themeMode === 'dark'
                    ? theme.colors.accent.gold
                    : theme.colors.neutral.gray300
                }
              />
            }
          />
        </SettingSection>

        {/* Notifications */}
        <SettingSection title="NOTIFICATIONS">
          <SettingRow
            icon="sun"
            title="Morning Reminders"
            showChevron={false}
            rightElement={
              <Switch
                value={settings.notifications.morningReminder}
                onValueChange={(value) =>
                  updateSettings({
                    notifications: { morningReminder: value },
                  })
                }
                trackColor={{
                  false: theme.colors.glass.background,
                  true: theme.colors.accent.goldSoft,
                }}
                thumbColor={
                  settings.notifications.morningReminder
                    ? theme.colors.accent.gold
                    : theme.colors.neutral.gray300
                }
              />
            }
          />
          <View style={styles.divider} />
          <SettingRow
            icon="moon"
            title="Evening Reminders"
            showChevron={false}
            rightElement={
              <Switch
                value={settings.notifications.eveningReminder}
                onValueChange={(value) =>
                  updateSettings({
                    notifications: { eveningReminder: value },
                  })
                }
                trackColor={{
                  false: theme.colors.glass.background,
                  true: theme.colors.accent.goldSoft,
                }}
                thumbColor={
                  settings.notifications.eveningReminder
                    ? theme.colors.accent.gold
                    : theme.colors.neutral.gray300
                }
              />
            }
          />
          <View style={styles.divider} />
          <SettingRow
            icon="streak"
            title="Streak Reminders"
            showChevron={false}
            rightElement={
              <Switch
                value={settings.notifications.streakReminders}
                onValueChange={(value) =>
                  updateSettings({
                    notifications: { streakReminders: value },
                  })
                }
                trackColor={{
                  false: theme.colors.glass.background,
                  true: theme.colors.accent.goldSoft,
                }}
                thumbColor={
                  settings.notifications.streakReminders
                    ? theme.colors.accent.gold
                    : theme.colors.neutral.gray300
                }
              />
            }
          />
        </SettingSection>

        {/* Account */}
        <SettingSection title="ACCOUNT">
          <SettingRow
            icon="star"
            title="Subscription"
            subtitle={user?.isPremium ? 'Premium' : 'Free'}
            onPress={handleManageSubscription}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="profile"
            title="Account"
            subtitle={user?.email || 'Not signed in'}
            onPress={() => {}}
          />
        </SettingSection>

        {/* Support */}
        <SettingSection title="SUPPORT">
          <SettingRow
            icon="book"
            title="Help Center"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="chat"
            title="Contact Support"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="heart"
            title="Rate App"
            onPress={() => {}}
          />
        </SettingSection>

        {/* Legal */}
        <SettingSection title="LEGAL">
          <SettingRow
            icon="journal"
            title="Privacy Policy"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="journal"
            title="Terms of Service"
            onPress={() => {}}
          />
        </SettingSection>

        {/* Version */}
        <View style={styles.versionContainer}>
          <BodySmall color={theme.colors.text.muted}>
            Abundance Recode v1.0.0
          </BodySmall>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 44,
    padding: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },
  sectionCard: {
    paddingVertical: spacing.xs,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingText: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginLeft: 52,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
});

export default SettingsScreen;
