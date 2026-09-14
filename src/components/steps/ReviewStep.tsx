import React from 'react';
import {
  FileCheck2,
  User,
  Pill,
  FileText,
  Stethoscope,
  Edit2,
  ArrowLeft,
  CheckCircle,
  Calendar,
  MapPin,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { PrescriptionData, FlowStep } from '../../types';
import { PrescriberStamp } from '../PrescriberStamp';
import { formatCpf, validatePatientBirthDate } from '../../utils/validators';

interface ReviewStepProps {
  data: PrescriptionData;
  isGenerating: boolean;
  onEditSection: (step: FlowStep) => void;
  onGenerate: () => void;
  onBack: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  data,
  isGenerating,
  onEditSection,
  onGenerate,
  onBack,
}) => {
  const patientBirth = data.patientBirthDate ? validatePatientBirthDate(data.patientBirthDate) : null;
  const formattedPrescriberAddress = `${data.prescriberStreet}, ${data.prescriberNumber}${
    data.prescriberComplement ? ` - ${data.prescriberComplement}` : ''
  }`;

  return (
    <div
      id="step-review"
      className="max-w-xl mx-auto min-h-[calc(100vh-65px)] flex flex-col justify-between px-4 py-4 sm:py-6"
    >
      <div className="space-y-4 flex-1">
        {/* Cabeçalho da Etapa */}
        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-2">
            <CheckCircle className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Receituário de Controle Especial
          </h1>
          <p className="text-xs text-slate-400">
            gerado manualmente através do site receita.walacemendes.com.br
          </p>
          <p className="text-sm text-slate-500 pt-1">
            Revise com atenção todos os dados antes de gerar o PDF em folha A4 com duas vias (Farmácia e Paciente).
          </p>
        </div>

        {/* 1. Emitente / Prescritor (identificação no cabeçalho e no carimbo) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs uppercase tracking-wider">
              <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
              <span>Emitente (Cabeçalho da Receita e Carimbo Profissional)</span>
            </div>
            <button
              type="button"
              onClick={() => onEditSection('prescriber')}
              className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-semibold px-2 py-1 rounded-md hover:bg-sky-50 transition-colors cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Editar</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="text-sm space-y-2 text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-900 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                Presente no cabeçalho e no carimbo
              </div>
              <p className="font-black text-slate-950 text-lg sm:text-xl">{data.prescriberName}</p>
              <p className="text-sm text-slate-800 font-bold">
                {data.councilType || 'CRM'}: {data.prescriberCrm} — {data.prescriberUf}
              </p>
              <p className="text-xs sm:text-sm text-slate-700 flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{formattedPrescriberAddress}</span>
              </p>
              {data.prescriberCpf && (
                <p className="text-xs sm:text-sm text-slate-700 font-mono font-medium">
                  CPF: {formatCpf(data.prescriberCpf)}
                </p>
              )}
              {data.prescriptionDate && (
                <p className="text-xs sm:text-sm text-sky-800 font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Emissão: {data.prescriptionDate.split('-').reverse().join('/')}</span>
                </p>
              )}
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs shrink-0">
              <PrescriberStamp
                name={data.prescriberName}
                crm={data.prescriberCrm}
                uf={data.prescriberUf}
                councilType={data.councilType}
                address={formattedPrescriberAddress}
                isAnabolic={data.isAnabolic}
                prescriberCpf={data.prescriberCpf}
                showSignatureLine={true}
                size="md"
              />
            </div>
          </div>
        </div>

        {/* 2. Paciente */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-sky-600" />
              <span>Paciente</span>
            </div>
            <button
              type="button"
              onClick={() => onEditSection('patient')}
              className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-semibold px-2 py-1 rounded-md hover:bg-sky-50 transition-colors cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Editar</span>
            </button>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex items-baseline justify-between">
              <p className="font-bold text-slate-900">{data.patientName}</p>
              {patientBirth?.valid && patientBirth.age !== undefined && (
                <span className="text-xs text-slate-500 font-medium">
                  {patientBirth.age} {patientBirth.age === 1 ? 'ano' : 'anos'} ({data.patientBirthDate.split('-').reverse().join('/')})
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed flex items-start gap-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
              <span>{data.patientAddress}</span>
            </p>
          </div>
        </div>

        {/* 3. Prescrição (Medicamentos + Anabolizante) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs uppercase tracking-wider">
              <Pill className="w-3.5 h-3.5 text-sky-600" />
              <span>Prescrição ({data.medicines.length} medicamento{data.medicines.length > 1 ? 's' : ''})</span>
            </div>
            <button
              type="button"
              onClick={() => onEditSection('medicines')}
              className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-semibold px-2 py-1 rounded-md hover:bg-sky-50 transition-colors cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Editar</span>
            </button>
          </div>

          {/* Destaque se for anabolizante */}
          {data.isAnabolic && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1 text-amber-900">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>Medicamento Anabolizante — Regra ANVISA (Lei 9.965/2000)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px] text-amber-950">
                <p>CID: <strong>{data.cid}</strong></p>
                <p>CPF Emitente: <strong>{formatCpf(data.prescriberCpf || '')}</strong></p>
              </div>
            </div>
          )}

          <div className="space-y-2.5 divide-y divide-slate-100 text-sm">
            {data.medicines.map((med, idx) => (
              <div key={med.id} className={idx > 0 ? 'pt-2.5' : ''}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-bold text-slate-900 text-sm">
                        {idx + 1}. {med.name} — <span className="font-medium text-slate-600">{med.dosage}</span>
                      </p>
                      {med.quantity && (
                        <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-sm shrink-0">
                          Qtd: {med.quantity}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      <strong className="text-slate-700">Posologia:</strong> {med.instructions}
                    </p>
                  </div>
                  {/* Etiqueta impressa na receita */}
                  <div className="border border-slate-300 bg-slate-50/70 rounded-md px-2.5 py-1 text-[10px] font-mono text-slate-700 shrink-0 text-left shadow-2xs">
                    <div className="font-bold text-[7.5px] text-slate-400 border-b border-slate-200 pb-0.5 mb-0.5 text-center">
                      DISPENSAÇÃO
                    </div>
                    <div className="font-semibold text-slate-800">LOTE: <span className="text-slate-400 font-normal">_______</span></div>
                    <div className="font-semibold text-slate-800">VAL: <span className="text-slate-400 font-normal">____/____</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Observações (mostrar apenas se houver conteúdo) */}
        {data.observations && data.observations.trim().length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-sky-600" />
                <span>Observações</span>
              </div>
              <button
                type="button"
                onClick={() => onEditSection('observations')}
                className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-semibold px-2 py-1 rounded-md hover:bg-sky-50 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Editar</span>
              </button>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              "{data.observations}"
            </p>
          </div>
        )}

        {/* 5. ESTRUTURA DO RODAPÉ (3 CAMPOS SEPARADOS) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Rodapé Regulatório: 3 Campos Independentes</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
            <div className="border border-slate-200 bg-slate-50/70 p-3 rounded-xl space-y-1">
              <div className="font-bold text-slate-800 text-[11px] pb-1 border-b border-slate-200">
                1. Cliente Ciente
              </div>
              <p className="text-slate-600 text-[10.5px]">Nome e CPF (em vez de RG)</p>
              <p className="text-slate-500 text-[10px]">Endereço ampliado (duas linhas)</p>
              <p className="text-slate-500 text-[9.5px] italic">Termo de ciência sanitária</p>
              <div className="pt-2 border-t border-slate-200/60 text-[10px] font-semibold text-slate-700">
                Campo para assinatura do cliente
              </div>
            </div>

            <div className="border border-slate-200 bg-slate-50/70 p-3 rounded-xl space-y-1">
              <div className="font-bold text-slate-800 text-[11px] pb-1 border-b border-slate-200">
                2. Farmacêutico Conferente
              </div>
              <p className="text-slate-600 text-[10.5px]">Espaço para carimbo com CRF</p>
              <p className="text-slate-500 text-[10px]">Data da conferência</p>
              <div className="pt-2 border-t border-slate-200/60 text-[10px] font-semibold text-slate-700">
                Campo para assinatura do farmacêutico
              </div>
            </div>

            <div className="border border-slate-300 bg-white p-3 rounded-xl space-y-1 shadow-2xs">
              <div className="font-bold text-slate-800 text-[11px] pb-1 border-b border-slate-200">
                3. Médico Prescritor
              </div>
              <p className="text-slate-900 font-semibold text-[10.5px]">{data.prescriberName}</p>
              <p className="text-slate-600 text-[10px]">CRM-{data.prescriberUf} Nº {data.prescriberCrm}</p>
              <div className="pt-2 border-t border-slate-200/60 text-[10px] font-semibold text-slate-800">
                Campo para assinatura do médico
              </div>
            </div>
          </div>
        </div>

        {/* TERMO DE RESPONSABILIDADE MÉDICA (OBRIGATÓRIO) */}
        <div className="bg-amber-50/80 rounded-2xl border border-amber-200 p-4 text-xs text-amber-950 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Termo de Responsabilidade</span>
          </div>
          <div className="space-y-1.5 text-[11.5px] leading-relaxed text-amber-900/90">
            <p>
              • A ferramenta <strong>apenas auxilia na digitação e geração</strong> do documento.
            </p>
            <p>
              • O conteúdo da prescrição é de <strong>responsabilidade exclusiva do profissional médico prescritor</strong>.
            </p>
            <p>
              • O sistema <strong>não realiza diagnóstico</strong>, não prescreve automaticamente, não sugere medicamentos, não escolhe tratamentos, não cria assinatura, não simula assinatura, não cria carimbo e não finge validação médica.
            </p>
            <p className="font-semibold text-amber-950 pt-0.5">
              • O médico deve revisar todo o documento antes da assinatura.
            </p>
          </div>
        </div>
      </div>

      {/* Pergunta Final e Ações */}
      <div className="pt-4 space-y-3">
        <div className="text-center">
          <p className="text-sm font-bold text-slate-800">Tudo está correto?</p>
          <p className="text-xs text-slate-500">
            O documento será gerado em A4 com 1ª via (Drogaria) e 2ª via (Paciente).
          </p>
        </div>

        <button
          type="button"
          id="btn-confirm-generate"
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full py-4 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-base shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-75"
        >
          <FileCheck2 className="w-5 h-5" />
          <span>{isGenerating ? 'Gerando documento A4...' : 'GERAR RECEITA'}</span>
        </button>

        <button
          type="button"
          id="btn-review-back"
          onClick={onBack}
          className="w-full py-3.5 px-6 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
      </div>
    </div>
  );
};

