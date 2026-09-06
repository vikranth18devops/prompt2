'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Plus, X, Sparkles, Sliders, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryItem, PromptItem } from '@/components/user/PromptSelector';

interface PromptFormProps {
  onClose: () => void;
  onSaved: () => void;
  initialData?: PromptItem | null;
}

export function PromptForm({ onClose, onSaved, initialData }: PromptFormProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [promptTemplate, setPromptTemplate] = useState(initialData?.promptTemplate || '');
  const [negativePrompt, setNegativePrompt] = useState(initialData?.negativePrompt || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [previewImageUrl, setPreviewImageUrl] = useState(initialData?.previewImageUrl || '');
  const [guidanceScale, setGuidanceScale] = useState(initialData?.defaultConfig?.guidanceScale || 7.5);
  const [strength, setStrength] = useState(initialData?.defaultConfig?.strength || 0.75);
  const [steps, setSteps] = useState(initialData?.defaultConfig?.steps || 30);
  const [style, setStyle] = useState(initialData?.defaultConfig?.style || 'Photorealistic');

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
          if (!categoryId && data.categories.length > 0) {
            setCategoryId(data.categories[0].id);
          }
        }
      });
  }, []);

  const handlePreviewUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setPreviewImageUrl(data.url);
      }
    } catch (err) {
      console.error('Error uploading preview image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !promptTemplate || !previewImageUrl || !categoryId) {
      alert('Please fill in all required fields and upload a preview image.');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      title,
      description,
      promptTemplate,
      negativePrompt,
      previewImageUrl,
      categoryId,
      defaultConfig: {
        guidanceScale: Number(guidanceScale),
        strength: Number(strength),
        steps: Number(steps),
        style,
      },
    };

    try {
      const endpoint = initialData ? `/api/prompts/${initialData.id}` : '/api/prompts';
      const method = initialData ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSaved();
        onClose();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to save prompt.');
      }
    } catch (err) {
      console.error('Save prompt error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-6 relative my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            {initialData ? 'Edit AI Prompt' : 'Create New AI Prompt'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Prompt Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Neon Cyberpunk Runner"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-slate-100 focus:outline-none focus:border-purple-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Short Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description for the user card..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Master Prompt Template *</label>
            <textarea
              required
              rows={3}
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
              placeholder="e.g. Futuristic cyberpunk character avatar, neon rain reflections, glowing cyan and magenta accents..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-slate-100 focus:outline-none focus:border-purple-500 resize-none font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Negative Prompt (Optional)</label>
            <input
              type="text"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="e.g. blurry, low quality, noise, extra limbs"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-slate-100 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          {/* Upload Preview Image */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Preview Image (Azure Blob Storage) *</label>
            <div className="flex items-center gap-4">
              {previewImageUrl ? (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-purple-500/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPreviewImageUrl('')}
                    className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="w-full flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950 cursor-pointer hover:border-purple-500">
                  <Upload className="w-6 h-6 text-purple-400 mb-1" />
                  <span className="text-slate-400">
                    {isUploading ? 'Uploading to Azure...' : 'Upload Prompt Preview Card Image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handlePreviewUpload(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Defaults */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="text-[10px] text-slate-400">Style Tag</label>
              <input
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">Guidance Scale (CFG)</label>
              <input
                type="number"
                step="0.5"
                value={guidanceScale}
                onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">Strength</label>
              <input
                type="number"
                step="0.05"
                value={strength}
                onChange={(e) => setStrength(parseFloat(e.target.value))}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">Quality Steps</label>
              <input
                type="number"
                value={steps}
                onChange={(e) => setSteps(parseInt(e.target.value))}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              <Check className="w-4 h-4" /> {initialData ? 'Update Prompt' : 'Activate Prompt'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
