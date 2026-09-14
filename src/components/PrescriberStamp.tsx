import React from 'react';
import { Award, PenTool } from 'lucide-react';
import { CouncilType } from '../types';
import { formatCpf } from '../utils/validators';

interface PrescriberStampProps {
  name: string;
  crm: string;
  uf: string;
  street?: string;
  number?: string;
  complement?: string;
  address?: string;
  councilType?: CouncilType;
  prescriberCpf?: string;
  isAnabolic?: boolean;
  showSignatureLine?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const COUNCIL_LABELS: Record<CouncilType, string> = {
  CRM: 'MÉDICO PRESCRITOR',
  CRO: 'CIRURGIÃO-DENTISTA',
  CRMV: 'MÉDICO-VETERINÁRIO',
};

export const PrescriberStamp: React.FC<PrescriberStampProps> = ({
  name,
  crm,
  uf,
  street,
  number,
  complement,
  address,
  councilType = 'CRM',
  prescriberCpf,
  isAnabolic = false,
  showSignatureLine = true,
  size = 'md',
  className = '',
}) => {
  const displayName = name.trim() ? name.trim().toUpperCase() : 'NOME DO PROFISSIONAL';
  const displayUf = uf.trim() ? uf.trim().toUpperCase() : 'UF';
  const displayCrm = crm.trim() ? crm.trim() : '000000';
  const councilLabel = COUNCIL_LABELS[councilType] || 'PRESCRITOR';

  // Monta o endereço do emitente se disponível
  const fullAddress = address?.trim()
    ? address.trim()
    : street?.trim()
    ? `${street.trim()}${number?.trim() ? `, nº ${number.trim()}` : ''}${
        complement?.trim() ? ` - ${complement.trim()}` : ''
      }`
    : '';

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      {/* DESENHO DO CARIMBO PROFISSIONAL LAYOUTIZADO */}
      <div
        className={`relative bg-gradient-to-b from-white to-slate-50/90 text-center transition-all ${
          isSmall
            ? 'p-2.5 min-w-[200px] max-w-[250px]'
            : isLarge
            ? 'p-4 min-w-[310px] max-w-[380px]'
            : 'p-3 min-w-[260px] max-w-[320px]'
        } rounded-lg border-2 border-slate-900 shadow-sm`}
        style={{
          boxShadow: '0 2px 8px -1px rgba(15, 23, 42, 0.1), inset 0 0 0 1px rgba(15, 23, 42, 0.05)',
        }}
      >
        {/* Moldura dupla interna com cantos ornamentados de carimbo físico */}
        <div className="border border-slate-700/80 rounded-xs px-3 py-2.5 relative bg-white/70">
          {/* Marcadores de canto clássicos de carimbo médico */}
          <span className="absolute -top-1 -left-1 text-[9px] font-mono text-slate-800 leading-none">◤</span>
          <span className="absolute -top-1 -right-1 text-[9px] font-mono text-slate-800 leading-none">◥</span>
          <span className="absolute -bottom-1 -left-1 text-[9px] font-mono text-slate-800 leading-none">◣</span>
          <span className="absolute -bottom-1 -right-1 text-[9px] font-mono text-slate-800 leading-none">◢</span>

          {/* Cabeçalho do Carimbo com Ícone */}
          <div className="flex items-center justify-center gap-1 mb-1 opacity-85">
            <Award className={isSmall ? 'w-3 h-3 text-sky-800' : 'w-3.5 h-3.5 text-sky-800'} />
            <span
              className={`font-bold uppercase tracking-widest text-slate-600 font-mono ${
                isSmall ? 'text-[8px]' : 'text-[9.5px]'
              }`}
            >
              {councilLabel}
            </span>
          </div>

          {/* Nome do Profissional em destaque com fonte ampliada */}
          <p
            className={`font-black tracking-tight text-slate-950 leading-snug border-b border-slate-200 pb-1.5 ${
              isSmall ? 'text-xs' : isLarge ? 'text-base font-black' : 'text-sm font-black'
            }`}
          >
            {displayName}
          </p>

          {/* Bloco de Registro Profissional CRM / CRO / CRMV com fonte ampliada */}
          <div className="pt-1.5 flex items-center justify-center gap-2 font-mono">
            <span
              className={`font-extrabold text-slate-900 tracking-wider ${
                isSmall ? 'text-[11px]' : isLarge ? 'text-sm' : 'text-xs'
              }`}
            >
              {councilType}-{displayUf}
            </span>
            <span className="text-slate-400 font-bold">•</span>
            <span
              className={`font-black text-sky-950 tracking-widest ${
                isSmall ? 'text-[11px]' : isLarge ? 'text-[13px]' : 'text-xs'
              }`}
            >
              Nº {displayCrm}
            </span>
          </div>

          {/* Endereço do Emitente impresso no carimbo */}
          {fullAddress && (
            <div className="mt-1.5 pt-1 border-t border-slate-100">
              <p
                className={`text-slate-600 font-sans tracking-tight line-clamp-1 ${
                  isSmall ? 'text-[8.5px]' : 'text-[10px]'
                }`}
              >
                {fullAddress}
              </p>
            </div>
          )}

          {/* Se for anabolizante ou tiver CPF, CPF impresso no carimbo */}
          {((isAnabolic && prescriberCpf) || (prescriberCpf && prescriberCpf.length === 11)) && (
            <div className="mt-1.5 pt-1 border-t border-slate-200 text-center font-mono">
              <span className="text-[10px] font-bold text-slate-800 block">
                CPF: {formatCpf(prescriberCpf)}
              </span>
              {isAnabolic && (
                <span className="text-[8px] text-amber-800 font-sans block font-semibold">
                  Exigência ANVISA / Lei 9.965
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Linha de Assinatura logo abaixo do carimbo */}
      {showSignatureLine && (
        <div className="w-full mt-2 text-center">
          <div className="flex items-center justify-center">
            <div className="border-b border-slate-800 w-full max-w-[180px] h-2"></div>
          </div>
          <p className="text-[10px] text-slate-700 font-medium mt-1 leading-tight">
            Assinatura
          </p>
        </div>
      )}
    </div>
  );
};
