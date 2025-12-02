/**
 * Abundance Flow - Notifications Service
 *
 * Manages push notifications and local reminders
 */

import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { messagingService } from './firebase';

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, string>;
}

// Notification types
export type NotificationType =
  | 'morning_reminder'
  | 'evening_reminder'
  | 'streak_reminder'
  | 'milestone'
  | 'general';

// Notification messages
export const NOTIFICATION_MESSAGES: Record<NotificationType, NotificationData[]> = {
  morning_reminder: [
    {
      title: 'Good Morning',
      body: 'Start your day with intention. Your morning practice awaits.',
    },
    {
      title: 'Rise and Align',
      body: 'Take a few minutes to connect with your highest self.',
    },
    {
      title: 'New Day, New Possibilities',
      body: "How do you want to show up today? Let's set your intention.",
    },
  ],
  evening_reminder: [
    {
      title: 'Evening Reflection',
      body: 'Take a moment to integrate your day and prepare for restful sleep.',
    },
    {
      title: 'Time to Unwind',
      body: 'Your evening practice is ready. End the day with gratitude.',
    },
    {
      title: 'Day Complete',
      body: 'Celebrate your progress today. What are you grateful for?',
    },
  ],
  streak_reminder: [
    {
      title: "Don't Break Your Streak!",
      body: "You're doing great. Keep the momentum going today.",
    },
    {
      title: 'Your Streak Awaits',
      body: 'A few minutes of practice will keep your streak alive.',
    },
  ],
  milestone: [
    {
      title: 'Milestone Achieved!',
      body: 'Your consistency is creating real change. Well done.',
    },
  ],
  general: [
    {
      title: 'Abundance Flow',
      body: 'Your transformation journey continues.',
    },
  ],
};

// Get random message for type
export const getRandomMessage = (type: NotificationType): NotificationData => {
  const messages = NOTIFICATION_MESSAGES[type];
  return messages[Math.floor(Math.random() * messages.length)];
};

// Request notification permissions
export const requestNotificationPermission = async (): Promise<boolean> => {
  const { enabled } = await messagingService.requestPermission();
  return enabled;
};

// Get FCM token
export const getFCMToken = async (): Promise<string | null> => {
  const { token } = await messagingService.getToken();
  return token;
};

// Handle foreground messages
export const setupForegroundNotifications = (
  onNotification: (notification: NotificationData) => void
) => {
  return messagingService.onMessage(async (remoteMessage) => {
    if (remoteMessage.notification) {
      onNotification({
        title: remoteMessage.notification.title || '',
        body: remoteMessage.notification.body || '',
        data: remoteMessage.data as Record<string, string>,
      });
    }
  });
};

// Handle notification tap when app is in background
export const setupBackgroundNotificationHandler = (
  onNotificationTap: (data: Record<string, string>) => void
) => {
  return messagingService.onNotificationOpenedApp((remoteMessage) => {
    if (remoteMessage.data) {
      onNotificationTap(remoteMessage.data as Record<string, string>);
    }
  });
};

// Check for initial notification (app opened from notification)
export const getInitialNotification = async (): Promise<Record<
  string,
  string
> | null> => {
  const remoteMessage = await messaging().getInitialNotification();
  if (remoteMessage?.data) {
    return remoteMessage.data as Record<string, string>;
  }
  return null;
};

// Schedule local notification (would need additional library like notifee)
export const scheduleLocalNotification = async (
  notification: NotificationData,
  triggerTime: Date
): Promise<void> => {
  // This would use a library like notifee for local notifications
  // For now, we'll rely on FCM for push notifications
  console.log('Schedule notification:', notification, 'at:', triggerTime);
};

// Cancel scheduled notification
export const cancelScheduledNotification = async (
  notificationId: string
): Promise<void> => {
  // Cancel logic would go here
  console.log('Cancel notification:', notificationId);
};

// Update notification settings on server
export const updateNotificationSettings = async (
  userId: string,
  settings: {
    morningReminder: boolean;
    eveningReminder: boolean;
    streakReminders: boolean;
    milestones: boolean;
    morningTime?: string;
    eveningTime?: string;
  }
): Promise<void> => {
  // This would update the user's notification preferences in Firestore
  // The backend would then handle scheduling/canceling notifications
  console.log('Update notification settings:', settings);
};

export default {
  requestPermission: requestNotificationPermission,
  getToken: getFCMToken,
  setupForeground: setupForegroundNotifications,
  setupBackground: setupBackgroundNotificationHandler,
  getInitial: getInitialNotification,
  scheduleLocal: scheduleLocalNotification,
  cancelScheduled: cancelScheduledNotification,
  updateSettings: updateNotificationSettings,
  getRandomMessage,
};
