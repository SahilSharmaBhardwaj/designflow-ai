import React from 'react';
import Link from 'next/link';
import { Layers, ShieldCheck, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">DesignFlow AI</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              — Open-Source AI Product Design Toolkit
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Zero Key Leakage Security</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Offline Mock Engine Supported</span>
            </div>
            <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-200 underline">
              Architecture & Product Specs
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-500">
          <p>
            Licensed under MIT. Built for product designers, UX researchers, and engineering teams.
          </p>
          <p>
            Designed with Nielsen Norman Heuristics & WCAG 2.2 standards.
          </p>
        </div>
      </div>
    </footer>
  );
};
