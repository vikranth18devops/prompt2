import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'outline';
}

export function Badge({ children, className, variant = 'primary', ...props }: BadgeProps) {
  const variants = {
    primary: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    secondary: 'bg-slate-800 text-slate-300 border-slate-700',
    emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    rose: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    outline: 'border-slate-700 text-slate-400 bg-transparent',
  };

  return (
    <div
      className={twMerge(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
