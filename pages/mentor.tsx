/**
 * Inner Mentor Page - AI-Powered Abundance Guidance
 * Opal Dark Aesthetic
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Sparkles, Brain, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'mentor';
  content: string;
  timestamp: number;
}

const mentorResponses = [
  "Your awareness of this pattern is the first step to transformation. What would shift if you fully believed abundance is your birthright?",
  "Notice how that thought creates contraction. Now imagine the opposite being true. Feel the expansion?",
  "The universe is always reflecting your dominant vibration. What frequency do you want to broadcast?",
  "Every limiting belief was installed by someone who was also limited. You have the power to uninstall it.",
  "What if this obstacle is actually a doorway? How might this challenge redirect you toward something greater?",
  "You are not your thoughts. You are the awareness observing them. From this space, all transformation is possible.",
  "Scarcity is a learned lens. Abundance is your natural state. What would you see differently through abundance eyes?",
  "The same energy that creates worlds flows through you. What would you create if you truly believed this?",
  "Your desires are not random. They are breadcrumbs leading you home to your highest self.",
  "Resistance is information. What is this resistance trying to protect? And is that protection still serving you?"
];

const promptSuggestions = [
  "I'm feeling stuck with...",
  "I keep thinking that I'm not...",
  "My biggest fear about money is...",
  "I struggle to believe I deserve...",
];

export default function InnerMentorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'mentor',
        content: "Welcome, beautiful soul. I'm your Inner Mentor - a reflection of your own infinite wisdom. Share what's weighing on your heart - fears, doubts, or limiting beliefs - and together we'll transform them into stepping stones. What pattern would you like to release today?",
        timestamp: Date.now()
      }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'mentor',
        content: mentorResponses[Math.floor(Math.random() * mentorResponses.length)],
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, responseMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const resetChat = () => {
    setMessages([{
      id: 'welcome-new',
      role: 'mentor',
      content: "Let's begin fresh. What's calling for your attention right now? What belief or pattern is ready to be transformed?",
      timestamp: Date.now()
    }]);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20"
          style={{
            background: 'radial-gradient(ellipse at center top, rgba(6, 182, 212, 0.2) 0%, transparent 70%)'
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-10"
          style={{
            background: 'radial-gradient(ellipse at center bottom, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="flex items-center justify-between px-5 py-4 max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-display text-white">Inner Mentor</h1>
          </div>
          <button
            onClick={resetChat}
            className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
            title="Start new conversation"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-amber-500/20 border border-amber-500/30 text-amber-100'
                  : 'glass-card text-gray-100'
              }`}>
                {msg.role === 'mentor' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-cyan-300">Inner Mentor</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="glass-card rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Prompt Suggestions (shown when no user messages yet) */}
      {messages.filter(m => m.role === 'user').length === 0 && (
        <div className="px-4 pb-2 max-w-2xl mx-auto w-full relative z-10">
          <p className="text-xs text-gray-500 mb-2">Try starting with:</p>
          <div className="flex flex-wrap gap-2">
            {promptSuggestions.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setInput(prompt)}
                className="px-3 py-1.5 rounded-full text-xs bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <footer className="sticky bottom-0 z-40 glass border-t border-white/5 p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && send()}
            placeholder="Share your thoughts..."
            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          <button
            onClick={send}
            disabled={!input.trim() || isTyping}
            className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white disabled:opacity-40 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
