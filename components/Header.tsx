import React from 'react';
import { ShieldCheckIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800/50 shadow-sm sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="h-8 w-8 text-brand-primary" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              E-Mail Forensics Analyzer
            </h1>
          </div>
          <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            v0.1.2 (CH-compliant)
          </div>
        </div>
      </div>
    </header>
  );
};