/**
 * Abundance Recode - Firebase Configuration
 *
 * Web app Firebase setup for Firestore, Auth, etc.
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, orderBy, limit, Timestamp, deleteDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// Firebase configuration
// In production, these should be environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'abundance-recode.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'abundance-recode',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'abundance-recode.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abc123',
};

// Initialize Firebase (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

// Get or create anonymous user ID
export const getAnonymousUserId = async (): Promise<string> => {
  // First check localStorage for existing ID
  const storedId = typeof window !== 'undefined' ? localStorage.getItem('anonymousUserId') : null;
  if (storedId) {
    return storedId;
  }

  // Try anonymous auth, fallback to generated ID
  try {
    const userCredential = await signInAnonymously(auth);
    const userId = userCredential.user.uid;
    if (typeof window !== 'undefined') {
      localStorage.setItem('anonymousUserId', userId);
    }
    return userId;
  } catch (error) {
    // Fallback: generate a client-side ID
    const fallbackId = 'local_' + Math.random().toString(36).substr(2, 9);
    if (typeof window !== 'undefined') {
      localStorage.setItem('anonymousUserId', fallbackId);
    }
    return fallbackId;
  }
};

// Journal Entry Interface
export interface JournalEntry {
  id: string;
  date: string;
  prompt: string;
  content: string;
  createdAt: Timestamp | Date;
  type: 'gratitude' | 'identity' | 'freeform';
}

// Chat Message Interface
export interface ChatMessage {
  id: string;
  role: 'user' | 'mentor';
  content: string;
  createdAt: Timestamp | Date;
}

// Firestore Service for Journals
export const journalService = {
  // Save a journal entry
  saveEntry: async (userId: string, entry: Omit<JournalEntry, 'id' | 'createdAt'>): Promise<{ id: string; error: string | null }> => {
    try {
      const entryId = Date.now().toString();
      const journalRef = doc(db, 'users', userId, 'journals', entryId);

      await setDoc(journalRef, {
        ...entry,
        id: entryId,
        createdAt: Timestamp.now(),
      });

      return { id: entryId, error: null };
    } catch (error: any) {
      console.error('Error saving journal entry:', error);
      return { id: '', error: error.message };
    }
  },

  // Get all journal entries for a user
  getEntries: async (userId: string, maxEntries: number = 50): Promise<{ entries: JournalEntry[]; error: string | null }> => {
    try {
      const journalsRef = collection(db, 'users', userId, 'journals');
      const q = query(journalsRef, orderBy('createdAt', 'desc'), limit(maxEntries));
      const snapshot = await getDocs(q);

      const entries = snapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as JournalEntry[];

      return { entries, error: null };
    } catch (error: any) {
      console.error('Error getting journal entries:', error);
      return { entries: [], error: error.message };
    }
  },

  // Delete a journal entry
  deleteEntry: async (userId: string, entryId: string): Promise<{ error: string | null }> => {
    try {
      const entryRef = doc(db, 'users', userId, 'journals', entryId);
      await deleteDoc(entryRef);
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting journal entry:', error);
      return { error: error.message };
    }
  },
};

// Firestore Service for Chat History
export const chatService = {
  // Save a chat message
  saveMessage: async (userId: string, message: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<{ id: string; error: string | null }> => {
    try {
      const messageId = Date.now().toString();
      const chatRef = doc(db, 'users', userId, 'chats', messageId);

      await setDoc(chatRef, {
        ...message,
        id: messageId,
        createdAt: Timestamp.now(),
      });

      return { id: messageId, error: null };
    } catch (error: any) {
      console.error('Error saving chat message:', error);
      return { id: '', error: error.message };
    }
  },

  // Get chat history for a user
  getHistory: async (userId: string, maxMessages: number = 100): Promise<{ messages: ChatMessage[]; error: string | null }> => {
    try {
      const chatsRef = collection(db, 'users', userId, 'chats');
      const q = query(chatsRef, orderBy('createdAt', 'asc'), limit(maxMessages));
      const snapshot = await getDocs(q);

      const messages = snapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as ChatMessage[];

      return { messages, error: null };
    } catch (error: any) {
      console.error('Error getting chat history:', error);
      return { messages: [], error: error.message };
    }
  },

  // Clear chat history
  clearHistory: async (userId: string): Promise<{ error: string | null }> => {
    try {
      const chatsRef = collection(db, 'users', userId, 'chats');
      const snapshot = await getDocs(chatsRef);

      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      return { error: null };
    } catch (error: any) {
      console.error('Error clearing chat history:', error);
      return { error: error.message };
    }
  },
};

export { db, auth };
