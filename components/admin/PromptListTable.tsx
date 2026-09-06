'use client';

import React, { useState } from 'react';
import { Edit2, Trash2, CheckCircle, XCircle, Sparkles, Layers, Sliders, ExternalLink } from 'lucide-react';
import { PromptItem } from '@/components/user/PromptSelector';
import { Button } from '@/components/ui/button';

interface PromptListTableProps {
  prompts: PromptItem[];
  onToggleActive: (id: string, currentActive: boolean) => void;
  onEdit: (prompt: PromptItem) => void;
  onDelete: (id: string) => void;
}

export function PromptListTable({ prompts, onToggleActive, onEdit, onDelete }: PromptListTableProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  return (
    <div className="w-full space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-semibold text-slate-100">All Database Prompts ({prompts.length})</h4>
          </div>
          <span className="text-xs text-slate-400">
            Active: <strong className="text-emerald-400">{prompts.filter((p) => p.isActive).length}</strong> | Inactive:{' '}
            <strong className="text-rose-400">{prompts.filter((p) => !p.isActive).length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Preview</th>
                <th className="p-3">Prompt Title</th>
                <th className="p-3">Template</th>
                <th className="p-3">Defaults</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {prompts.map((prompt) => (
                <tr key={prompt.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={prompt.previewImageUrl} alt={prompt.title} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="p-3 font-medium text-slate-100 max-w-[160px]">
                    <div className="font-semibold">{prompt.title}</div>
                    <div className="text-[10px] text-purple-400">{prompt.defaultConfig?.style || 'Standard'}</div>
                  </td>
                  <td className="p-3 max-w-[240px]">
                    <p className="line-clamp-2 font-mono text-[11px] text-slate-400">{prompt.promptTemplate}</p>
                  </td>
                  <td className="p-3 text-[11px] font-mono text-slate-400">
                    <div>CFG: {prompt.defaultConfig?.guidanceScale ?? 7.5}</div>
                    <div>Strength: {prompt.defaultConfig?.strength ?? 0.75}</div>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => onToggleActive(prompt.id, prompt.isActive)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        prompt.isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {prompt.isActive ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-400" /> Active in User UI
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-slate-500" /> Disabled
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(prompt)} title="Edit prompt">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(prompt.id)} title="Delete prompt">
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
