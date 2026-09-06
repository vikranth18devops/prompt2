'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/Header';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { PromptPreviewCard } from '@/components/admin/PromptPreviewCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CategoryItem } from '@/components/user/PromptSelector';
import { Wand2, Upload, Check, X, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';

export default function CreatePromptPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [promptTemplate, setPromptTemplate] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [style, setStyle] = useState('Photorealistic');
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [strength, setStrength] = useState(0.75);
  const [steps, setSteps] = useState(30);

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/categories?all=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
          setCategoryId(data.categories[0].id);
        }
      });
  }, []);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setErrorMsg(null);
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
      } else {
        setErrorMsg('Failed to upload preview image.');
      }
    } catch {
      setErrorMsg('Image upload network error.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (status: 'ACTIVE' | 'DRAFT') => {
    setErrorMsg(null);

    // Client-side validations
    if (!title.trim()) {
      setErrorMsg('Prompt Title is required.');
      return;
    }
    if (title.length > 80) {
      setErrorMsg('Prompt Title must be 80 characters or less.');
      return;
    }
    if (!promptTemplate.trim()) {
      setErrorMsg('Prompt Template string is required.');
      return;
    }
    if (!previewImageUrl) {
      setErrorMsg('Please upload a preview card image.');
      return;
    }
    if (!categoryId) {
      setErrorMsg('Please select a category.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title,
        description,
        promptTemplate,
        negativePrompt,
        previewImageUrl,
        categoryId,
        status,
        defaultConfig: {
          guidanceScale: Number(guidanceScale),
          strength: Number(strength),
          steps: Number(steps),
          style,
        },
      };

      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/prompts');
      } else {
        setErrorMsg(data.error || 'Failed to create prompt.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCatObj = categories.find((c) => c.id === categoryId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <div className="flex-1 flex">
        <AdminSidebar />

        <main className="flex-1 p-6 space-y-6 max-w-6xl">
          <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
            <button
              onClick={() => router.back()}
              className="text-slate-400 hover:text-slate-100 p-1.5 rounded-xl hover:bg-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-400" /> Create New AI Prompt
              </h2>
              <p className="text-xs text-slate-400">Configure prompt template parameters with real-time live preview card.</p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7 space-y-4">
              <Card className="space-y-4 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="font-semibold text-slate-300">Prompt Title *</label>
                    <span className="text-[10px] text-slate-500">{title.length}/80</span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={80}
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

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Description</label>
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
                    placeholder="e.g. A futuristic cyberpunk character avatar, neon rain reflections, glowing cyan accents..."
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-slate-100 focus:outline-none focus:border-purple-500 font-mono resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Negative Prompt (Optional)</label>
                  <input
                    type="text"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="e.g. blurry, low quality, distorted features"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-slate-100 font-mono"
                  />
                </div>

                {/* Upload Preview Image */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Preview Image (Azure Blob Storage) *</label>
                  <div className="flex items-center gap-3">
                    {previewImageUrl ? (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-purple-500/40">
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
                      <label className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-700 bg-slate-950 cursor-pointer hover:border-purple-500">
                        <Upload className="w-4 h-4 text-purple-400" />
                        <span className="text-slate-400">
                          {isUploading ? 'Uploading to Azure...' : 'Upload Prompt Preview Card Image'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Config Defaults */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
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
                    <label className="text-[10px] text-slate-400">Guidance (CFG)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={guidanceScale}
                      onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
                      className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 font-mono text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Strength</label>
                    <input
                      type="number"
                      step="0.05"
                      value={strength}
                      onChange={(e) => setStrength(parseFloat(e.target.value))}
                      className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 font-mono text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Steps</label>
                    <input
                      type="number"
                      value={steps}
                      onChange={(e) => setSteps(parseInt(e.target.value))}
                      className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 font-mono text-slate-100"
                    />
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3">
                <Button variant="secondary" size="md" onClick={() => handleSave('DRAFT')} isLoading={isSubmitting}>
                  Save as Draft
                </Button>
                <Button variant="primary" size="md" onClick={() => handleSave('ACTIVE')} isLoading={isSubmitting}>
                  <Check className="w-4 h-4" /> Publish & Activate Prompt
                </Button>
              </div>
            </div>

            {/* Live Preview Column */}
            <div className="lg:col-span-5 sticky top-20">
              <PromptPreviewCard
                title={title}
                description={description}
                promptTemplate={promptTemplate}
                previewImageUrl={previewImageUrl}
                styleTag={style}
                guidanceScale={guidanceScale}
                strength={strength}
                categoryName={selectedCatObj?.name}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
