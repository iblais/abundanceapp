/**
 * Abundance Flow - Premium Settings Screen
 *
 * Matches reference with:
 * - Title "Settings" at top
 * - Vertical stack of glass list items
 * - Each item: left icon, label text, right chevron
 * - Rounded glass rectangles with equal spacing
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
  H1,
  Body,
  BodySmall,
  Label,
  Icon,
  IconName,
} from '@components/common';
import { useAppTheme, useTheme } from '@theme/ThemeContext';
import { useUserStore } from '@store/useUserStore';
import { spacing, borderRadius, sizing, layout } from '@theme/spacing';
import { RootStackParamList } from '@navigation/types';

type SettingsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingItemProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
  showChevron = true,
}) => {
  const theme = useAppTheme();

  const content = (
    <GlassCard variant="light" padding="base" style={styles.settingItem}>
      <View style={styles.settingItemContent}>
        {/* Icon container */}
        <View
          style={[
            styles.settingIcon,
            { backgroundColor: theme.colors.halo.violetGlow },
          ]}
        >
          <Icon name={icon} size={sizing.iconSm} color={theme.colors.halo.violet} />
        </View>

        {/* Text content */}
        <View style={styles.settingText}>
          <Label color={theme.colors.text.primary}>{title}</Label>
          {subtitle && (
            <BodySmall color={theme.colors.text.muted}>{subtitle}</BodySmall>
          )}
        </View>

        {/* Right element or chevron */}
        {rightElement || (showChevron && onPress && (
          <Icon
            name="chevronRight"
            size={sizing.iconSm}
            color={theme.colors.text.muted}
          />
        ))}
      </View>
    </GlassCard>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsNavigationProp>();
  const theme = useAppTheme();
  const { themeMode, toggleTheme } = useTheme();
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
        <H1>Settings</H1>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <View style={styles.section}>
          <BodySmall color={theme.colors.text.muted} style={styles.sectionLabel}>
            ACCOUNT
          </BodySmall>
          <View style={styles.itemsContainer}>
            <SettingItem
              icon="profile"
              title="Account"
              subtitle={user?.email || 'Not signed in'}
              onPress={() => {}}
            />
            <SettingItem
              icon="star"
              title="Subscription"
              subtitle={user?.isPremium ? 'Premium' : 'Free'}
              onPress={handleManageSubscription}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <BodySmall color={theme.colors.text.muted} style={styles.sectionLabel}>
            PREFERENCES
          </BodySmall>
          <View style={styles.itemsContainer}>
            <SettingItem
              icon="bell"
              title="Notifications"
              subtitle="Morning & evening reminders"
              onPress={handleRhythmScheduler}
            />
            <SettingItem
              icon="volume"
              title="Voice Selection"
              subtitle={user?.voicePreference || 'Neutral'}
              onPress={handleVoiceSelector}
            />
            <SettingItem
              icon={themeMode === 'dark' ? 'moon' : 'sun'}
              title="Theme"
              subtitle={themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
              showChevron={false}
              rightElement={
                <Switch
                  value={themeMode === 'dark'}
                  onValueChange={toggleTheme}
                  trackColor={{
                    false: theme.colors.glass.fill,
                    true: theme.colors.accent.goldOverlay,
                  }}
                  thumbColor={
                    themeMode === 'dark'
                      ? theme.colors.accent.gold
                      : theme.colors.neutral.gray300
                  }
                />
              }
            />
          </View>
        </View>

        {/* Data & Privacy Section */}
        <View style={styles.section}>
          <BodySmall color={theme.colors.text.muted} style={styles.sectionLabel}>
            DATA & PRIVACY
          </BodySmall>
          <View style={styles.itemsContainer}>
            <SettingItem
              icon="shield"
              title="Data & Privacy"
              onPress={() => {}}
            />
            <SettingItem
              icon="journal"
              title="Terms of Service"
              onPress={() => {}}
            />
            <SettingItem
              icon="journal"
              title="Privacy Policy"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <BodySmall color={theme.colors.text.muted} style={styles.sectionLabel}>
            SUPPORT
          </BodySmall>
          <View style={styles.itemsContainer}>
            <SettingItem
              icon="book"
              title="Help Center"
              onPress={() => {}}
            />
            <SettingItem
              icon="chat"
              title="Contact Support"
              onPress={() => {}}
            />
            <SettingItem
              icon="heart"
              title="Rate App"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Version */}
        <View style={styles.versionContainer}>
          <BodySmall color={theme.colors.text.muted}>
            Abundance Flow v1.0.0
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
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  headerSpacer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing['3xl'],
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
    letterSpacing: 1,
  },
  itemsContainer: {
    gap: spacing.md,
  },
  settingItem: {
    marginBottom: 0,
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  settingText: {
    flex: 1,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
});

export default SettingsScreen;
