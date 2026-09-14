import React, { useState } from 'react';
import { Building2, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

interface EstablishmentStepProps {
  name: string;
  address: string;
  onUpdate: (name: string, address: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const EstablishmentStep: React.FC<EstablishmentStepProps> = ({
  name,
  address,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe o nome do estabelecimento.');
      document.getElementById('input-establishment-name')?.focus();
      return;
    }
    if (!address.trim()) {
      setError('Por favor, informe o endereço completo.');
      document.getElementById('input-establishment-address')?.focus();
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <div
      id="step-establishment"
      className="max-w-xl mx-auto min-h-[calc(100vh-65px)] flex flex-col justify-between px-4 py-4 sm:py-6"
    >
      <form onSubmit={handleContinue} className="space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-5">
          {/* Cabeçalho da Etapa */}
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-2">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Dados do estabelecimento
            </h1>
            <p className="text-sm text-slate-500">
              Informe os dados que deverão aparecer no cabeçalho da receita.
            </p>
          </div>

          {/* Erro de Validação */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Campos em destaque com tamanho confortável para digitação mobile */}
          <div className="space-y-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <label
                htmlFor="input-establishment-name"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Nome do estabelecimento <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-establishment-name"
                type="text"
                required
                value={name}
                onChange={(e) => {
                  onUpdate(e.target.value, address);
                  if (error) setError(null);
                }}
                placeholder="Ex: Consultório Médico / Clínica Vida"
                className="w-full text-base px-3.5 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
              />
            </div>

            <div>
              <label
                htmlFor="input-establishment-address"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Endereço <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="input-establishment-address"
                required
                rows={3}
                value={address}
                onChange={(e) => {
                  onUpdate(name, e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Ex: Av. Central, 450 - Sala 302, Centro - SP"
                className="w-full text-base px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow resize-none"
              />
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="pt-6 space-y-3">
          <button
            type="submit"
            id="btn-establishment-continue"
            className="w-full py-4 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-base shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>CONTINUAR</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            id="btn-establishment-back"
            onClick={onBack}
            className="w-full py-3.5 px-6 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>
        </div>
      </form>
    </div>
  );
};
