'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Image as ImageIcon, X, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  onImageSelected: (url: string) => void;
  selectedImageUrl: string | null;
  onClear: () => void;
}

const SAMPLE_INPUT_IMAGES = [
  {
    name: 'Portrait Model',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Cyberpunk Cyber',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Anime Character',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  },
];

/**
 * Compress client-side image files before sending to prevent 413 Payload Too Large errors
 */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({ onImageSelected, selectedImageUrl, onClear }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setIsUploading(true);

    try {
      // Compress image client-side to lightweight ~200KB data URL
      const compressedDataUrl = await compressImage(file);
      onImageSelected(compressedDataUrl);

      // Optionally sync with backend upload route
      fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: compressedDataUrl, filename: file.name }),
      }).catch((e) => console.warn('Background upload sync note:', e));
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-purple-400" />
          1. Upload Source Image
        </label>
        {selectedImageUrl && (
          <button
            onClick={onClear}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Remove Image
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
        accept="image/*"
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {selectedImageUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative group rounded-2xl overflow-hidden border-2 border-purple-500/40 bg-slate-950 aspect-[4/3] sm:aspect-[16/10] shadow-2xl flex items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImageUrl}
              alt="Source Input Preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
              <div className="flex justify-end">
                <Button variant="danger" size="sm" onClick={onClear}>
                  <X className="w-4 h-4" /> Change Image
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-purple-300 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-purple-500/30 w-fit">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Source Image Ready (Azure Storage Synced)
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed p-8 cursor-pointer text-center transition-all duration-300 flex flex-col items-center justify-center gap-3 min-h-[220px] ${
              isDragging
                ? 'border-purple-400 bg-purple-500/10 scale-[1.01]'
                : 'border-slate-700 hover:border-purple-500/50 bg-slate-900/40 hover:bg-slate-900/80'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                <p className="text-sm font-medium text-purple-300">Processing image upload...</p>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-200">
                    <span className="text-purple-400">Click to upload</span> or drag and drop image
                  </p>
                  <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 20MB</p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preset sample images for quick testing */}
      {!selectedImageUrl && (
        <div className="space-y-2 pt-2">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Or pick a sample image:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {SAMPLE_INPUT_IMAGES.map((sample) => (
              <button
                key={sample.name}
                onClick={() => onImageSelected(sample.url)}
                className="group relative rounded-xl overflow-hidden aspect-[4/3] border border-slate-800 hover:border-purple-500/50 transition-all text-left"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/10 transition-colors p-2 flex items-end">
                  <span className="text-[10px] font-medium text-white truncate bg-slate-900/80 px-1.5 py-0.5 rounded backdrop-blur-sm">
                    {sample.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
