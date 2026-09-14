import React from 'react';
import { Pill, Trash2 } from 'lucide-react';
import { MedicineItem } from '../types';
import { PosologyShortcuts } from './PosologyShortcuts';

interface MedicineFormItemProps {
  index: number;
  item: MedicineItem;
  canRemove: boolean;
  onUpdate: (id: string, field: keyof MedicineItem, value: string) => void;
  onRemove: (id: string) => void;
}

export const MedicineFormItem: React.FC<MedicineFormItemProps> = ({
  index,
  item,
  canRemove,
  onUpdate,
  onRemove,
}) => {
  return (
    <div
      id={`medicine-card-${index + 1}`}
      className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 transition-all"
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
            {index + 1}
          </div>
          <span className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
            <Pill className="w-3.5 h-3.5 text-sky-600" />
            Medicamento {index + 1}
          </span>
        </div>

        {canRemove && (
          <button
            type="button"
            id={`remove-med-btn-${index + 1}`}
            onClick={() => onRemove(item.id)}
            className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded-md hover:bg-rose-50 active:bg-rose-100 transition-colors"
            title="Remover este medicamento"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remover</span>
          </button>
        )}
      </div>

      <div className="space-y-3.5">
        {/* Medicamento (Nome) */}
        <div>
          <label
            htmlFor={`med-name-${item.id}`}
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Nome do medicamento <span className="text-rose-500">*</span>
          </label>
          <input
            id={`med-name-${item.id}`}
            type="text"
            required
            value={item.name}
            onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
            placeholder="Ex: Amoxicilina, Dipirona ou Losartana"
            className="w-full text-base sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
          />
        </div>

        {/* Dosagem / Concentração */}
        <div>
          <label
            htmlFor={`med-dosage-${item.id}`}
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Dosagem / Concentração <span className="text-rose-500">*</span>
          </label>
          <input
            id={`med-dosage-${item.id}`}
            type="text"
            required
            value={item.dosage}
            onChange={(e) => onUpdate(item.id, 'dosage', e.target.value)}
            placeholder="Ex: 500 mg, 20 mg ou 50 mg/mL"
            className="w-full text-base sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
          />
        </div>

        {/* Posologia */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor={`med-instructions-${item.id}`}
              className="block text-xs font-semibold text-slate-700"
            >
              Posologia (Modo de uso) <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">
              Digitação livre ou atalhos
            </span>
          </div>
          <textarea
            id={`med-instructions-${item.id}`}
            required
            rows={2}
            value={item.instructions}
            onChange={(e) => onUpdate(item.id, 'instructions', e.target.value)}
            placeholder="Ex: Administrar 1 comprimido de 12/12h durante 5 dias"
            className="w-full text-base sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none transition-shadow"
          />

          <PosologyShortcuts
            value={item.instructions}
            onChange={(newVal) => onUpdate(item.id, 'instructions', newVal)}
          />
        </div>
      </div>
    </div>
  );
};
