'use client';
import React from 'react';
import Modal from '@/shared/components/modal';
import { ChevronDown } from 'lucide-react';
import type { RiskAnalysisTable } from '~/db/schema';

export interface AnalysisItem {
  status: 'passed' | 'failed';
  name: string;
  description: string;
}

interface RiskAnalysisAlertProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  risks: RiskAnalysisTable[];
}

const statusStyles: Record<'passed' | 'failed', string> = {
  passed: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

function transformRisks(risks: RiskAnalysisTable[]): AnalysisItem[] {
  return risks.map((r) => ({
    name: r.riskName,
    description: r.description ?? '',
    status: r.level === 'LOW' ? 'passed' : 'failed',
  }));
}

const RiskAnalysisAlert: React.FC<RiskAnalysisAlertProps> = ({
  open,
  onOpenChange,
  risks,
}) => {
  const analyses = transformRisks(risks);
  const close = () => onOpenChange?.(false);
  return (
    <Modal isOpen={open} onClose={close} menuRef={null}>
      <div className="mx-auto w-full max-w-3xl rounded-lg border bg-background shadow-xl">
        <header className="p-6 pb-4 border-b">
          <h2 className="text-lg font-semibold">Resultados del Análisis de Riesgo</h2>
        </header>
        <ul className="space-y-3 px-6 py-4">
          {analyses.map((a, idx) => (
            <li key={idx}>
              <details className="group">
                <summary className="flex items-center gap-4 cursor-pointer list-none py-2 rounded-md transition-shadow hover:shadow">
                  <span
                    className={`min-w-[80px] inline-block text-center rounded-md px-2 py-0.5 text-xs font-medium ${statusStyles[a.status]}`}
                  >
                    {a.status === 'passed' ? 'PASSED' : 'ALERT'}
                  </span>
                  <span className="flex-1 text-sm font-medium leading-tight whitespace-nowrap">
                    {a.name}
                  </span>
                  <ChevronDown className="h-4 w-4 transition-transform group-open:-rotate-180" />
                </summary>
                <p className="pl-28 pr-8 pt-1 text-sm leading-relaxed text-muted-foreground">
                  {a.description}
                </p>
              </details>
            </li>
          ))}
        </ul>
        <div className="flex justify-end p-6 pt-0">
          <button
            onClick={close}
            className="min-w-[88px] inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RiskAnalysisAlert; 