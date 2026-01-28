/**
 * Abundance Recode - Voice Selector Screen
 *
 * Select voice for guided meditations and Inner Mentor
 * Options: Masculine, Feminine, Neutral
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
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
  Button,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { useUserStore } from '@store/useUserStore';
import { spacing, borderRadius, sizing } from '@theme/spacing';
import { RootStackParamList } from '@navigation/types';

type VoiceSelectorNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VoiceSelector'
>;

type VoiceOption = 'masculine' | 'feminine' | 'neutral';

interface VoiceCardProps {
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
  onPreview: () => void;
}

const VoiceCard: React.FC<VoiceCardProps> = ({
  title,
  description,
  isSelected,
  onSelect,
  onPreview,
}) => {
  const theme = useAppTheme();

  return (
    <TouchableOpacity onPress={onSelect} activeOpacity={0.8}>
      <GlassCard
        variant={isSelected ? 'accent' : 'light'}
        style={[
          styles.voiceCard,
          isSelected && {
            borderColor: theme.colors.accent.gold,
            borderWidth: 1,
          },
        ]}
      >
        <View style={styles.voiceContent}>
          <View style={styles.voiceInfo}>
            <View style={styles.voiceHeader}>
              <H4>{title}</H4>
              {isSelected && (
                <Icon
                  name="check"
                  size={sizing.iconSm}
                  color={theme.colors.accent.gold}
                />
              )}
            </View>
            <BodySmall color={theme.colors.text.secondary}>
              {description}
            </BodySmall>
          </View>
          <TouchableOpacity
            onPress={onPreview}
            style={[
              styles.previewButton,
              { backgroundColor: theme.colors.glass.background },
            ]}
          >
            <Icon
              name="play"
              size={sizing.iconSm}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
};

export const VoiceSelectorScreen: React.FC = () => {
  const navigation = useNavigation<VoiceSelectorNavigationProp>();
  const theme = useAppTheme();
  const { user, setVoicePreference } = useUserStore();

  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(
    user?.voicePreference || 'neutral'
  );

  const handlePreview = (voice: VoiceOption) => {
    // Would play audio sample here
    console.log('Preview voice:', voice);
  };

  const handleSave = () => {
    setVoicePreference(selectedVoice);
    navigation.goBack();
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Icon
            name="close"
            size={sizing.iconBase}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <H2 align="center">Choose Your Voice</H2>
          <Body
            align="center"
            color={theme.colors.text.secondary}
            style={styles.subtitle}
          >
            Select the voice for guided meditations and your Inner Mentor.
          </Body>
        </View>

        <View style={styles.voiceOptions}>
          <VoiceCard
            title="Warm Feminine"
            description="A gentle, nurturing voice that guides you with calm warmth."
            isSelected={selectedVoice === 'feminine'}
            onSelect={() => setSelectedVoice('feminine')}
            onPreview={() => handlePreview('feminine')}
          />

          <VoiceCard
            title="Warm Masculine"
            description="A grounded, steady voice with reassuring depth."
            isSelected={selectedVoice === 'masculine'}
            onSelect={() => setSelectedVoice('masculine')}
            onPreview={() => handlePreview('masculine')}
          />

          <VoiceCard
            title="Calm Neutral"
            description="A balanced, soothing voice with universal appeal."
            isSelected={selectedVoice === 'neutral'}
            onSelect={() => setSelectedVoice('neutral')}
            onPreview={() => handlePreview('neutral')}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Save Selection"
            onPress={handleSave}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  closeButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  titleSection: {
    marginTop: spacing.xl,
    marginBottom: spacing['2xl'],
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  voiceOptions: {
    gap: spacing.md,
  },
  voiceCard: {
    paddingVertical: spacing.lg,
  },
  voiceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voiceInfo: {
    flex: 1,
  },
  voiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  previewButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingVertical: spacing['2xl'],
  },
});

export default VoiceSelectorScreen;
