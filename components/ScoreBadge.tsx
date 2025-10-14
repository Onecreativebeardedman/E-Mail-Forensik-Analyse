import React from 'react';
import { RiskLevel } from '../types';

interface ScoreBadgeProps {
  level: RiskLevel;
  score: number;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ level, score }) => {
  const levelStyles = {
    [RiskLevel.LOW]: 'bg-risk-low/10 text-risk-low border-risk-low/20',
    [RiskLevel.MEDIUM]: 'bg-risk-medium/10 text-risk-medium border-risk-medium/20',
    [RiskLevel.HIGH]: 'bg-risk-high/10 text-risk-high border-risk-high/20',
  };

  return (
    <div className={`flex items-center gap-4 px-4 py-2 rounded-lg border ${levelStyles[level]}`}>
      <span className="text-sm font-bold tracking-wider uppercase">{level} RISK</span>
      <span className="text-2xl font-bold">{score}</span>
    </div>
  );
};