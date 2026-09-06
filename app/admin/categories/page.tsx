'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/shared/Header';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PromptCategory } from '@/types';
import { FolderTree, Plus, Edit2, Trash2, CheckCircle2, XCircle, RefreshCw, X, Check } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<PromptCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PromptCategory | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [icon, setIcon] = useState('Sparkles');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories?all=true');
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category?: PromptCategory) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setDescription(category.description || '');
      setDisplayOrder(category.displayOrder);
      setStatus(category.status);
      setIcon(category.icon);
    } else {
      setEditingCategory(null);
      setName('');
      setDescription('');
      setDisplayOrder(categories.length + 1);
      setStatus('ACTIVE');
      setIcon('Sparkles');
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsSubmitting(true);
    const payload = {
      name,
      description,
      displayOrder: Number(displayOrder),
      status,
      icon,
    };

    try {
      const endpoint = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchCategories();
        setShowModal(false);
      } else {
        alert('Failed to save category');
      }
    } catch (err) {
      console.error('Submit category error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (cat: PromptCategory) => {
    const newStatus = cat.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await fetch(`/api/categories/${cat.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchCategories();
    } catch (err) {
      console.error('Toggle category status error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? Prompts in this category may be affected.')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCategories();
    } catch (err) {
      console.error('Delete category error:', err);
    }
  };

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
                <FolderTree className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-extrabold text-slate-100">Prompt Categories Management</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Configure prompt categories, display ordering, and visibility status.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" onClick={fetchCategories}>
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleOpenModal()}>
                <Plus className="w-4 h-4" /> Create Category
              </Button>
            </div>
          </div>

          {/* Table Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Order</th>
                  <th className="p-4">Category Name</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-purple-400">#{cat.displayOrder}</td>
                    <td className="p-4 font-semibold text-slate-100">{cat.name}</td>
                    <td className="p-4 text-slate-400 max-w-xs truncate">{cat.description || '—'}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                          cat.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {cat.status === 'ACTIVE' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active in User UI
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-500" /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(cat)}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(cat.id)}>
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Category Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-100">
                    {editingCategory ? 'Edit Category' : 'Create Category'}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-200">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300">Category Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Cyberpunk & Sci-Fi"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-slate-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300">Description</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description for users..."
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-slate-100 focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-300">Display Order</label>
                      <input
                        type="number"
                        value={displayOrder}
                        onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-slate-100 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-300">Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-slate-100"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSubmitting}>
                      <Check className="w-4 h-4" /> Save Category
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
