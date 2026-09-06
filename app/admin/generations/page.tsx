'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/shared/Header';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon, RefreshCw, Clock, Filter, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface GenerationRecord {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  inputImageUrl?: string;
  outputImageUrl?: string;
  createdAt: string;
  executionTimeMs?: number;
  errorMessage?: string;
  promptVersion?: {
    promptTemplate: string;
    prompt?: { title: string };
  };
}

export default function AdminGenerationsPage() {
  const [generations, setGenerations] = useState<GenerationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchGenerations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (data.generations) setGenerations(data.generations);
    } catch (err) {
      console.error('Error fetching admin generations telemetry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGenerations();
  }, []);

  const filtered = statusFilter === 'all'
    ? generations
    : generations.filter((g) => g.status === statusFilter);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <div className="flex-1 flex">
        <AdminSidebar />

        <main className="flex-1 p-6 space-y-6 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-extrabold text-slate-100">Global Generations Telemetry</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Monitor live AI rendering pipelines, Service Bus queue messages, and execution durations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" onClick={fetchGenerations}>
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
              </Button>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-slate-100"
              >
                <option value="all">All Statuses</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="PENDING">PENDING</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>
          </div>

          {/* Telemetry Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Generation ID</th>
                  <th className="p-4">Prompt Title</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Created Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 font-sans">
                      No generation records found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-purple-400 max-w-[140px] truncate">{item.id}</td>
                      <td className="p-4 font-sans text-slate-100 font-medium max-w-xs truncate">
                        {item.promptVersion?.prompt?.title || 'AI Image Transformation'}
                      </td>
                      <td className="p-4 text-slate-400">
                        {item.executionTimeMs ? `${(item.executionTimeMs / 1000).toFixed(2)}s` : '—'}
                      </td>
                      <td className="p-4 font-sans">
                        <Badge variant={item.status === 'COMPLETED' ? 'emerald' : item.status === 'FAILED' ? 'rose' : 'amber'}>
                          {item.status} ({item.progress}%)
                        </Badge>
                      </td>
                      <td className="p-4 text-right text-slate-500">
                        {new Date(item.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
