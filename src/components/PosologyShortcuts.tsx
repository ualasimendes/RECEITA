import React, { useMemo } from 'react';
import { Clock, Pill, Calendar, RefreshCw } from 'lucide-react';

interface PosologyShortcutsProps {
  value: string;
  onChange: (newValue: string) => void;
}

export const PosologyShortcuts: React.FC<PosologyShortcutsProps> = ({ value, onChange }) => {
  // Doses disponíveis
  const doses = [
    { label: '1 cp', value: '1 cp' },
    { label: '2 cp', value: '2 cp' },
    { label: '1 cápsula', value: '1 cápsula' },
    { label: '20 gotas', value: '20 gotas' },
    { label: '30 gotas', value: '30 gotas' },
  ];

  // Frequências (exibição no botão e texto canônico de inserção)
  const frequencies = [
    { label: '4/4h', value: '4 em 4 horas' },
    { label: '6/6h', value: '6 em 6 horas' },
    { label: '8/8h', value: '8 em 8 horas' },
    { label: '12/12h', value: '12 em 12 horas' },
    { label: '24/24h', value: '24 em 24 horas' },
    { label: '1x/dia', value: 'uma vez ao dia' },
  ];

  // Opções de Duração / Dias (incluindo SOS conforme solicitado)
  const durations = [
    { label: 'SOS', value: 'SOS', isSpecial: true },
    { label: '5 dias', value: '5 dias' },
    { label: '7 dias', value: '7 dias' },
    { label: '10 dias', value: '10 dias' },
    { label: '14 dias', value: '14 dias' },
    { label: '30 dias', value: '30 dias' },
    { label: 'Uso contínuo', value: 'Uso contínuo' },
  ];

  // Detecta o que já está selecionado/escrito na frase atual
  const parsed = useMemo(() => {
    const text = value || '';
    
    // Detecta Dose
    let currentDose = '';
    for (const d of doses) {
      const regex = new RegExp(`\\b${d.value.replace(' ', '\\s*')}\\b`, 'i');
      if (regex.test(text)) {
        currentDose = d.value;
        break;
      }
    }
    // Fallback dose comum
    if (!currentDose && /\b1\s*(?:comprimido|cp)\b/i.test(text)) currentDose = '1 cp';
    if (!currentDose && /\b2\s*(?:comprimidos|cp)\b/i.test(text)) currentDose = '2 cp';

    // Detecta Frequência
    let currentFreq = '';
    for (const f of frequencies) {
      const regexLabel = new RegExp(`\\b${f.label.replace('/', '\\/')}\\b`, 'i');
      const regexVal = new RegExp(`\\b${f.value.replace(/ /g, '\\s*')}\\b`, 'i');
      if (regexLabel.test(text) || regexVal.test(text)) {
        currentFreq = f.value;
        break;
      }
    }

    // Detecta Duração
    let currentDur = '';
    if (/\b(?:durante\s+)?SOS\b/i.test(text)) {
      currentDur = 'SOS';
    } else if (/\b(?:uso\s+cont[íi]nuo|cont[íi]nuo)\b/i.test(text)) {
      currentDur = 'Uso contínuo';
    } else {
      for (const du of durations) {
        if (du.value !== 'SOS' && du.value !== 'Uso contínuo') {
          const regex = new RegExp(`\\b${du.value}\\b`, 'i');
          if (regex.test(text)) {
            currentDur = du.value;
            break;
          }
        }
      }
    }

    return { currentDose, currentFreq, currentDur };
  }, [value]);

  // Função central que monta SEMPRE a frase na ordem exata solicitada:
  // Tomar [1 cp] de [8 em 8 horas] durante [7 dias]
  // Cada campo só adiciona uma única vez (sem somar, sem duplicar ao clicar repetidamente)
  const buildAndSet = (newDose?: string, newFreq?: string, newDur?: string) => {
    const doseToUse = newDose !== undefined ? newDose : (parsed.currentDose || '1 cp');
    const freqToUse = newFreq !== undefined ? newFreq : parsed.currentFreq;
    const durToUse = newDur !== undefined ? newDur : parsed.currentDur;

    // Ordem estrita: Tomar [dose] de [frequência] durante [duração]
    const parts: string[] = [];
    parts.push(`Tomar ${doseToUse}`);

    if (freqToUse) {
      parts.push(`de ${freqToUse}`);
    }

    if (durToUse) {
      if (durToUse.toUpperCase() === 'SOS') {
        parts.push('durante SOS');
      } else if (durToUse.toLowerCase() === 'uso contínuo') {
        parts.push('em uso contínuo');
      } else {
        parts.push(`durante ${durToUse}`);
      }
    }

    const finalSentence = parts.join(' ').trim() + '.';
    onChange(finalSentence);
  };

  const handleSelectDose = (doseVal: string) => {
    buildAndSet(doseVal, undefined, undefined);
  };

  const handleSelectFrequency = (freqVal: string) => {
    buildAndSet(undefined, freqVal, undefined);
  };

  const handleSelectDuration = (durVal: string) => {
    buildAndSet(undefined, undefined, durVal);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 shadow-2xs">
      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
        <span className="flex items-center gap-1.5 text-sky-800">
          <Clock className="w-3.5 h-3.5 text-sky-600" />
          Atalhos de Posologia Rápida
        </span>
        <span className="text-[10px] text-slate-500 font-normal">
          Ordem fixa: <strong className="text-slate-700">Tomar [dose] de [freq] durante [dias]</strong>
        </span>
      </div>

      {/* Linha 1: Dose */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider min-w-[50px] flex items-center gap-1">
          <Pill className="w-3 h-3 text-slate-400" />
          Dose:
        </span>
        {doses.map((d) => {
          const isSelected = parsed.currentDose === d.value;
          return (
            <button
              key={d.label}
              type="button"
              onClick={() => handleSelectDose(d.value)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer shadow-2xs active:scale-95 ${
                isSelected
                  ? 'bg-sky-600 text-white border-sky-600 ring-2 ring-sky-200'
                  : 'bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 border-slate-200 hover:border-sky-300'
              }`}
              title={`Selecionar dose: ${d.label}`}
            >
              {d.label}
            </button>
          );
        })}
      </div>

      {/* Linha 2: Frequência */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider min-w-[50px] flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          Freq:
        </span>
        {frequencies.map((f) => {
          const isSelected = parsed.currentFreq === f.value;
          return (
            <button
              key={f.label}
              type="button"
              onClick={() => handleSelectFrequency(f.value)}
              className={`text-xs font-semibold px-2 py-1 rounded-lg border transition-all cursor-pointer font-mono shadow-2xs active:scale-95 ${
                isSelected
                  ? 'bg-sky-600 text-white border-sky-600 ring-2 ring-sky-200'
                  : 'bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 border-slate-200 hover:border-sky-300'
              }`}
              title={`Frequência: ${f.value}`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Linha 3: Duração / Dias (com SOS em destaque) */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider min-w-[50px] flex items-center gap-1">
          <Calendar className="w-3 h-3 text-slate-400" />
          Dias:
        </span>
        {durations.map((dur) => {
          const isSelected = parsed.currentDur === dur.value;
          if (dur.value === 'SOS') {
            return (
              <button
                key={dur.label}
                type="button"
                onClick={() => handleSelectDuration(dur.value)}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer shadow-2xs active:scale-95 ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-600 ring-2 ring-amber-200'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 hover:border-amber-400'
                }`}
                title="Inserir durante SOS (se necessário)"
              >
                🚨 SOS
              </button>
            );
          }
          return (
            <button
              key={dur.label}
              type="button"
              onClick={() => handleSelectDuration(dur.value)}
              className={`text-xs font-semibold px-2 py-1 rounded-lg border transition-all cursor-pointer shadow-2xs active:scale-95 ${
                isSelected
                  ? 'bg-sky-600 text-white border-sky-600 ring-2 ring-sky-200'
                  : dur.value === 'Uso contínuo'
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200 hover:border-emerald-300'
                  : 'bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 border-slate-200 hover:border-sky-300'
              }`}
              title={`Duração de ${dur.label}`}
            >
              {dur.label}
            </button>
          );
        })}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[10px] text-slate-400 hover:text-rose-600 ml-auto flex items-center gap-1 cursor-pointer transition-colors"
            title="Limpar texto da posologia"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            Limpar
          </button>
        )}
      </div>

      {/* Visualização da ordem aplicada */}
      {value && (
        <div className="pt-1.5 border-t border-slate-200/70 text-[11px] text-slate-600 flex items-center gap-1">
          <span className="text-[10px] text-slate-400">Prévia:</span>
          <span className="font-medium text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
            {value}
          </span>
        </div>
      )}
    </div>
  );
};
