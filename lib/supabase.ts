/**
 * Abundance Recode - Supabase Configuration
 *
 * Web app Supabase setup for database and auth
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase client
let supabase: SupabaseClient | null = null;

const getSupabase = (): SupabaseClient | null => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('Supabase not configured, using local storage fallback');
    return null;
  }

  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
};

// Get or create anonymous user ID
export const getAnonymousUserId = async (): Promise<string> => {
  // First check localStorage for existing ID
  const storedId = typeof window !== 'undefined' ? localStorage.getItem('anonymousUserId') : null;
  if (storedId) {
    return storedId;
  }

  // Generate a client-side ID
  const newId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  if (typeof window !== 'undefined') {
    localStorage.setItem('anonymousUserId', newId);
  }
  return newId;
};

// Journal Entry Interface
export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  prompt: string;
  content: string;
  type: 'gratitude' | 'identity' | 'freeform';
  created_at: string;
}

// Chat Message Interface
export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'mentor';
  content: string;
  created_at: string;
}

// Local storage fallback for journals
const localJournalStorage = {
  getEntries: (userId: string): JournalEntry[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(`journals_${userId}`);
    return stored ? JSON.parse(stored) : [];
  },

  saveEntry: (userId: string, entry: JournalEntry): void => {
    if (typeof window === 'undefined') return;
    const entries = localJournalStorage.getEntries(userId);
    entries.unshift(entry);
    localStorage.setItem(`journals_${userId}`, JSON.stringify(entries));
  },

  deleteEntry: (userId: string, entryId: string): void => {
    if (typeof window === 'undefined') return;
    const entries = localJournalStorage.getEntries(userId);
    const filtered = entries.filter(e => e.id !== entryId);
    localStorage.setItem(`journals_${userId}`, JSON.stringify(filtered));
  }
};

// Local storage fallback for chats
const localChatStorage = {
  getMessages: (userId: string): ChatMessage[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(`chats_${userId}`);
    return stored ? JSON.parse(stored) : [];
  },

  saveMessage: (userId: string, message: ChatMessage): void => {
    if (typeof window === 'undefined') return;
    const messages = localChatStorage.getMessages(userId);
    messages.push(message);
    localStorage.setItem(`chats_${userId}`, JSON.stringify(messages));
  },

  clearHistory: (userId: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`chats_${userId}`);
  }
};

// Supabase Service for Journals
export const journalService = {
  // Save a journal entry
  saveEntry: async (userId: string, entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at'>): Promise<{ id: string; error: string | null }> => {
    const entryId = Date.now().toString();
    const fullEntry: JournalEntry = {
      ...entry,
      id: entryId,
      user_id: userId,
      created_at: new Date().toISOString(),
    };

    const client = getSupabase();
    if (!client) {
      // Use local storage fallback
      localJournalStorage.saveEntry(userId, fullEntry);
      return { id: entryId, error: null };
    }

    try {
      const { error } = await client
        .from('journals')
        .insert(fullEntry);

      if (error) {
        console.error('Supabase error, using local fallback:', error);
        localJournalStorage.saveEntry(userId, fullEntry);
      }

      return { id: entryId, error: error?.message || null };
    } catch (error: any) {
      console.error('Error saving journal entry:', error);
      localJournalStorage.saveEntry(userId, fullEntry);
      return { id: entryId, error: error.message };
    }
  },

  // Get all journal entries for a user
  getEntries: async (userId: string, maxEntries: number = 50): Promise<{ entries: JournalEntry[]; error: string | null }> => {
    const client = getSupabase();
    if (!client) {
      // Use local storage fallback
      const entries = localJournalStorage.getEntries(userId).slice(0, maxEntries);
      return { entries, error: null };
    }

    try {
      const { data, error } = await client
        .from('journals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(maxEntries);

      if (error) {
        console.error('Supabase error, using local fallback:', error);
        const entries = localJournalStorage.getEntries(userId).slice(0, maxEntries);
        return { entries, error: error.message };
      }

      return { entries: data || [], error: null };
    } catch (error: any) {
      console.error('Error getting journal entries:', error);
      const entries = localJournalStorage.getEntries(userId).slice(0, maxEntries);
      return { entries, error: error.message };
    }
  },

  // Delete a journal entry
  deleteEntry: async (userId: string, entryId: string): Promise<{ error: string | null }> => {
    const client = getSupabase();
    if (!client) {
      localJournalStorage.deleteEntry(userId, entryId);
      return { error: null };
    }

    try {
      const { error } = await client
        .from('journals')
        .delete()
        .eq('id', entryId)
        .eq('user_id', userId);

      if (error) {
        localJournalStorage.deleteEntry(userId, entryId);
      }

      return { error: error?.message || null };
    } catch (error: any) {
      console.error('Error deleting journal entry:', error);
      localJournalStorage.deleteEntry(userId, entryId);
      return { error: error.message };
    }
  },
};

// Supabase Service for Chat History
export const chatService = {
  // Save a chat message
  saveMessage: async (userId: string, message: Omit<ChatMessage, 'id' | 'user_id' | 'created_at'>): Promise<{ id: string; error: string | null }> => {
    const messageId = Date.now().toString();
    const fullMessage: ChatMessage = {
      ...message,
      id: messageId,
      user_id: userId,
      created_at: new Date().toISOString(),
    };

    const client = getSupabase();
    if (!client) {
      localChatStorage.saveMessage(userId, fullMessage);
      return { id: messageId, error: null };
    }

    try {
      const { error } = await client
        .from('chats')
        .insert(fullMessage);

      if (error) {
        console.error('Supabase error, using local fallback:', error);
        localChatStorage.saveMessage(userId, fullMessage);
      }

      return { id: messageId, error: error?.message || null };
    } catch (error: any) {
      console.error('Error saving chat message:', error);
      localChatStorage.saveMessage(userId, fullMessage);
      return { id: messageId, error: error.message };
    }
  },

  // Get chat history for a user
  getHistory: async (userId: string, maxMessages: number = 100): Promise<{ messages: ChatMessage[]; error: string | null }> => {
    const client = getSupabase();
    if (!client) {
      const messages = localChatStorage.getMessages(userId).slice(-maxMessages);
      return { messages, error: null };
    }

    try {
      const { data, error } = await client
        .from('chats')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(maxMessages);

      if (error) {
        console.error('Supabase error, using local fallback:', error);
        const messages = localChatStorage.getMessages(userId).slice(-maxMessages);
        return { messages, error: error.message };
      }

      return { messages: data || [], error: null };
    } catch (error: any) {
      console.error('Error getting chat history:', error);
      const messages = localChatStorage.getMessages(userId).slice(-maxMessages);
      return { messages, error: error.message };
    }
  },

  // Clear chat history
  clearHistory: async (userId: string): Promise<{ error: string | null }> => {
    const client = getSupabase();
    if (!client) {
      localChatStorage.clearHistory(userId);
      return { error: null };
    }

    try {
      const { error } = await client
        .from('chats')
        .delete()
        .eq('user_id', userId);

      if (error) {
        localChatStorage.clearHistory(userId);
      }

      return { error: error?.message || null };
    } catch (error: any) {
      console.error('Error clearing chat history:', error);
      localChatStorage.clearHistory(userId);
      return { error: error.message };
    }
  },
};

export { supabase };
