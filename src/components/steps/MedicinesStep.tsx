import React, { useState } from 'react';
import { Pill, Plus, ArrowLeft, ArrowRight, AlertCircle, Trash2, ShieldAlert, FileText, UserCheck } from 'lucide-react';
import { MedicineItem } from '../../types';
import { PosologyShortcuts } from '../PosologyShortcuts';
import {
  cleanDigitsOnlyInput,
  formatCpf,
  validateCpf,
  validateCid,
} from '../../utils/validators';

interface MedicinesStepProps {
  medicines: MedicineItem[];
  isAnabolic: boolean;
  cid?: string;
  prescriberCpf?: string;
  onUpdateMedicine: (id: string, field: keyof MedicineItem, value: string) => void;
  onAddMedicine: () => void;
  onRemoveMedicine: (id: string) => void;
  onUpdateAnabolic: (isAnabolic: boolean, cid: string, prescriberCpf: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const MedicinesStep: React.FC<MedicinesStepProps> = ({
  medicines,
  isAnabolic,
  cid = '',
  prescriberCpf = '',
  onUpdateMedicine,
  onAddMedicine,
  onRemoveMedicine,
  onUpdateAnabolic,
  onNext,
  onBack,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

    if (medicines.length === 0) {
      setError('Adicione pelo menos um medicamento.');
      return;
    }

    for (let i = 0; i < medicines.length; i++) {
      const med = medicines[i];
      if (!med.name.trim()) {
        setError(`Informe o nome do Medicamento ${i + 1}.`);
        document.getElementById(`med-name-${med.id}`)?.focus();
        return;
      }
      if (!med.dosage.trim()) {
        setError(`Informe a dosagem do Medicamento ${i + 1}.`);
        document.getElementById(`med-dosage-${med.id}`)?.focus();
        return;
      }
      if (!med.instructions.trim()) {
        setError(`Informe a posologia do Medicamento ${i + 1}.`);
        document.getElementById(`med-instructions-${med.id}`)?.focus();
        return;
      }
    }

    // REGRA ANVISA: SE MEDICAMENTO É ANABOLIZANTE, CID E CPF DO PRESCRITOR SÃO OBRIGATÓRIOS
    if (isAnabolic) {
      const cidValidation = validateCid(cid);
      if (!cidValidation.valid) {
        setError(cidValidation.message || 'Informe o CID válido para prescrição de anabolizante.');
        document.getElementById('input-anabolic-cid')?.focus();
        return;
      }

      const cpfValidation = validateCpf(prescriberCpf);
      if (!cpfValidation.valid) {
        setError(cpfValidation.message || 'Informe um CPF válido do prescritor.');
        document.getElementById('input-anabolic-cpf')?.focus();
        return;
      }
    }

    setError(null);
    onNext();
  };

  return (
    <div
      id="step-medicines"
      className="max-w-xl mx-auto min-h-[calc(100vh-65px)] flex flex-col justify-between px-4 py-4 sm:py-6"
    >
      <form onSubmit={handleContinue} className="space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Cabeçalho da Etapa */}
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-2">
              <Pill className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Prescrição de medicamentos
              </h1>
              <span className="text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
                {medicines.length} de 3 máx.
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Informe os medicamentos, a dosagem e a posologia (com atalhos rápidos ou digitação livre).
            </p>
          </div>

          {/* Erro de Validação */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Lista de Medicamentos (1 a 3) */}
          <div className="space-y-4">
            {medicines.map((med, index) => (
              <div
                key={med.id}
                id={`medicamento-card-${index + 1}`}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3.5 transition-all"
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-sky-600 text-white flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    Medicamento {index + 1}
                  </span>

                  {medicines.length > 1 && (
                    <button
                      type="button"
                      id={`btn-remove-med-${index + 1}`}
                      onClick={() => onRemoveMedicine(med.id)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded-md hover:bg-rose-50 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remover</span>
                    </button>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={`med-name-${med.id}`}
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Medicamento <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id={`med-name-${med.id}`}
                    type="text"
                    required
                    value={med.name}
                    onChange={(e) => {
                      onUpdateMedicine(med.id, 'name', e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Ex: Oxandrolona, Cipionato de Testosterona, Amoxicilina etc."
                    className="w-full text-base px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`med-dosage-${med.id}`}
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Dosagem / concentração <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id={`med-dosage-${med.id}`}
                    type="text"
                    required
                    value={med.dosage}
                    onChange={(e) => {
                      onUpdateMedicine(med.id, 'dosage', e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Ex: 10mg, 250mg/mL, 1 ampola ou 60 cápsulas"
                    className="w-full text-base px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor={`med-instructions-${med.id}`}
                      className="block text-xs font-semibold text-slate-700"
                    >
                      Posologia (modo de uso) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Digitação livre ou atalhos
                    </span>
                  </div>
                  <textarea
                    id={`med-instructions-${med.id}`}
                    required
                    rows={2}
                    value={med.instructions}
                    onChange={(e) => {
                      onUpdateMedicine(med.id, 'instructions', e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Ex: Administrar 1 comprimido pela manhã por 30 dias"
                    className="w-full text-base px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow resize-none"
                  />

                  <PosologyShortcuts
                    value={med.instructions}
                    onChange={(newVal) => onUpdateMedicine(med.id, 'instructions', newVal)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Botão para Adicionar Medicamento (limite de 3) */}
          {medicines.length < 3 ? (
            <button
              type="button"
              id="btn-add-medicine-step"
              onClick={onAddMedicine}
              className="w-full py-3.5 px-4 border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/60 hover:bg-sky-50 text-sky-800 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ ADICIONAR MEDICAMENTO ({medicines.length + 1} de 3)</span>
            </button>
          ) : (
            <div className="p-3 bg-slate-100 rounded-xl text-center text-xs text-slate-500 border border-slate-200">
              Limite de 3 medicamentos atingido nesta receita.
            </div>
          )}

          {/* CAMPO DE PERGUNTA: MEDICAMENTO É ANABOLIZANTE? */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                  Classificação Especial
                </span>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  O medicamento é anabolizante?
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Exige dados complementares conforme Lei 9.965/2000 e normas da ANVISA.
                </p>
              </div>

              {/* Botões Sim / Não */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start sm:self-center">
                <button
                  type="button"
                  id="btn-anabolic-no"
                  onClick={() => {
                    onUpdateAnabolic(false, '', '');
                    if (error) setError(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    !isAnabolic
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  NÃO
                </button>
                <button
                  type="button"
                  id="btn-anabolic-yes"
                  onClick={() => {
                    onUpdateAnabolic(true, cid, prescriberCpf);
                    if (error) setError(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isAnabolic
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  SIM
                </button>
              </div>
            </div>

            {/* SE SIM, ABRIR CAMPOS OBRIGATÓRIOS CONFORME REGRA ANVISA: CID E CPF DO PRESCRITOR */}
            {isAnabolic && (
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 sm:p-4 space-y-3.5">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-950">
                    <strong className="font-bold block text-amber-900">
                      Exigência Legal ANVISA (Lei Federal nº 9.965/2000):
                    </strong>
                    <span>
                      A prescrição de medicamentos anabolizantes exige obrigatoriamente a identificação do <strong>CID</strong> e do <strong>CPF do emitente</strong> na receita.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Campo CID */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="input-anabolic-cid"
                        className="block text-xs font-bold text-amber-950 flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        CID do paciente <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-amber-800">
                        Classificação CID-10
                      </span>
                    </div>
                    <input
                      id="input-anabolic-cid"
                      type="text"
                      required={isAnabolic}
                      value={cid}
                      onChange={(e) => {
                        onUpdateAnabolic(true, e.target.value.toUpperCase(), prescriberCpf);
                        if (error) setError(null);
                      }}
                      placeholder="Ex: E29.1, E34.9 ou M62.5"
                      className="w-full text-base uppercase px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow"
                    />
                  </div>

                  {/* Campo CPF do Prescritor */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="input-anabolic-cpf"
                        className="block text-xs font-bold text-amber-950 flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                        CPF do prescritor <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-amber-800">
                        Apenas números
                      </span>
                    </div>
                    <input
                      id="input-anabolic-cpf"
                      type="text"
                      inputMode="numeric"
                      required={isAnabolic}
                      value={formatCpf(prescriberCpf)}
                      onChange={(e) => {
                        const rawDigits = cleanDigitsOnlyInput(e.target.value).slice(0, 11);
                        onUpdateAnabolic(true, cid, rawDigits);
                        if (error) setError(null);
                      }}
                      placeholder="000.000.000-00"
                      className="w-full text-base px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="pt-6 space-y-3">
          <button
            type="submit"
            id="btn-medicines-continue"
            className="w-full py-4 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-base shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>CONTINUAR</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            id="btn-medicines-back"
            onClick={onBack}
            className="w-full py-3.5 px-6 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao paciente</span>
          </button>
        </div>
      </form>
    </div>
  );
};
