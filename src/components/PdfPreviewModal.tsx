import React from 'react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';
import { downloadPdfFile } from '../utils/shareUtils';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  pdfFile: File;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  pdfFile,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="pdf-preview-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4"
    >
      <div
        id="pdf-preview-modal-container"
        className="bg-white w-full sm:max-w-2xl h-[92vh] sm:h-[86vh] rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom duration-200"
      >
        {/* Barra Superior */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 overflow-hidden">
            <FileText className="w-5 h-5 text-sky-600 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-slate-800 truncate">
                {pdfFile.name}
              </span>
              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Folha A4 Retrato • 2 vias deitadas para corte
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-200/60 rounded-lg transition-colors"
              title="Abrir em nova aba"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => downloadPdfFile(pdfFile)}
              className="p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-200/60 rounded-lg transition-colors"
              title="Baixar arquivo"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors ml-1"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visualizador do PDF */}
        <div className="flex-1 bg-slate-100 p-1 sm:p-3 overflow-hidden">
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0`}
            title="Prévia da Receita Médica"
            className="w-full h-full rounded-lg border border-slate-200 bg-white"
          />
        </div>

        {/* Barra de Ações Inferior */}
        <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <button
            type="button"
            onClick={() => downloadPdfFile(pdfFile)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl active:scale-[0.99] transition-transform"
          >
            <Download className="w-4 h-4" />
            <span>Baixar PDF</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
