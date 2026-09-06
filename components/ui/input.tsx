import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && <label className="text-xs font-semibold text-slate-300">{label}</label>}
        <input
          type={type}
          className={twMerge(
            'w-full rounded-xl bg-slate-950/80 border border-slate-800 px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 transition-colors focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/40',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-[10px] text-rose-400 font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
