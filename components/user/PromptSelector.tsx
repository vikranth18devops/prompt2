'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, RefreshCw, Wand2, SlidersHorizontal, Info } from 'lucide-react';

export interface PromptItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  promptTemplate: string;
  negativePrompt?: string | null;
  previewImageUrl: string;
  categoryId: string;
  isActive: boolean;
  defaultConfig: {
    guidanceScale: number;
    strength: number;
    steps: number;
    style: string;
  };
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
}

interface PromptSelectorProps {
  selectedPrompt: PromptItem | null;
  onSelectPrompt: (prompt: PromptItem) => void;
}

export function PromptSelector({ selectedPrompt, onSelectPrompt }: PromptSelectorProps) {
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchPromptsAndCategories = async () => {
    try {
      const [promptsRes, catRes] = await Promise.all([
        fetch('/api/prompts'),
        fetch('/api/categories'),
      ]);

      const promptsData = await promptsRes.json();
      const catData = await catRes.json();

      if (promptsData.prompts && promptsData.prompts.length > 0) {
        setPrompts(promptsData.prompts);
        // Auto select first active prompt if none selected
        if (!selectedPrompt) {
          const activeFirst = promptsData.prompts.find((p: PromptItem) => p.isActive) || promptsData.prompts[0];
          if (activeFirst) onSelectPrompt(activeFirst);
        }
      }
      if (catData.categories) setCategories(catData.categories);
    } catch (err) {
      console.error('Error fetching prompts:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPromptsAndCategories();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPromptsAndCategories();
  };

  const filteredPrompts = selectedCategory === 'all'
    ? prompts.filter((p) => p.isActive)
    : prompts.filter((p) => p.isActive && p.categoryId === selectedCategory);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-purple-400" />
          2. Select AI Prompt & Style Presets
        </label>
        <button
          onClick={handleRefresh}
          className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          title="Refresh active prompts from database"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync Database
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
          }`}
        >
          All Prompts ({prompts.filter((p) => p.isActive).length})
        </button>
        {categories.map((cat) => {
          const count = prompts.filter((p) => p.isActive && p.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/40 opacity-80">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Prompts Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredPrompts.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400">
          <Info className="w-8 h-8 text-purple-400 mx-auto mb-2 opacity-60" />
          <p className="text-sm font-medium">No active prompts in this category yet.</p>
          <p className="text-xs text-slate-500 mt-1">Activate or add new prompts in the Admin Panel!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPrompts.map((prompt) => {
            const isSelected = selectedPrompt?.id === prompt.id;
            return (
              <motion.div
                key={prompt.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectPrompt(prompt)}
                className={`relative rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 flex flex-col justify-between p-3 min-h-[170px] ${
                  isSelected
                    ? 'border-purple-400 bg-purple-950/30 ring-2 ring-purple-500/50 shadow-xl shadow-purple-950/50'
                    : 'border-slate-800 hover:border-purple-500/40 bg-slate-900/80 hover:bg-slate-900'
                }`}
              >
                {/* Card Background Preview Image overlay */}
                <div className="absolute inset-0 z-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prompt.previewImageUrl}
                    alt={prompt.title}
                    className="w-full h-full object-cover opacity-20 hover:opacity-30 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-purple-300 bg-purple-500/20 backdrop-blur-md border border-purple-500/30 px-2 py-0.5 rounded-lg">
                      {prompt.defaultConfig?.style || 'AI Style'}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-lg">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100 line-clamp-1">{prompt.title}</h4>
                    <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">{prompt.description}</p>
                  </div>
                </div>

                <div className="relative z-10 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3 text-purple-400" />
                    Scale: {prompt.defaultConfig?.guidanceScale ?? 7.5}
                  </span>
                  <span>Strength: {prompt.defaultConfig?.strength ?? 0.75}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
