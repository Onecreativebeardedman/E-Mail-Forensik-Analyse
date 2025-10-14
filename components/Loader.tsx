import React from 'react';
import { LoadingSpinnerIcon } from './Icons';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
      <LoadingSpinnerIcon className="h-12 w-12 text-brand-primary" />
      <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200">{message}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">Please do not close this window.</p>
    </div>
  );
};