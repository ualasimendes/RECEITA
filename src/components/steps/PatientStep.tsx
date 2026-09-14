import React, { useState } from 'react';
import { User, ArrowLeft, ArrowRight, AlertCircle, Calendar, MapPin } from 'lucide-react';
import {
  cleanLetterOnlyInput,
  validatePersonName,
  validatePatientBirthDate,
} from '../../utils/validators';

interface PatientStepProps {
  name: string;
  birthDate: string;
  address: string;
  onUpdate: (name: string, birthDate: string, address: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PatientStep: React.FC<PatientStepProps> = ({
  name,
  birthDate,
  address,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [error, setError] = useState<string | null>(null);

  // Validação dinâmica da idade se preenchida
  const birthValidation = birthDate ? validatePatientBirthDate(birthDate) : null;

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

    // Regra 1: Nome tem que ser letra
    const nameValidation = validatePersonName(name, 'Nome do paciente');
    if (!nameValidation.valid) {
      setError(nameValidation.message || 'O nome deve conter apenas letras, sem números.');
      document.getElementById('input-patient-name')?.focus();
      return;
    }

    // Regra 2: Data de nascimento válida no calendário
    if (!birthDate) {
      setError('Por favor, informe a data de nascimento do paciente.');
      document.getElementById('input-patient-birthdate')?.focus();
      return;
    }
    const dateCheck = validatePatientBirthDate(birthDate);
    if (!dateCheck.valid) {
      setError(dateCheck.message || 'Por favor, informe uma data de nascimento válida.');
      document.getElementById('input-patient-birthdate')?.focus();
      return;
    }

    // Regra 3: Endereço completo
    if (!address.trim()) {
      setError('Por favor, informe o endereço completo do paciente.');
      document.getElementById('input-patient-address')?.focus();
      return;
    }

    setError(null);
    onNext();
  };

  return (
    <div
      id="step-patient"
      className="max-w-xl mx-auto min-h-[calc(100vh-65px)] flex flex-col justify-between px-4 py-4 sm:py-6"
    >
      <form onSubmit={handleContinue} className="space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-5">
          {/* Cabeçalho da Etapa */}
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-2">
              <User className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Identificação do paciente
            </h1>
            <p className="text-sm text-slate-500">
              Nome completo, data de nascimento e endereço do paciente.
            </p>
          </div>

          {/* Erro de Validação */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Formulário */}
          <div className="space-y-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            {/* Nome Completo: Apenas Letras */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="input-patient-name"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Nome completo do paciente <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  Apenas letras (sem números)
                </span>
              </div>
              <input
                id="input-patient-name"
                type="text"
                required
                value={name}
                onChange={(e) => {
                  const cleaned = cleanLetterOnlyInput(e.target.value);
                  onUpdate(cleaned, birthDate, address);
                  if (error) setError(null);
                }}
                placeholder="Ex: Carlos Eduardo de Souza"
                className="w-full text-base px-3.5 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
              />
            </div>

            {/* Data de Nascimento com Calendário */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="input-patient-birthdate"
                  className="block text-xs font-semibold text-slate-700 flex items-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  Data de nascimento <span className="text-rose-500">*</span>
                </label>
                {birthValidation?.valid && birthValidation.age !== undefined && (
                  <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                    {birthValidation.age} {birthValidation.age === 1 ? 'ano' : 'anos'}
                  </span>
                )}
              </div>
              <input
                id="input-patient-birthdate"
                type="date"
                required
                value={birthDate}
                onChange={(e) => {
                  onUpdate(name, e.target.value, address);
                  if (error) setError(null);
                }}
                className="w-full text-base px-3.5 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Data do calendário (dia, mês e ano).
              </p>
            </div>

            {/* Endereço Completo */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="input-patient-address"
                  className="block text-xs font-semibold text-slate-700 flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  Endereço completo <span className="text-rose-500">*</span>
                </label>
              </div>
              <textarea
                id="input-patient-address"
                required
                rows={3}
                value={address}
                onChange={(e) => {
                  onUpdate(name, birthDate, e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Ex: Rua São Clemente, 240, Apto 502, Botafogo - Rio de Janeiro/RJ"
                className="w-full text-base px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow resize-none"
              />
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="pt-6 space-y-3">
          <button
            type="submit"
            id="btn-patient-continue"
            className="w-full py-4 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-base shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>CONTINUAR</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            id="btn-patient-back"
            onClick={onBack}
            className="w-full py-3.5 px-6 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao emitente</span>
          </button>
        </div>
      </form>
    </div>
  );
};
