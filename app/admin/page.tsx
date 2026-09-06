'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/shared/Header';
import { PromptListTable } from '@/components/admin/PromptListTable';
import { PromptForm } from '@/components/admin/PromptForm';
import { TelemetryMetrics } from '@/components/admin/TelemetryMetrics';
import { PromptItem } from '@/components/user/PromptSelector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Shield, LogOut, RefreshCw, Key, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  // Login form state
  const [email, setEmail] = useState('admin@azure-ai.com');
  const [password, setPassword] = useState('AdminPass123!');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin prompts state
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PromptItem | null>(null);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          loadAllPrompts();
        }
      }
    } catch {
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const loadAllPrompts = async () => {
    setIsLoadingPrompts(true);
    try {
      const res = await fetch('/api/prompts?all=true');
      const data = await res.json();
      if (data.prompts) {
        setPrompts(data.prompts);
      }
    } catch (err) {
      console.error('Error loading admin prompts:', err);
    } finally {
      setIsLoadingPrompts(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        loadAllPrompts();
      } else {
        setLoginError(data.error || 'Invalid admin credentials');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login request failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/prompts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      });

      if (res.ok) {
        loadAllPrompts();
      }
    } catch (err) {
      console.error('Toggle active error:', err);
    }
  };

  const handleDeletePrompt = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt from the database?')) return;
    try {
      const res = await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadAllPrompts();
      }
    } catch (err) {
      console.error('Delete prompt error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {!isAuthenticated ? (
          /* Login Card */
          <div className="max-w-md mx-auto py-12">
            <Card className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-100">Admin Control Login</h2>
                <p className="text-xs text-slate-400">Authenticate to manage database prompts and Azure configuration.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-xs text-slate-200">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Admin Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    {loginError}
                  </div>
                )}

                <Button type="submit" variant="primary" className="w-full py-3" isLoading={isLoggingIn}>
                  <Key className="w-4 h-4" /> Authenticate Admin
                </Button>

                <p className="text-[11px] text-slate-500 text-center pt-2">
                  Demo credentials: <code className="text-purple-400">admin@azure-ai.com</code> /{' '}
                  <code className="text-purple-400">AdminPass123!</code>
                </p>
              </form>
            </Card>
          </div>
        ) : (
          /* Admin Dashboard Content */
          <div className="space-y-8">
            {/* Dashboard Header Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <h2 className="text-xl font-extrabold text-slate-100">Admin Prompt & Model Engine</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Create, configure, and activate AI prompts. Changes automatically reflect in the User UI.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="secondary" size="sm" onClick={loadAllPrompts}>
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingPrompts ? 'animate-spin' : ''}`} /> Sync Database
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setEditingPrompt(null);
                    setShowPromptForm(true);
                  }}
                >
                  <Plus className="w-4 h-4" /> Create Prompt
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} title="Logout">
                  <LogOut className="w-4 h-4 text-rose-400" />
                </Button>
              </div>
            </div>

            {/* Azure Telemetry Panel */}
            <TelemetryMetrics />

            {/* Prompts Table */}
            <PromptListTable
              prompts={prompts}
              onToggleActive={handleToggleActive}
              onEdit={(prompt) => {
                setEditingPrompt(prompt);
                setShowPromptForm(true);
              }}
              onDelete={handleDeletePrompt}
            />

            {/* Prompt Modal Form */}
            {showPromptForm && (
              <PromptForm
                initialData={editingPrompt}
                onClose={() => setShowPromptForm(false)}
                onSaved={loadAllPrompts}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
