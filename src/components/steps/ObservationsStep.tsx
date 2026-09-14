import React from 'react';
import { FileText, ArrowLeft, ArrowRight, CornerDownRight } from 'lucide-react';

interface ObservationsStepProps {
  observations: string;
  onUpdate: (value: string) => void;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export const ObservationsStep: React.FC<ObservationsStepProps> = ({
  observations,
  onUpdate,
  onNext,
  onSkip,
  onBack,
}) => {
  return (
    <div
      id="step-observations"
      className="max-w-xl mx-auto min-h-[calc(100vh-65px)] flex flex-col justify-between px-4 py-4 sm:py-6"
    >
      <div className="space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Cabeçalho da Etapa */}
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-2">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Observações
              </h1>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                Opcional
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Adicione orientações ou informações adicionais, se necessário.
            </p>
          </div>

          {/* Campo Grande de Texto */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <label
              htmlFor="input-observations-step"
              className="block text-xs font-semibold text-slate-700"
            >
              Orientações para a receita
            </label>
            <textarea
              id="input-observations-step"
              rows={6}
              value={observations}
              onChange={(e) => onUpdate(e.target.value)}
              placeholder="Digite aqui... (Ex: Ingerir com água após as refeições. Manter repouso e hidratação adequada.)"
              className="w-full text-base px-3.5 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow resize-none"
            />
          </div>
        </div>

        {/* Botões: CONTINUAR / PULAR / VOLTAR */}
        <div className="pt-6 space-y-2.5">
          <button
            type="button"
            id="btn-obs-continue"
            onClick={onNext}
            className="w-full py-4 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-base shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>CONTINUAR</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            id="btn-obs-skip"
            onClick={onSkip}
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <CornerDownRight className="w-4 h-4 text-slate-500" />
            <span>PULAR ETAPA</span>
          </button>

          <button
            type="button"
            id="btn-obs-back"
            onClick={onBack}
            className="w-full py-3 px-6 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
