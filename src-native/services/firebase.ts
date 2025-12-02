/**
 * Abundance Flow - Firebase Service
 *
 * Firebase configuration and utilities
 */

import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';

// Firebase configuration
// Note: These values should be configured in google-services.json (Android)
// and GoogleService-Info.plist (iOS) for production

// Initialize Firebase (automatic with native modules)

// Auth service
export const authService = {
  getCurrentUser: () => auth().currentUser,

  signInWithEmail: async (email: string, password: string) => {
    try {
      const result = await auth().signInWithEmailAndPassword(email, password);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  signUpWithEmail: async (email: string, password: string) => {
    try {
      const result = await auth().createUserWithEmailAndPassword(email, password);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  signOut: async () => {
    try {
      await auth().signOut();
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  onAuthStateChanged: (callback: (user: any) => void) => {
    return auth().onAuthStateChanged(callback);
  },

  resetPassword: async (email: string) => {
    try {
      await auth().sendPasswordResetEmail(email);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },
};

// Firestore service
export const firestoreService = {
  // User document
  getUserDoc: async (userId: string) => {
    try {
      const doc = await firestore().collection('users').doc(userId).get();
      return { data: doc.data(), error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  setUserDoc: async (userId: string, data: any) => {
    try {
      await firestore().collection('users').doc(userId).set(data, { merge: true });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Progress data
  saveProgress: async (userId: string, date: string, progress: any) => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('progress')
        .doc(date)
        .set(progress, { merge: true });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  getProgressHistory: async (userId: string, days: number) => {
    try {
      const endDate = new Date();
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const snapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('progress')
        .where('date', '>=', startDate.toISOString().split('T')[0])
        .where('date', '<=', endDate.toISOString().split('T')[0])
        .orderBy('date', 'desc')
        .get();

      const data = snapshot.docs.map((doc) => doc.data());
      return { data, error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  },

  // Journal entries
  saveJournalEntry: async (userId: string, entry: any) => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('journal')
        .doc(entry.id)
        .set(entry);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  getJournalEntries: async (userId: string, limit: number = 50) => {
    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('journal')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      const data = snapshot.docs.map((doc) => doc.data());
      return { data, error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  },

  deleteJournalEntry: async (userId: string, entryId: string) => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('journal')
        .doc(entryId)
        .delete();
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },
};

// Messaging service
export const messagingService = {
  requestPermission: async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      return { enabled, error: null };
    } catch (error: any) {
      return { enabled: false, error: error.message };
    }
  },

  getToken: async () => {
    try {
      const token = await messaging().getToken();
      return { token, error: null };
    } catch (error: any) {
      return { token: null, error: error.message };
    }
  },

  onMessage: (callback: (message: any) => void) => {
    return messaging().onMessage(callback);
  },

  onNotificationOpenedApp: (callback: (message: any) => void) => {
    return messaging().onNotificationOpenedApp(callback);
  },
};

// Storage service
export const storageService = {
  uploadImage: async (userId: string, uri: string, fileName: string) => {
    try {
      const reference = storage().ref(`users/${userId}/images/${fileName}`);
      await reference.putFile(uri);
      const url = await reference.getDownloadURL();
      return { url, error: null };
    } catch (error: any) {
      return { url: null, error: error.message };
    }
  },

  deleteImage: async (path: string) => {
    try {
      await storage().ref(path).delete();
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },
};

export default {
  auth: authService,
  firestore: firestoreService,
  messaging: messagingService,
  storage: storageService,
};
