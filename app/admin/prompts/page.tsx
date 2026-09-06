'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/shared/Header';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { PromptItem, CategoryItem } from '@/components/user/PromptSelector';
import { Wand2, Plus, Search, Filter, RefreshCw, CheckCircle2, XCircle, FileText, Edit2, Trash2, SlidersHorizontal } from 'lucide-react';

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [promptsRes, catRes] = await Promise.all([
        fetch('/api/prompts?all=true'),
        fetch('/api/categories?all=true'),
      ]);
      const pData = await promptsRes.json();
      const cData = await catRes.json();
      if (pData.prompts) setPrompts(pData.prompts);
      if (cData.categories) setCategories(cData.categories);
    } catch (err) {
      console.error('Failed loading admin prompt list:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/prompts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      if (res.ok) loadData();
    } catch (err) {
      console.error('Toggle active status error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt from the database?')) return;
    try {
      const res = await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
      if (res.ok) loadData();
    } catch (err) {
      console.error('Delete prompt error:', err);
    }
  };

  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.promptTemplate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'ACTIVE' && p.isActive) ||
      (selectedStatus === 'INACTIVE' && !p.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
                <Wand2 className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-extrabold text-slate-100">AI Prompt Management & Versioning</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Manage, version, and publish AI prompts to the user generation workspace.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" onClick={loadData}>
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
              </Button>
              <Link href="/admin/prompts/create">
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4" /> Create Prompt
                </Button>
              </Link>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompts by title or template..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-slate-100"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-slate-100"
              >
                <option value="all">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          {/* Prompts Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Preview</th>
                  <th className="p-4">Prompt Title & Category</th>
                  <th className="p-4">Template String</th>
                  <th className="p-4">CFG & Strength</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPrompts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No matching prompts found.
                    </td>
                  </tr>
                ) : (
                  filteredPrompts.map((prompt) => {
                    const category = categories.find((c) => c.id === prompt.categoryId);
                    return (
                      <tr key={prompt.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={prompt.previewImageUrl} alt={prompt.title} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="p-4 max-w-[200px]">
                          <div className="font-bold text-slate-100">{prompt.title}</div>
                          <div className="text-[10px] text-purple-400 mt-0.5">{category?.name || 'Category'}</div>
                        </td>
                        <td className="p-4 max-w-xs">
                          <p className="line-clamp-2 font-mono text-[11px] text-slate-400">{prompt.promptTemplate}</p>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-slate-400">
                          <div>CFG: {prompt.defaultConfig?.guidanceScale ?? 7.5}</div>
                          <div>Strength: {prompt.defaultConfig?.strength ?? 0.75}</div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleActive(prompt.id, prompt.isActive)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                              prompt.isActive
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            {prompt.isActive ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active in User UI
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 text-slate-500" /> Disabled
                              </>
                            )}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(prompt.id)}>
                              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
