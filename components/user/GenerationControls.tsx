'use client';

import React from 'react';
import { Sliders, Sparkles, MessageSquare } from 'lucide-react';
import { PromptItem } from './PromptSelector';

export interface GenerationParameters {
  guidanceScale: number;
  strength: number;
  steps: number;
  customPrompt: string;
}

interface GenerationControlsProps {
  selectedPrompt: PromptItem | null;
  parameters: GenerationParameters;
  onChangeParameters: (params: GenerationParameters) => void;
}

export function GenerationControls({
  selectedPrompt,
  parameters,
  onChangeParameters,
}: GenerationControlsProps) {
  if (!selectedPrompt) return null;

  const handleSliderChange = (key: keyof GenerationParameters, val: number | string) => {
    onChangeParameters({
      ...parameters,
      [key]: val,
    });
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-purple-400" />
          Fine-tune Generation Settings
        </label>
        <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
          Preset: {selectedPrompt.title}
        </span>
      </div>

      {/* Custom Prompt Tweak */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-cyan-400" /> Additional Details / Prompt Modifier
          </span>
          <span className="text-[10px] text-slate-500">Optional</span>
        </label>
        <textarea
          value={parameters.customPrompt}
          onChange={(e) => handleSliderChange('customPrompt', e.target.value)}
          placeholder={`Add extra details (e.g. "golden hour lighting, cinematic atmosphere")...`}
          rows={2}
          className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/60 resize-none transition-colors"
        />
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        {/* Image Strength */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-300">
            <span>Image Influence (Strength)</span>
            <span className="font-mono text-purple-400">{parameters.strength.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.95"
            step="0.05"
            value={parameters.strength}
            onChange={(e) => handleSliderChange('strength', parseFloat(e.target.value))}
            className="w-full accent-purple-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
          />
          <p className="text-[10px] text-slate-500">Higher = more creative AI transformation</p>
        </div>

        {/* Guidance Scale */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-300">
            <span>Prompt Guidance (CFG)</span>
            <span className="font-mono text-purple-400">{parameters.guidanceScale.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="15.0"
            step="0.5"
            value={parameters.guidanceScale}
            onChange={(e) => handleSliderChange('guidanceScale', parseFloat(e.target.value))}
            className="w-full accent-purple-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
          />
          <p className="text-[10px] text-slate-500">Higher = strictly follow prompt text</p>
        </div>

        {/* Inference Steps */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-300">
            <span>Quality Steps</span>
            <span className="font-mono text-purple-400">{parameters.steps}</span>
          </div>
          <input
            type="range"
            min="15"
            max="50"
            step="5"
            value={parameters.steps}
            onChange={(e) => handleSliderChange('steps', parseInt(e.target.value))}
            className="w-full accent-purple-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
          />
          <p className="text-[10px] text-slate-500">Higher = finer rendering quality</p>
        </div>
      </div>
    </div>
  );
}
