/**
 * Reality Shift Board Page - Vision Board for Manifestation
 * Opal Dark Aesthetic
 */

import React, { useState, useRef } from 'react';
import { ArrowLeft, Plus, Image, X, Sparkles, Target } from 'lucide-react';
import Link from 'next/link';

interface VisionItem {
  id: string;
  imageUrl: string;
  affirmation: string;
  category: 'wealth' | 'love' | 'health' | 'success' | 'peace' | 'growth';
}

const categories = [
  { id: 'wealth', label: 'Wealth', color: 'from-yellow-400 to-amber-500' },
  { id: 'love', label: 'Love', color: 'from-pink-400 to-rose-500' },
  { id: 'health', label: 'Health', color: 'from-emerald-400 to-green-500' },
  { id: 'success', label: 'Success', color: 'from-purple-400 to-violet-500' },
  { id: 'peace', label: 'Peace', color: 'from-cyan-400 to-blue-500' },
  { id: 'growth', label: 'Growth', color: 'from-orange-400 to-red-500' },
];

const sampleAffirmations = [
  "I am a magnet for abundance and prosperity",
  "Love flows to me effortlessly and abundantly",
  "My body is healthy, vibrant, and full of energy",
  "Success is my natural state of being",
  "I am at peace with all that has happened and all that will be",
  "Every day I grow stronger and wiser",
];

export default function RealityShiftBoardPage() {
  const [visionItems, setVisionItems] = useState<VisionItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('wealth');
  const [newAffirmation, setNewAffirmation] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addVisionItem = () => {
    if (!newAffirmation.trim()) return;

    const newItem: VisionItem = {
      id: Date.now().toString(),
      imageUrl: '', // Placeholder - would use actual image upload
      affirmation: newAffirmation,
      category: selectedCategory as VisionItem['category'],
    };

    setVisionItems(prev => [...prev, newItem]);
    setNewAffirmation('');
    setShowAddModal(false);
  };

  const removeItem = (id: string) => {
    setVisionItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20"
          style={{
            background: 'radial-gradient(ellipse at center top, rgba(147, 51, 234, 0.2) 0%, transparent 70%)'
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
          <h1 className="text-xl font-display text-white">Reality Shift Board</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto p-4 pb-20">
        {/* Intro Section */}
        <div className="glass-card-elevated p-6 mb-6 glow-amethyst">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl text-white">Manifest Your Reality</h2>
              <p className="text-sm text-gray-400">Visualize your dreams into existence</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Your vision board is a powerful tool for manifestation. Add images and affirmations
            that represent your desires. Review them daily to align your vibration with your dreams.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? `bg-gradient-to-r ${cat.color} text-white`
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Vision Board Grid */}
        {visionItems.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <Image className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="font-display text-xl text-white mb-2">Your Board Awaits</h3>
            <p className="text-gray-400 mb-6">Start adding visions to manifest your dreams</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              Add Your First Vision
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {visionItems.map(item => {
              const cat = categories.find(c => c.id === item.category);
              return (
                <div key={item.id} className="glass-card p-4 relative group">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className={`w-full h-24 rounded-xl bg-gradient-to-br ${cat?.color} flex items-center justify-center mb-3`}>
                    <Sparkles className="w-8 h-8 text-white/50" />
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{item.affirmation}</p>
                  <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full bg-gradient-to-r ${cat?.color} text-white`}>
                    {cat?.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card-elevated w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-white">Add Vision</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedCategory === cat.id
                          ? `bg-gradient-to-r ${cat.color} text-white`
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Affirmation</label>
                <textarea
                  value={newAffirmation}
                  onChange={(e) => setNewAffirmation(e.target.value)}
                  placeholder="I am attracting..."
                  rows={3}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Quick Affirmations</label>
                <div className="flex flex-wrap gap-2">
                  {sampleAffirmations.slice(0, 3).map((aff, idx) => (
                    <button
                      key={idx}
                      onClick={() => setNewAffirmation(aff)}
                      className="px-3 py-1.5 rounded-full text-xs bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
                    >
                      {aff.slice(0, 25)}...
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={addVisionItem}
                disabled={!newAffirmation.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold disabled:opacity-40 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
              >
                Add to Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
