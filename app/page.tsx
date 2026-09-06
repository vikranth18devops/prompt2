'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/shared/Header';
import { ImageUploader } from '@/components/user/ImageUploader';
import { PromptSelector, PromptItem } from '@/components/user/PromptSelector';
import { GenerationControls, GenerationParameters } from '@/components/user/GenerationControls';
import { ProcessingVisualizer } from '@/components/user/ProcessingVisualizer';
import { ImageComparisonSlider } from '@/components/user/ImageComparisonSlider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Wand2, ArrowRight, ShieldCheck, RefreshCcw } from 'lucide-react';

export default function UserStudioPage() {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);
  const [parameters, setParameters] = useState<GenerationParameters>({
    guidanceScale: 7.5,
    strength: 0.75,
    steps: 30,
    customPrompt: '',
  });

  const [generationState, setGenerationState] = useState<'IDLE' | 'PROCESSING' | 'COMPLETED' | 'ERROR'>('IDLE');
  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<'PENDING' | 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED'>('PENDING');
  const [outputImageUrl, setOutputImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync prompt default config when prompt changes
  const handleSelectPrompt = (prompt: PromptItem) => {
    setSelectedPrompt(prompt);
    if (prompt.defaultConfig) {
      setParameters((prev) => ({
        ...prev,
        guidanceScale: prompt.defaultConfig.guidanceScale ?? 7.5,
        strength: prompt.defaultConfig.strength ?? 0.75,
        steps: prompt.defaultConfig.steps ?? 30,
      }));
    }
  };

  const handleStartGeneration = async () => {
    if (!selectedImageUrl || !selectedPrompt) return;

    setGenerationState('PROCESSING');
    setProgress(5);
    setStatusText('QUEUED');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputImageUrl: selectedImageUrl,
          promptId: selectedPrompt.id,
          customPrompt: parameters.customPrompt,
          parameters: {
            guidanceScale: parameters.guidanceScale,
            strength: parameters.strength,
            steps: parameters.steps,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.jobId) {
        throw new Error(data.error || 'Failed to submit generation job.');
      }

      setJobId(data.jobId);
    } catch (err: any) {
      setGenerationState('ERROR');
      setErrorMessage(err.message || 'Generation failed.');
    }
  };

  // Poll job status every 600ms while PROCESSING
  useEffect(() => {
    if (!jobId || generationState !== 'PROCESSING') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/generate/${jobId}`);
        const data = await res.json();

        if (data.job) {
          const { status, progress: jobProgress, outputImageUrl: outputUrl, errorMessage: err } = data.job;

          setProgress(jobProgress || 10);
          setStatusText(status);

          if (status === 'COMPLETED' && outputUrl) {
            setOutputImageUrl(outputUrl);
            setGenerationState('COMPLETED');
            clearInterval(interval);
          } else if (status === 'FAILED') {
            setGenerationState('ERROR');
            setErrorMessage(err || 'Job processing failed on cloud node.');
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error('Polling job error:', err);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [jobId, generationState]);

  const handleReset = () => {
    setGenerationState('IDLE');
    setJobId(null);
    setProgress(0);
    setOutputImageUrl(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Banner Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Next-Gen Azure AI Vision Engine
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Transform Any Image with <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
              Enterprise AI Models
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Upload your source image, pick a dynamic prompt category, and generate ultra-high-resolution photorealistic artwork.
          </p>
        </div>

        {/* Dynamic State Layout */}
        {generationState === 'PROCESSING' && (
          <div className="max-w-2xl mx-auto">
            <ProcessingVisualizer progress={progress} status={statusText} promptTitle={selectedPrompt?.title} />
          </div>
        )}

        {generationState === 'COMPLETED' && outputImageUrl && selectedImageUrl && (
          <div className="max-w-4xl mx-auto space-y-6">
            <ImageComparisonSlider
              inputImageUrl={selectedImageUrl}
              outputImageUrl={outputImageUrl}
              promptTitle={selectedPrompt?.title}
              onRegenerate={handleStartGeneration}
            />

            <div className="flex justify-center">
              <Button variant="outline" size="md" onClick={handleReset}>
                <RefreshCcw className="w-4 h-4" /> Start New Image Transformation
              </Button>
            </div>
          </div>
        )}

        {(generationState === 'IDLE' || generationState === 'ERROR') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Image Upload & Fine-tune Controls */}
            <div className="lg:col-span-5 space-y-6">
              <Card>
                <ImageUploader
                  selectedImageUrl={selectedImageUrl}
                  onImageSelected={(url) => setSelectedImageUrl(url)}
                  onClear={() => setSelectedImageUrl(null)}
                />
              </Card>

              {selectedPrompt && (
                <GenerationControls
                  selectedPrompt={selectedPrompt}
                  parameters={parameters}
                  onChangeParameters={setParameters}
                />
              )}
            </div>

            {/* Right Column: Prompt Selection & Generation Submit */}
            <div className="lg:col-span-7 space-y-6">
              <Card>
                <PromptSelector selectedPrompt={selectedPrompt} onSelectPrompt={handleSelectPrompt} />
              </Card>

              {/* Submit CTA Card */}
              <div className="rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-950/60 to-slate-900 border border-purple-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2 justify-center sm:justify-start">
                    <Wand2 className="w-4 h-4 text-purple-400" />
                    Ready to Generate?
                  </h4>
                  <p className="text-xs text-slate-400">
                    {!selectedImageUrl
                      ? 'Please upload or pick a source image first.'
                      : !selectedPrompt
                      ? 'Select an active prompt style above.'
                      : `Selected: "${selectedPrompt.title}"`}
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  disabled={!selectedImageUrl || !selectedPrompt}
                  onClick={handleStartGeneration}
                  className="w-full sm:w-auto"
                >
                  Generate Image <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {generationState === 'ERROR' && errorMessage && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 text-xs text-rose-300">
                  ⚠️ <strong>Error:</strong> {errorMessage}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Azure AI Image Platform. Modular Next.js & Prisma Architecture.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Azure Blob & Key Vault Secured
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
