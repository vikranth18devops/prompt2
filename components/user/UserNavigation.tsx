'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Wand2, Image as ImageIcon, Bookmark, User as UserIcon } from 'lucide-react';

export function UserNavigation() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Generate Studio', href: '/', icon: Wand2 },
    { label: 'My Generations', href: '/gallery', icon: ImageIcon },
    { label: 'Favorites', href: '/favorites', icon: Bookmark },
    { label: 'Profile', href: '/profile', icon: UserIcon },
  ];

  return (
    <nav className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isActive
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
