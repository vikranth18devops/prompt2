'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/shared/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon, Search, Download, RefreshCw, Calendar, Clock, Sparkles } from 'lucide-react';

interface GenerationItem {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  inputImageUrl?: string;
  outputImageUrl?: string;
  createdAt: string;
  executionTimeMs?: number;
  promptVersion?: {
    promptTemplate: string;
    prompt?: { title: string };
  };
}

export default function UserGalleryPage() {
  const [generations, setGenerations] = useState<GenerationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (data.generations) {
        setGenerations(data.generations);
      }
    } catch (err) {
      console.error('Fetch gallery error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredGenerations = generations.filter((g) => {
    const title = g.promptVersion?.prompt?.title || '';
    const template = g.promptVersion?.promptTemplate || '';
    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-400" />
              <h1 className="text-2xl font-extrabold text-slate-100">My Generations History</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Private archive of all your AI image transformations and rendering history.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : filteredGenerations.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
            <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-slate-200">No Generations Recorded Yet</h3>
            <p className="text-xs text-slate-500 mt-1">Upload an image in the Generate Studio to create your first artwork!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGenerations.map((item) => (
              <Card key={item.id} className="space-y-3 p-4 hover:border-purple-500/40 transition-all">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.outputImageUrl || item.inputImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
                    alt="Generation Result"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={item.status === 'COMPLETED' ? 'emerald' : item.status === 'FAILED' ? 'rose' : 'amber'}>
                      {item.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-100 line-clamp-1">
                    {item.promptVersion?.prompt?.title || 'AI Image Transformation'}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{item.promptVersion?.promptTemplate}</p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-purple-400" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  {item.executionTimeMs && (
                    <span className="flex items-center gap-1 font-mono text-cyan-400">
                      <Clock className="w-3 h-3" /> {(item.executionTimeMs / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
