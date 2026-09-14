import React from 'react';
import { ArrowLeft, Stethoscope } from 'lucide-react';
import { FlowStep } from '../types';

interface StepProgressBarProps {
  currentStep: FlowStep;
  onBack?: () => void;
  canGoBack?: boolean;
}

const STEP_NUMBERS: Record<FlowStep, number> = {
  welcome: 0,
  prescriber: 1,
  patient: 2,
  medicines: 3,
  observations: 4,
  review: 5,
  success: 6,
};

const STEP_TITLES: Record<FlowStep, string> = {
  welcome: 'Início',
  prescriber: 'Emitente',
  patient: 'Paciente',
  medicines: 'Prescrição',
  observations: 'Observações',
  review: 'Revisão',
  success: 'Concluído',
};

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  onBack,
  canGoBack = true,
}) => {
  const stepNumber = STEP_NUMBERS[currentStep];
  const isFormStep = stepNumber >= 1 && stepNumber <= 5;
  const progressPercent = Math.min(100, Math.max(0, (stepNumber / 5) * 100));

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {canGoBack && onBack ? (
              <button
                type="button"
                onClick={onBack}
                id="header-back-btn"
                className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 active:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                title="Voltar para a etapa anterior"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Voltar</span>
              </button>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
            )}

            <div>
              <span className="text-sm font-bold text-slate-900 leading-none">Receita</span>
              <span className="text-[10px] text-slate-400 block">
                Prescrição Digital
              </span>
            </div>
          </div>

          {isFormStep && (
            <div className="text-right">
              <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full">
                Etapa {stepNumber} de 5
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {STEP_TITLES[currentStep]}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Barra de Progresso Discreta */}
      {isFormStep && (
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-sky-600 h-1 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </header>
  );
};
