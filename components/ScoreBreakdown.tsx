import React from 'react';
import type { StageScore } from '../types';
import { CheckCircleIcon, XCircleIcon } from './Icons';

interface ScoreBreakdownProps {
  stage: StageScore;
  icon: React.ReactNode;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ stage, icon }) => {
  const percentage = (stage.score / stage.maxScore) * 100;

  const getProgressBarColor = (percent: number) => {
    if (percent > 66) return 'bg-green-500';
    if (percent > 33) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  // A higher score is better in our mock data (less risk), so the progress bar reflects that.
  // We'll reverse the color logic for risk display if needed, but here a full bar is a "good" score.
  // For display purposes, we can show red as "high risk points". Let's adjust logic.
  // High points = more risk. So a high score is bad.
  const riskPercentage = (stage.score / stage.maxScore) * 100;
   const getRiskBarColor = (percent: number) => {
    if (percent >= 70) return 'bg-risk-high';
    if (percent >= 40) return 'bg-risk-medium';
    return 'bg-risk-low';
  };


  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h4 className="font-semibold text-slate-800 dark:text-slate-100">{stage.title}</h4>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{stage.summary}</p>
      
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Risk Score</span>
        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{stage.score} / {stage.maxScore}</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-4">
        <div className={`${getRiskBarColor(riskPercentage)} h-2.5 rounded-full`} style={{ width: `${riskPercentage}%` }}></div>
      </div>
      
      <div className="space-y-2 mt-auto">
        {stage.details.map((detail, index) => (
          <div key={index} className="flex items-start text-xs">
            {detail.pass ? (
               <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            ) : (
               <XCircleIcon className="h-4 w-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            )}
            <span className="text-slate-600 dark:text-slate-400">{detail.label}: <span className="font-semibold text-slate-700 dark:text-slate-300">{detail.value}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
};