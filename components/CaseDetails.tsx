import React from 'react';
import type { CaseAnalysis } from '../types';
import { ScoreBadge } from './ScoreBadge';
import { ScoreBreakdown } from './ScoreBreakdown';
import { DocumentReportIcon, SparklesIcon, TerminalIcon, BeakerIcon, ArchiveBoxIcon, FlagIcon, LoadingSpinnerIcon } from './Icons';
import { exportZip, getPdfReport } from '../services/api';

interface CaseDetailsProps {
  caseData: CaseAnalysis;
  onReset: () => void;
  onShowAbuseDraft: (caseId: string) => void;
  isSubmitting: boolean;
}

export const CaseDetails: React.FC<CaseDetailsProps> = ({ caseData, onReset, onShowAbuseDraft, isSubmitting }) => {
  
  const handleExportZip = async () => {
    // In a real app, you might want a loading state here too
    await exportZip(caseData.id);
  };

  const handleDownloadPdf = async () => {
    // In a real app, you might want a loading state here too
    await getPdfReport(caseData.id);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg animate-fade-in">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white truncate" title={caseData.fileName}>
              Analysis Report: {caseData.fileName}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Case ID: {caseData.id} | Analyzed: {new Date(caseData.submittedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex-shrink-0">
             <ScoreBadge level={caseData.riskLevel} score={caseData.overallScore} />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <ScoreBreakdown stage={caseData.stages.technical} icon={<TerminalIcon className="h-6 w-6 text-blue-500"/>} />
          <ScoreBreakdown stage={caseData.stages.enrichment} icon={<BeakerIcon className="h-6 w-6 text-purple-500"/>} />
          <ScoreBreakdown stage={caseData.stages.content} icon={<SparklesIcon className="h-6 w-6 text-amber-500"/>} />
        </div>

        <div className="bg-slate-100 dark:bg-slate-900/50 rounded-lg p-6 mb-6">
           <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-2">
            <SparklesIcon className="h-5 w-5 text-amber-500"/>
            Gemini AI Content Summary
          </h3>
          <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{caseData.geminiSummary}</p>
        </div>

        <div className="flex flex-col-reverse md:flex-row gap-4 justify-end items-center">
          <div className="flex-grow w-full flex flex-col md:flex-row gap-4">
             <button 
              type="button"
              onClick={() => onShowAbuseDraft(caseData.id)}
              disabled={isSubmitting}
              className="w-full md:w-auto inline-flex justify-center items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-slate-800 disabled:opacity-50"
            >
              {isSubmitting ? <LoadingSpinnerIcon className="h-5 w-5" /> : <FlagIcon className="h-5 w-5"/>}
              Get Abuse Draft
            </button>
            <button 
              type="button" 
              onClick={handleExportZip}
              className="w-full md:w-auto inline-flex justify-center items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-slate-800"
            >
              <ArchiveBoxIcon className="h-5 w-5"/>
              Download ZIP Export
            </button>
            <button 
              type="button" 
              onClick={handleDownloadPdf}
              className="w-full md:w-auto inline-flex justify-center items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-slate-800"
            >
              <DocumentReportIcon className="h-5 w-5"/>
              Download PDF Report
            </button>
          </div>
          <button 
            type="button" 
            onClick={onReset}
            className="w-full md:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-slate-800"
          >
            Analyze Another Email
          </button>
        </div>
      </div>
    </div>
  );
};