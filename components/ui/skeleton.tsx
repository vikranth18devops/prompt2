import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        'animate-pulse rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-[length:200%_100%]',
        className
      )}
      {...props}
    />
  );
}
