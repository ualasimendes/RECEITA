import React, { useState } from 'react';
import { Stethoscope, ArrowLeft, ArrowRight, AlertCircle, Tag, Calendar, MapPin } from 'lucide-react';
import { BRAZILIAN_STATES, CouncilType } from '../../types';
import { PrescriberStamp } from '../PrescriberStamp';
import {
  cleanLetterOnlyInput,
  validatePersonName,
  cleanDigitsOnlyInput,
  validateNumberOnly,
  validateCalendarDate,
  cleanStreetNameInput,
  validateStreetName,
} from '../../utils/validators';

interface PrescriberStepProps {
  name: string;
  councilType: CouncilType;
  crm: string;
  uf: string;
  street: string;
  number: string;
  complement?: string;
  prescriptionDate: string;
  onUpdate: (data: {
    name: string;
    councilType: CouncilType;
    crm: string;
    uf: string;
    street: string;
    number: string;
    complement: string;
    prescriptionDate: string;
  }) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PrescriberStep: React.FC<PrescriberStepProps> = ({
  name,
  councilType,
  crm,
  uf,
  street,
  number,
  complement = '',
  prescriptionDate,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Nome do emitente: apenas letras
    const nameValidation = validatePersonName(name, 'Nome do emitente');
    if (!nameValidation.valid) {
      setError(nameValidation.message || 'O nome do emitente deve conter apenas letras, sem números.');
      document.getElementById('input-prescriber-name-step')?.focus();
      return;
    }

    // 2. Registro no conselho (CRM / CRO / CRMV): apenas números
    const crmValidation = validateNumberOnly(crm, `Número do ${councilType}`, 3, 10);
    if (!crmValidation.valid) {
      setError(crmValidation.message || `O número do ${councilType} deve conter apenas números.`);
      document.getElementById('input-prescriber-crm-step')?.focus();
      return;
    }

    if (!uf) {
      setError(`Por favor, selecione a UF do seu ${councilType}.`);
      return;
    }

    // 3. Nome da rua: apenas letras (sem números)
    const streetValidation = validateStreetName(street);
    if (!streetValidation.valid) {
      setError(streetValidation.message || 'O nome da rua deve conter apenas letras.');
      document.getElementById('input-prescriber-street-step')?.focus();
      return;
    }

    // 4. Número do endereço: apenas números
    const numberValidation = validateNumberOnly(number, 'Número do endereço', 1, 8);
    if (!numberValidation.valid) {
      setError(numberValidation.message || 'O número do endereço deve conter apenas números.');
      document.getElementById('input-prescriber-number-step')?.focus();
      return;
    }

    // 5. Data da receita: data real no calendário
    const dateValidation = validateCalendarDate(prescriptionDate, 'Data da prescrição');
    if (!dateValidation.valid) {
      setError(dateValidation.message || 'Por favor, informe uma data válida.');
      document.getElementById('input-prescriber-date-step')?.focus();
      return;
    }

    setError(null);
    onNext();
  };

  return (
    <div
      id="step-prescriber"
      className="max-w-xl mx-auto min-h-[calc(100vh-65px)] flex flex-col justify-between px-4 py-4 sm:py-6"
    >
      <form onSubmit={handleContinue} className="space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Cabeçalho da Etapa */}
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-2">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Identificação do emitente (prescritor)
            </h1>
            <p className="text-sm text-slate-500">
              Esses dados serão usados tanto no cabeçalho oficial da receita quanto no carimbo profissional.
            </p>
          </div>

          {/* Erro de Validação */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Campos do Emitente */}
          <div className="space-y-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            {/* Campo Nome: Apenas Letras */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="input-prescriber-name-step"
                  className="block text-sm font-bold text-slate-800"
                >
                  Nome completo do emitente <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  Apenas letras (sem números)
                </span>
              </div>
              <input
                id="input-prescriber-name-step"
                type="text"
                required
                value={name}
                onChange={(e) => {
                  const cleanName = cleanLetterOnlyInput(e.target.value);
                  onUpdate({
                    name: cleanName,
                    councilType,
                    crm,
                    uf,
                    street,
                    number,
                    complement,
                    prescriptionDate,
                  });
                  if (error) setError(null);
                }}
                placeholder="Ex: Dra. Juliana Fernandes Silveira"
                className="w-full text-lg sm:text-xl font-semibold px-4 py-3.5 rounded-xl border-2 border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all shadow-xs"
              />
            </div>

            {/* Conselho Profissional: CRM, CRO ou CRMV */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Conselho profissional <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {(['CRM', 'CRO', 'CRMV'] as CouncilType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      onUpdate({
                        name,
                        councilType: type,
                        crm,
                        uf,
                        street,
                        number,
                        complement,
                        prescriptionDate,
                      });
                    }}
                    className={`py-3 px-3 rounded-xl text-sm font-black transition-all border text-center ${
                      councilType === type
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm ring-2 ring-sky-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {type}
                    <span className="block text-[10px] font-medium opacity-90">
                      {type === 'CRM' ? 'Médico' : type === 'CRO' ? 'Dentista' : 'Veterinário'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Registro (Apenas números) e UF */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="input-prescriber-crm-step"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                  >
                    Número do {councilType} <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Apenas números
                  </span>
                </div>
                <input
                  id="input-prescriber-crm-step"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  value={crm}
                  onChange={(e) => {
                    const cleanCrm = cleanDigitsOnlyInput(e.target.value);
                    onUpdate({
                      name,
                      councilType,
                      crm: cleanCrm,
                      uf,
                      street,
                      number,
                      complement,
                      prescriptionDate,
                    });
                    if (error) setError(null);
                  }}
                  placeholder="Ex: 123456"
                  className="w-full text-lg font-mono font-bold px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
                />
              </div>

              <div>
                <label
                  htmlFor="select-prescriber-uf-step"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  UF do {councilType} <span className="text-rose-500">*</span>
                </label>
                <select
                  id="select-prescriber-uf-step"
                  required
                  value={uf}
                  onChange={(e) => {
                    onUpdate({
                      name,
                      councilType,
                      crm,
                      uf: e.target.value,
                      street,
                      number,
                      complement,
                      prescriptionDate,
                    });
                  }}
                  className="w-full text-base font-semibold px-3.5 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
                >
                  {BRAZILIAN_STATES.map((st) => (
                    <option key={st.uf} value={st.uf}>
                      {st.uf} — {st.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ENDEREÇO DO EMITENTE: RUA + NÚMERO (CAMPOS SEPARADOS) */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 mb-2.5">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Endereço do emitente (consultório / clínica)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Nome da rua: apenas letras */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="input-prescriber-street-step"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      Nome da rua / avenida <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Apenas letras
                    </span>
                  </div>
                  <input
                    id="input-prescriber-street-step"
                    type="text"
                    required
                    value={street}
                    onChange={(e) => {
                      const cleanStreet = cleanStreetNameInput(e.target.value);
                      onUpdate({
                        name,
                        councilType,
                        crm,
                        uf,
                        street: cleanStreet,
                        number,
                        complement,
                        prescriptionDate,
                      });
                      if (error) setError(null);
                    }}
                    placeholder="Ex: Avenida Rio Branco"
                    className="w-full text-base px-3.5 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
                  />
                </div>

                {/* Número do endereço: apenas números */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="input-prescriber-number-step"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      Número <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Apenas números
                    </span>
                  </div>
                  <input
                    id="input-prescriber-number-step"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    value={number}
                    onChange={(e) => {
                      const cleanNumber = cleanDigitsOnlyInput(e.target.value);
                      onUpdate({
                        name,
                        councilType,
                        crm,
                        uf,
                        street,
                        number: cleanNumber,
                        complement,
                        prescriptionDate,
                      });
                      if (error) setError(null);
                    }}
                    placeholder="Ex: 156"
                    className="w-full text-base px-3.5 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
                  />
                </div>
              </div>

              {/* Complemento / Bairro / Cidade (opcional) */}
              <div className="mt-3">
                <label
                  htmlFor="input-prescriber-comp-step"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Complemento / Bairro / Cidade <span className="text-slate-400 font-normal">(Opcional)</span>
                </label>
                <input
                  id="input-prescriber-comp-step"
                  type="text"
                  value={complement}
                  onChange={(e) => {
                    onUpdate({
                      name,
                      councilType,
                      crm,
                      uf,
                      street,
                      number,
                      complement: e.target.value,
                      prescriptionDate,
                    });
                  }}
                  placeholder="Ex: Sala 402, Centro - Rio de Janeiro"
                  className="w-full text-base px-3.5 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
                />
              </div>
            </div>

            {/* Campo Data da Prescrição: Data tem que ser data */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="input-prescriber-date-step"
                  className="block text-xs font-semibold text-slate-700 flex items-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  Data da emissão da receita <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  Data de calendário válida
                </span>
              </div>
              <input
                id="input-prescriber-date-step"
                type="date"
                required
                value={prescriptionDate}
                onChange={(e) => {
                  onUpdate({
                    name,
                    councilType,
                    crm,
                    uf,
                    street,
                    number,
                    complement,
                    prescriptionDate: e.target.value,
                  });
                  if (error) setError(null);
                }}
                className="w-full text-base px-3.5 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
              />
            </div>
          </div>

          {/* Prévia da Identificação do Emitente / Carimbo */}
          <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-sky-700" />
                Identificação do emitente e carimbo
              </span>
              <span className="text-[10px] text-slate-500 font-medium bg-white px-2 py-0.5 rounded-md border border-slate-200">
                Cabeçalho + Carimbo
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Conforme exigido pelas normas sanitárias, todos os dados do emitente constam tanto no cabeçalho oficial da receita quanto no carimbo profissional ao lado da assinatura:
            </p>

            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center">
              <PrescriberStamp
                name={name || 'NOME DO PROFISSIONAL'}
                crm={crm || '000000'}
                uf={uf || 'UF'}
                councilType={councilType}
                street={street}
                number={number}
                complement={complement}
                showSignatureLine={true}
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="pt-6 space-y-3">
          <button
            type="submit"
            id="btn-prescriber-continue"
            className="w-full py-4 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-base shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>CONTINUAR</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            id="btn-prescriber-back"
            onClick={onBack}
            className="w-full py-3.5 px-6 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao início</span>
          </button>
        </div>
      </form>
    </div>
  );
};
