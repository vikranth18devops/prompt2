'use client';

import React from 'react';
import { Activity, Server, HardDrive, Cpu, Radio, ShieldAlert } from 'lucide-react';

export function TelemetryMetrics() {
  const metrics = [
    {
      title: 'Azure Application Insights',
      value: '99.98% SLA',
      sub: 'Telemetry stream active',
      icon: Activity,
      color: 'text-emerald-400',
    },
    {
      title: 'Azure Service Bus Queue',
      value: '0.04s Latency',
      sub: 'Queue: ai-generation-jobs',
      icon: Radio,
      color: 'text-purple-400',
    },
    {
      title: 'Azure Blob Storage',
      value: '2 Containers',
      sub: '/user-inputs & /outputs',
      icon: HardDrive,
      color: 'text-cyan-400',
    },
    {
      title: 'Azure Key Vault',
      value: 'Secrets Synced',
      sub: 'Managed Identity Auth',
      icon: Server,
      color: 'text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.title}
            className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-2 hover:border-purple-500/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{m.title}</span>
              <Icon className={`w-4 h-4 ${m.color}`} />
            </div>
            <div className="text-lg font-bold text-slate-100 font-mono">{m.value}</div>
            <p className="text-[10px] text-slate-500">{m.sub}</p>
          </div>
        );
      })}
    </div>
  );
}
