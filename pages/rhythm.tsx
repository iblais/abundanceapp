/**
 * Daily Rhythm Scheduler Page
 * Set morning and evening practice times
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GlassCard, Button, Icons } from '../components';
import { useUser } from '../context/UserContext';
import styles from '../styles/rhythm.module.css';

// Format time to 12-hour format
const formatTime12h = (time24: string): string => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export default function RhythmScheduler() {
  const router = useRouter();
  const { user, setRhythm, completeOnboarding } = useUser();
  const [morningTime, setMorningTime] = useState('07:00');
  const [eveningTime, setEveningTime] = useState('21:00');
  const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [morningEnabled, setMorningEnabled] = useState(true);
  const [eveningEnabled, setEveningEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  useEffect(() => {
    setMounted(true);
    // If already set up, use saved values
    if (user.rhythmSet) {
      setMorningTime(user.morningTime);
      setEveningTime(user.eveningTime);
      setSelectedDays(user.selectedDays);
    }
  }, [user]);

  const toggleDay = (index: number) => {
    if (selectedDays.includes(index)) {
      setSelectedDays(selectedDays.filter(d => d !== index));
    } else {
      setSelectedDays([...selectedDays, index].sort());
    }
  };

  const handleSaveRhythm = () => {
    setRhythm(morningTime, eveningTime, selectedDays);
    completeOnboarding();
    router.push('/dashboard');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Set Your<br />Daily Rhythm
        </h1>
        <p className={styles.subtitle}>
          Consistency creates transformation. Choose when you&apos;ll practice.
        </p>

        {/* Morning Rhythm Card */}
        <GlassCard className={styles.timeCard}>
          <div className={styles.timeCardHeader}>
            <span className={styles.timeIcon}>{Icons.sun}</span>
            <span>Morning Rhythm</span>
          </div>
          <div className={styles.timeDisplay}>
            <input
              type="time"
              value={morningTime}
              onChange={(e) => setMorningTime(e.target.value)}
              className={styles.timeInputHidden}
            />
            <span className={styles.timeValue}>{formatTime12h(morningTime)}</span>
          </div>
          <div className={styles.toggleContainer}>
            <span className={styles.toggleLabel}>Enable morning reminders</span>
            <button
              className={`${styles.toggle} ${morningEnabled ? styles.toggleActive : ''}`}
              onClick={() => setMorningEnabled(!morningEnabled)}
              aria-label="Toggle morning reminders"
            />
          </div>
        </GlassCard>

        {/* Evening Rhythm Card */}
        <GlassCard className={styles.timeCard}>
          <div className={styles.timeCardHeader}>
            <span className={styles.timeIcon}>{Icons.moon}</span>
            <span>Evening Rhythm</span>
          </div>
          <div className={styles.timeDisplay}>
            <input
              type="time"
              value={eveningTime}
              onChange={(e) => setEveningTime(e.target.value)}
              className={styles.timeInputHidden}
            />
            <span className={styles.timeValue}>{formatTime12h(eveningTime)}</span>
          </div>
          <div className={styles.toggleContainer}>
            <span className={styles.toggleLabel}>Enable evening reminders</span>
            <button
              className={`${styles.toggle} ${eveningEnabled ? styles.toggleActive : ''}`}
              onClick={() => setEveningEnabled(!eveningEnabled)}
              aria-label="Toggle evening reminders"
            />
          </div>
        </GlassCard>

        {/* Days Selector */}
        <div className={styles.daysSection}>
          <p className={styles.daysLabel}>Practice Days</p>
          <div className={styles.daysSelector}>
            {days.map((day, index) => (
              <button
                key={index}
                className={`${styles.dayButton} ${selectedDays.includes(index) ? styles.dayButtonActive : ''}`}
                onClick={() => toggleDay(index)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className={styles.buttonContainer}>
          <Button
            onClick={handleSaveRhythm}
            fullWidth
            disabled={selectedDays.length === 0}
          >
            Save Rhythm
          </Button>
        </div>
      </main>
    </div>
  );
}
