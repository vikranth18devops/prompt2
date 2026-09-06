'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Download, RefreshCw, Sparkles, SlidersHorizontal, Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageComparisonSliderProps {
  inputImageUrl: string;
  outputImageUrl: string;
  promptTitle?: string;
  onRegenerate: () => void;
}

export function ImageComparisonSlider({
  inputImageUrl,
  outputImageUrl,
  promptTitle,
  onRegenerate,
}: ImageComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(outputImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-${promptTitle ? promptTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'ai-image'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(outputImageUrl, '_blank');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(outputImageUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Generated Result: {promptTitle || 'AI Masterpiece'}
          </h3>
          <p className="text-xs text-slate-400">Drag center slider left & right to compare Original vs AI Output</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            {isCopied ? 'URL Copied' : 'Share'}
          </Button>
          <Button variant="secondary" size="sm" onClick={onRegenerate}>
            <RefreshCw className="w-4 h-4 text-purple-400" /> Regenerate
          </Button>
          <Button variant="primary" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4" /> Download 8K
          </Button>
        </div>
      </div>

      {/* Comparison Canvas */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={(e) => handleMove(e.clientX)}
        className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden border-2 border-purple-500/40 bg-slate-950 shadow-2xl select-none cursor-ew-resize"
      >
        {/* Output Generated Image (Full Layer) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={outputImageUrl}
          alt="AI Generated Output"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Input Original Image (Clipped Layer) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={inputImageUrl}
            alt="Original Input"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: containerRef.current?.offsetWidth || '100%', maxWidth: 'none' }}
          />
        </div>

        {/* Vertical Divider Slider Line */}
        <div
          className="absolute inset-y-0 w-1 bg-white shadow-[0_0_12px_rgba(168,85,247,0.8)] pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-purple-900 shadow-xl flex items-center justify-center border-2 border-purple-600">
            <SlidersHorizontal className="w-4 h-4 rotate-90" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-semibold text-slate-300 border border-slate-700/60 pointer-events-none">
          Original Input
        </div>
        <div className="absolute top-4 right-4 bg-purple-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-semibold text-purple-300 border border-purple-500/40 pointer-events-none flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Generated
        </div>
      </div>
    </div>
  );
}
