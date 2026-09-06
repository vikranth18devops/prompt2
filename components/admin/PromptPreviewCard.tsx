'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, SlidersHorizontal, Eye } from 'lucide-react';
import { cardHoverVariants } from '@/lib/animations';

interface PromptPreviewCardProps {
  title: string;
  description: string;
  promptTemplate: string;
  previewImageUrl: string;
  styleTag?: string;
  guidanceScale?: number;
  strength?: number;
  categoryName?: string;
  status?: string;
}

export function PromptPreviewCard({
  title,
  description,
  promptTemplate,
  previewImageUrl,
  styleTag = 'Photorealistic',
  guidanceScale = 7.5,
  strength = 0.75,
  categoryName = 'Selected Category',
  status = 'ACTIVE',
}: PromptPreviewCardProps) {
  const displayTitle = title.trim() || 'Untitled Prompt';
  const displayDesc = description.trim() || 'Prompt description will appear here as you type...';
  const displayImg = previewImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1 font-semibold text-purple-400">
          <Eye className="w-3.5 h-3.5" /> Live User Card Preview
        </span>
        <span className="text-[10px] font-mono bg-purple-500/10 px-2 py-0.5 rounded text-purple-300 border border-purple-500/20">
          Status: {status}
        </span>
      </div>

      <motion.div
        variants={cardHoverVariants}
        initial="initial"
        whileHover="hover"
        className="relative rounded-2xl overflow-hidden border border-purple-500/40 bg-slate-900 shadow-2xl p-4 flex flex-col justify-between min-h-[220px]"
      >
        {/* Background Image Preview */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displayImg} alt="Live Card Preview" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300 bg-purple-500/20 backdrop-blur-md border border-purple-500/30 px-2.5 py-0.5 rounded-lg">
              {styleTag}
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded-md border border-slate-800">
              {categoryName}
            </span>
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-100 line-clamp-1">{displayTitle}</h4>
            <p className="text-xs text-slate-300 line-clamp-2 mt-1">{displayDesc}</p>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 font-mono">
            <SlidersHorizontal className="w-3 h-3 text-purple-400" /> CFG: {guidanceScale}
          </span>
          <span className="font-mono">Strength: {strength}</span>
        </div>
      </motion.div>
    </div>
  );
}
