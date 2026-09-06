'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Sparkles, CheckCircle, ShieldCheck, Zap, Layers } from 'lucide-react';

interface ProcessingVisualizerProps {
  progress: number;
  status: 'PENDING' | 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  promptTitle?: string;
}

export function ProcessingVisualizer({ progress, status, promptTitle }: ProcessingVisualizerProps) {
  const getStageMessage = () => {
    if (progress < 20) return 'Queued on Azure Service Bus AI Pipeline...';
    if (progress < 50) return 'Analyzing image facial structure & features...';
    if (progress < 80) return 'Applying Stable Diffusion latent transformations...';
    if (progress < 100) return 'Enhancing 8K resolution & rendering final lighting...';
    return 'Generation finished! Syncing result...';
  };

  return (
    <div className="w-full rounded-2xl bg-slate-950/90 border border-purple-500/30 p-8 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center space-y-6 min-h-[360px]">
      {/* Background Animated Gradient Ring */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Glowing Orbital Animation */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Outer Pulsing Ring */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/40"
        />

        {/* Inner Counter Rotating Glow Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border-2 border-cyan-400/50 border-t-transparent shadow-lg shadow-purple-500/50"
        />

        {/* Core Icon */}
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-purple-500/40"
        >
          <Cpu className="w-8 h-8 animate-pulse" />
        </motion.div>

        {/* Sparkle Float particles */}
        <motion.div
          animate={{ y: [-4, 4, -4], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-2 -right-2 text-amber-400"
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>
      </div>

      {/* Status Details */}
      <div className="relative z-10 space-y-2 max-w-md">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
          <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          Status: {status}
        </span>
        <h3 className="text-xl font-bold text-slate-100 tracking-tight">
          Generating {promptTitle ? `"${promptTitle}"` : 'AI Image'}
        </h3>
        <p className="text-xs text-slate-400 transition-all font-mono">{getStageMessage()}</p>
      </div>

      {/* Progress Bar & Percentage */}
      <div className="relative z-10 w-full max-w-md space-y-2">
        <div className="flex justify-between text-xs font-medium text-slate-300 font-mono">
          <span className="flex items-center gap-1 text-purple-400">
            <Layers className="w-3.5 h-3.5" /> Pipeline Progress
          </span>
          <span className="text-cyan-400 font-bold">{progress}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800 p-0.5 shadow-inner">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 shadow-md shadow-purple-500/50"
          />
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-900 w-full justify-center">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        Powered by Azure Service Bus & GPU Compute Node
      </div>
    </div>
  );
}
