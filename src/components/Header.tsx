import React from 'react';
import { FileText, ShieldCheck, Stethoscope } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs" id="main-header">
      <div className="max-w-xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                  Receita
                </h1>
                <span className="text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200/80 px-2 py-0.5 rounded-full">
                  Mobile
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-tight">
                Emissão Digital
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span className="font-medium text-[11px]">Uso Médico</span>
          </div>
        </div>
      </div>
    </header>
  );
};
