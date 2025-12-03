/**
 * Abundance Flow - Premium Settings Screen
 *
 * Matches reference with:
 * - Large "Settings" title at top left
 * - Vertical stack of 5 glass list items
 * - Each item: left icon, label text, right chevron
 * - Clean, minimal layout with equal spacing
 */

import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScreenWrapper,
  GlassCard,
  H1,
  Body,
  Icon,
  IconName,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { useUserStore } from '@store/useUserStore';
import { spacing, borderRadius, sizing, layout } from '@theme/spacing';
import { RootStackParamList } from '@navigation/types';

type SettingsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingItemProps {
  icon: IconName;
  title: string;
  onPress: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, title, onPress }) => {
  const theme = useAppTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <GlassCard variant="light" padding="lg" style={styles.settingItem}>
        <View style={styles.settingItemContent}>
          {/* Icon */}
          <Icon
            name={icon}
            size={sizing.iconBase}
            color={theme.colors.text.secondary}
            style={styles.settingIcon}
          />

          {/* Label */}
          <Body color={theme.colors.text.primary} style={styles.settingLabel}>
            {title}
          </Body>

          {/* Chevron */}
          <Icon
            name="chevronRight"
            size={sizing.iconSm}
            color={theme.colors.text.muted}
          />
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
};

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsNavigationProp>();
  const theme = useAppTheme();
  const { user, logout } = useUserStore();

  const handleAccount = () => {
    navigation.navigate('Profile');
  };

  const handleNotifications = () => {
    navigation.navigate('RhythmScheduler', { fromOnboarding: false });
  };

  const handleVoiceSelection = () => {
    navigation.navigate('VoiceSelector');
  };

  const handleTheme = () => {
    // Could open a theme picker modal
    Alert.alert(
      'Theme',
      'Theme settings coming soon. The app automatically uses dark mode for the best experience.',
      [{ text: 'OK' }]
    );
  };

  const handleDataPrivacy = () => {
    Linking.openURL('https://abundanceflow.app/privacy');
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
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <H1>Settings</H1>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Settings Items */}
        <View style={styles.itemsContainer}>
          <SettingItem
            icon="profile"
            title="Account"
            onPress={handleAccount}
          />
          <SettingItem
            icon="bell"
            title="Notifications"
            onPress={handleNotifications}
          />
          <SettingItem
            icon="volume"
            title="Voice Selection"
            onPress={handleVoiceSelection}
          />
          <SettingItem
            icon="moon"
            title="Theme"
            onPress={handleTheme}
          />
          <SettingItem
            icon="shield"
            title="Data & Privacy"
            onPress={handleDataPrivacy}
          />
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
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing['3xl'],
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
    marginRight: spacing.base,
  },
  settingLabel: {
    flex: 1,
    fontWeight: '500',
  },
});

export default SettingsScreen;
