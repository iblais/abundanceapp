/**
 * Abundance Recode - Daily Rhythm Scheduler Screen
 *
 * Set preferred times for morning and evening routines
 * Select active days of the week
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScreenWrapper,
  Button,
  GlassCard,
  H2,
  H3,
  Body,
  Label,
  Icon,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { useUserStore } from '@store/useUserStore';
import { spacing, borderRadius } from '@theme/spacing';
import { RootStackParamList } from '@navigation/types';

type RhythmSchedulerNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RhythmScheduler'
>;
type RhythmSchedulerRouteProp = RouteProp<RootStackParamList, 'RhythmScheduler'>;

const DAYS_OF_WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const DAY_INDICES = [1, 2, 3, 4, 5, 6, 0]; // Monday to Sunday

interface TimePickerCardProps {
  title: string;
  icon: 'sun' | 'moon';
  time: Date;
  onTimeChange: (date: Date) => void;
}

const TimePickerCard: React.FC<TimePickerCardProps> = ({
  title,
  icon,
  time,
  onTimeChange,
}) => {
  const theme = useAppTheme();
  const [showPicker, setShowPicker] = useState(false);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const handleTimeChange = (_: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      onTimeChange(selectedDate);
    }
  };

  return (
    <GlassCard variant="light" style={styles.timeCard}>
      <View style={styles.timeCardHeader}>
        <Icon
          name={icon}
          size={20}
          color={theme.colors.accent.gold}
        />
        <Label style={styles.timeCardTitle}>{title}</Label>
      </View>

      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={[
          styles.timeDisplay,
          { backgroundColor: theme.colors.glass.backgroundLight },
        ]}
        activeOpacity={0.7}
      >
        <H2 color={theme.colors.text.primary}>{formatTime(time)}</H2>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          onChange={handleTimeChange}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        />
      )}
    </GlassCard>
  );
};

interface DaySelectorProps {
  selectedDays: number[];
  onDayToggle: (dayIndex: number) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDays,
  onDayToggle,
}) => {
  const theme = useAppTheme();

  return (
    <View style={styles.daysContainer}>
      {DAYS_OF_WEEK.map((day, index) => {
        const dayIndex = DAY_INDICES[index];
        const isSelected = selectedDays.includes(dayIndex);

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onDayToggle(dayIndex)}
            style={[
              styles.dayButton,
              {
                backgroundColor: isSelected
                  ? theme.colors.accent.goldSoft
                  : theme.colors.glass.background,
                borderColor: isSelected
                  ? theme.colors.accent.gold
                  : 'transparent',
              },
            ]}
            activeOpacity={0.7}
          >
            <Label
              color={
                isSelected
                  ? theme.colors.accent.gold
                  : theme.colors.text.secondary
              }
            >
              {day}
            </Label>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const RhythmSchedulerScreen: React.FC = () => {
  const navigation = useNavigation<RhythmSchedulerNavigationProp>();
  const route = useRoute<RhythmSchedulerRouteProp>();
  const theme = useAppTheme();
  const { settings, updateSettings, completeOnboarding } = useUserStore();

  const fromOnboarding = route.params?.fromOnboarding;

  // Initialize times from settings or defaults
  const parseTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const [morningTime, setMorningTime] = useState(
    parseTime(settings.dailyRhythm.morningTime)
  );
  const [eveningTime, setEveningTime] = useState(
    parseTime(settings.dailyRhythm.eveningTime)
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    settings.dailyRhythm.activeDays
  );

  const handleDayToggle = (dayIndex: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  const formatTimeForStorage = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSaveRhythm = () => {
    updateSettings({
      dailyRhythm: {
        morningTime: formatTimeForStorage(morningTime),
        eveningTime: formatTimeForStorage(eveningTime),
        activeDays: selectedDays,
      },
    });

    if (fromOnboarding) {
      completeOnboarding();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <ScreenWrapper scrollable style={styles.container}>
      <View style={styles.header}>
        <H2 align="center">Set Your{'\n'}Daily Rhythm</H2>
      </View>

      <View style={styles.content}>
        {/* Morning Time */}
        <TimePickerCard
          title="Morning Session"
          icon="sun"
          time={morningTime}
          onTimeChange={setMorningTime}
        />

        {/* Evening Time */}
        <TimePickerCard
          title="Evening Session"
          icon="moon"
          time={eveningTime}
          onTimeChange={setEveningTime}
        />

        {/* Day selector */}
        <DaySelector
          selectedDays={selectedDays}
          onDayToggle={handleDayToggle}
        />
      </View>

      {/* Save button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Save Rhythm"
          onPress={handleSaveRhythm}
          variant="primary"
          size="large"
          fullWidth
          disabled={selectedDays.length === 0}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['2xl'],
    paddingHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.base,
    gap: spacing.lg,
  },
  timeCard: {
    marginBottom: spacing.sm,
  },
  timeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  timeCardTitle: {
    marginLeft: spacing.sm,
  },
  timeDisplay: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  buttonContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
  },
});

export default RhythmSchedulerScreen;
