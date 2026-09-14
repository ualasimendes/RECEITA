import React, { useState } from 'react';
import {
  CheckCircle2,
  FileText,
  Download,
  RotateCcw,
  Printer,
  Send,
  Building2,
  User,
  Scissors,
  Share2,
  Tag,
} from 'lucide-react';
import { PrescriptionData } from '../types';
import { sharePdfViaWhatsApp, downloadPdfFile } from '../utils/shareUtils';
import { PdfPreviewModal } from './PdfPreviewModal';
import { PrescriberStamp } from './PrescriberStamp';

interface SuccessViewProps {
  data: PrescriptionData;
  pdfFile: File;
  pdfUrl: string;
  onEdit: () => void;
  onReset: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  data,
  pdfFile,
  pdfUrl,
  onEdit,
  onReset,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const handleShareWhatsApp = async () => {
    setIsSharing(true);
    setShareFeedback(null);
    try {
      const result = await sharePdfViaWhatsApp(
        pdfFile,
        data.patientName,
        data.prescriberName
      );

      if (result.message) {
        setShareFeedback(result.message);
      }
    } catch (err) {
      console.error(err);
      setShareFeedback('Não foi possível iniciar o compartilhamento direto. Utilize o botão Baixar PDF.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownload = () => {
    downloadPdfFile(pdfFile);
  };

  const handleOpenPdf = () => {
    setIsPreviewOpen(true);
  };

  return (
    <div id="step-success" className="max-w-xl mx-auto px-4 py-5 space-y-5 animate-in fade-in duration-200">
      {/* Confirmação de Sucesso */}
      <div className="bg-white rounded-2xl border border-emerald-200 shadow-xs p-5 text-center">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Receita gerada com sucesso
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Documento A4 estruturado em <strong>1ª Via (Drogaria)</strong> e <strong>2ª Via (Paciente)</strong>, pronto para conferência e assinatura.
        </p>
      </div>

      {/* Mini Prévia Visual do Documento A4 (Duas Vias Deitadas em Folha Retrato) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Folha A4 Retrato (2 Vias Deitadas)
            </span>
            <span className="text-[10px] bg-sky-50 text-sky-700 font-semibold px-2 py-0.5 rounded-full border border-sky-200">
              210 × 297 mm
            </span>
          </div>
          <button
            type="button"
            onClick={handleOpenPdf}
            className="text-xs text-sky-600 hover:text-sky-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ver PDF completo</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-500">
          A folha é gerada em <strong>orientação Retrato (em pé)</strong>. As duas vias ficam <strong>deitadas</strong> (metade superior e inferior) para corte central:
        </p>

        {/* Mock visual da folha A4 dividida horizontalmente */}
        <div
          onClick={handleOpenPdf}
          className="cursor-pointer border-2 border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition-colors rounded-xl p-3 space-y-2.5 text-[11px]"
        >
          {/* Metade 1: Primeira Via */}
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs space-y-2">
            <div className="flex justify-between items-start border-b border-slate-100 pb-1.5 gap-2">
              <div>
                <p className="font-bold text-slate-900 text-[12px] leading-tight">Receituário de Controle Especial</p>
                <p className="text-[9px] text-slate-400">gerado manualmente através do site receita.walacemendes.com.br</p>
              </div>
              <span className="bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded text-[9px] font-semibold shrink-0">
                1ª VIA — FARMÁCIA (RETENÇÃO)
              </span>
            </div>
            
            <div className="bg-slate-50 p-1.5 rounded border border-slate-100 text-[10px] text-slate-600">
              <span className="font-bold text-slate-700 block text-[9px]">IDENTIFICAÇÃO DO EMITENTE:</span>
              <span className="font-bold text-slate-800">{data.prescriberName.toUpperCase()}</span> • CRM-{data.prescriberUf.toUpperCase()} Nº {data.prescriberCrm}
            </div>

            <p className="text-slate-600 truncate text-[10.5px]">
              <strong>Paciente:</strong> {data.patientName}
            </p>

            {/* Prescrição com Etiqueta de Dispensação LOTE/VAL */}
            <div className="space-y-1.5 pt-0.5">
              <span className="font-bold text-slate-700 text-[9.5px] block">PRESCRIÇÃO:</span>
              {data.medicines.map((m, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center gap-2 border border-slate-200/80 bg-slate-50/70 p-1.5 rounded-md"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 text-[10.5px] truncate">
                      {idx + 1}. {m.name} — {m.dosage} {m.quantity ? `(Qtd: ${m.quantity})` : ''}
                    </p>
                    {m.instructions && (
                      <p className="text-slate-500 text-[9px] truncate">
                        Posologia: {m.instructions}
                      </p>
                    )}
                  </div>
                  {/* Etiqueta Personalizada para preenchimento a caneta */}
                  <div className="border border-slate-300 bg-white rounded px-2 py-1 text-[8px] font-mono text-slate-700 shrink-0 text-left shadow-2xs">
                    <div className="font-bold text-[6.5px] text-slate-400 border-b border-slate-100 pb-0.5 mb-0.5 text-center">
                      DISPENSAÇÃO
                    </div>
                    <div className="text-slate-800 font-semibold">LOTE: <span className="text-slate-400 font-normal">_______</span></div>
                    <div className="text-slate-800 font-semibold">VAL: <span className="text-slate-400 font-normal">____/____</span></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Simulação do Bloco Inferior de Controle Especial: 3 Campos Distintos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200">
              {/* Campo 1: Cliente Ciente (CPF e Endereço Ampliado) */}
              <div className="border border-slate-200 bg-slate-50/50 p-2 rounded text-[8px] text-slate-500 space-y-1 font-mono flex flex-col justify-between">
                <div>
                  <div className="font-bold text-[7.5px] text-slate-700 border-b border-slate-200 pb-0.5 mb-1">
                    1. CLIENTE CIENTE (COMPRADOR)
                  </div>
                  <div>Nome: _________________</div>
                  <div>CPF: __________________</div>
                  <div>Endereço: _____________</div>
                  <div>Bairro/Cidade: ________</div>
                  <div className="text-[6.5px] text-slate-600 italic border-t border-slate-200/60 pt-0.5 mt-0.5 leading-tight">
                    Estou ciente que após a compra deste medicamento não será possível fazer a troca devido às normas sanitárias vigentes.
                  </div>
                </div>
                <div className="pt-1.5 flex flex-col items-center">
                  <span className="border-b border-slate-400 w-24 inline-block"></span>
                  <span className="text-[6.5px] text-slate-600 font-sans font-medium">Assinatura do cliente</span>
                </div>
              </div>

              {/* Campo 2: Farmacêutico (Somente carimbo, data da conferência e assinatura) */}
              <div className="border border-slate-200 bg-slate-50/50 p-2 rounded text-[8px] text-slate-500 space-y-1 font-mono flex flex-col justify-between text-center">
                <div>
                  <div className="font-bold text-[7.5px] text-slate-700 border-b border-slate-200 pb-0.5 mb-1">
                    2. FARMACÊUTICO CONFERENTE
                  </div>
                  <div className="border border-dashed border-slate-300 rounded p-1 my-1 bg-white text-[7px] text-slate-400">
                    ESPAÇO PARA CARIMBO COM CRF
                  </div>
                  <div className="font-semibold text-slate-700 text-[7.5px] pt-0.5">
                    Data conferência: ___/___/___
                  </div>
                </div>
                <div className="pt-1.5 flex flex-col items-center">
                  <span className="border-b border-slate-400 w-24 inline-block"></span>
                  <span className="text-[6.5px] text-slate-600 font-sans font-medium">Assinatura do Farmacêutico</span>
                </div>
              </div>

              {/* Campo 3: Médico CRM */}
              <div className="border border-slate-300 bg-white p-2 rounded text-[8px] font-mono text-slate-700 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="font-bold text-[7.5px] text-slate-800 border-b border-slate-200 pb-0.5 mb-1 text-center">
                    3. MÉDICO PRESCRITOR
                  </div>
                  <div className="text-center font-bold text-slate-900 text-[8.5px]">
                    {data.prescriberName.toUpperCase()}
                  </div>
                  <div className="text-center text-slate-700">
                    CRM-{data.prescriberUf.toUpperCase()} Nº {data.prescriberCrm}
                  </div>
                  {data.prescriberCpf && (
                    <div className="text-center text-slate-500 text-[7px]">
                      CPF: {data.prescriberCpf}
                    </div>
                  )}
                </div>
                <div className="pt-1.5 flex flex-col items-center">
                  <span className="border-b border-slate-700 w-24 inline-block"></span>
                  <span className="text-[6.5px] text-slate-700 font-sans font-medium">Assinatura do Médico</span>
                </div>
              </div>
            </div>
          </div>

          {/* Linha de corte pontilhada central */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono py-0.5">
            <Scissors className="w-3.5 h-3.5" />
            <span className="border-b border-dashed border-slate-400 flex-1"></span>
            <span>CORTAR AQUI (DUAS VIAS)</span>
            <span className="border-b border-dashed border-slate-400 flex-1"></span>
          </div>

          {/* Metade 2: Segunda Via */}
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs space-y-2">
            <div className="flex justify-between items-start border-b border-slate-100 pb-1.5 gap-2">
              <div>
                <p className="font-bold text-slate-900 text-[12px] leading-tight">Receituário de Controle Especial</p>
                <p className="text-[9px] text-slate-400">gerado manualmente através do site receita.walacemendes.com.br</p>
              </div>
              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px] font-semibold shrink-0">
                2ª VIA — PACIENTE (ORIENTAÇÃO)
              </span>
            </div>
            
            <div className="bg-slate-50 p-1.5 rounded border border-slate-100 text-[10px] text-slate-600">
              <span className="font-bold text-slate-700 block text-[9px]">IDENTIFICAÇÃO DO EMITENTE:</span>
              <span className="font-bold text-slate-800">{data.prescriberName.toUpperCase()}</span> • CRM-{data.prescriberUf.toUpperCase()} Nº {data.prescriberCrm}
            </div>

            <p className="text-slate-600 truncate text-[10.5px]">
              <strong>Paciente:</strong> {data.patientName}
            </p>

            {/* Prescrição com Etiqueta de Dispensação LOTE/VAL */}
            <div className="space-y-1.5 pt-0.5">
              <span className="font-bold text-slate-700 text-[9.5px] block">PRESCRIÇÃO:</span>
              {data.medicines.map((m, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center gap-2 border border-slate-200/80 bg-slate-50/70 p-1.5 rounded-md"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 text-[10.5px] truncate">
                      {idx + 1}. {m.name} — {m.dosage} {m.quantity ? `(Qtd: ${m.quantity})` : ''}
                    </p>
                    {m.instructions && (
                      <p className="text-slate-500 text-[9px] truncate">
                        Posologia: {m.instructions}
                      </p>
                    )}
                  </div>
                  {/* Etiqueta Personalizada para preenchimento a caneta */}
                  <div className="border border-slate-300 bg-white rounded px-2 py-1 text-[8px] font-mono text-slate-700 shrink-0 text-left shadow-2xs">
                    <div className="font-bold text-[6.5px] text-slate-400 border-b border-slate-100 pb-0.5 mb-0.5 text-center">
                      DISPENSAÇÃO
                    </div>
                    <div className="text-slate-800 font-semibold">LOTE: <span className="text-slate-400 font-normal">_______</span></div>
                    <div className="text-slate-800 font-semibold">VAL: <span className="text-slate-400 font-normal">____/____</span></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Simulação do Bloco Inferior de Controle Especial: 3 Campos Distintos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200">
              {/* Campo 1: Cliente Ciente (CPF e Endereço Ampliado) */}
              <div className="border border-slate-200 bg-slate-50/50 p-2 rounded text-[8px] text-slate-500 space-y-1 font-mono flex flex-col justify-between">
                <div>
                  <div className="font-bold text-[7.5px] text-slate-700 border-b border-slate-200 pb-0.5 mb-1">
                    1. CLIENTE CIENTE (COMPRADOR)
                  </div>
                  <div>Nome: _________________</div>
                  <div>CPF: __________________</div>
                  <div>Endereço: _____________</div>
                  <div>Bairro/Cidade: ________</div>
                  <div className="text-[6.5px] text-slate-600 italic border-t border-slate-200/60 pt-0.5 mt-0.5 leading-tight">
                    Estou ciente que após a compra deste medicamento não será possível fazer a troca devido às normas sanitárias vigentes.
                  </div>
                </div>
                <div className="pt-1.5 flex flex-col items-center">
                  <span className="border-b border-slate-400 w-24 inline-block"></span>
                  <span className="text-[6.5px] text-slate-600 font-sans font-medium">Assinatura do cliente</span>
                </div>
              </div>

              {/* Campo 2: Farmacêutico (Somente carimbo, data da conferência e assinatura) */}
              <div className="border border-slate-200 bg-slate-50/50 p-2 rounded text-[8px] text-slate-500 space-y-1 font-mono flex flex-col justify-between text-center">
                <div>
                  <div className="font-bold text-[7.5px] text-slate-700 border-b border-slate-200 pb-0.5 mb-1">
                    2. FARMACÊUTICO CONFERENTE
                  </div>
                  <div className="border border-dashed border-slate-300 rounded p-1 my-1 bg-white text-[7px] text-slate-400">
                    ESPAÇO PARA CARIMBO COM CRF
                  </div>
                  <div className="font-semibold text-slate-700 text-[7.5px] pt-0.5">
                    Data conferência: ___/___/___
                  </div>
                </div>
                <div className="pt-1.5 flex flex-col items-center">
                  <span className="border-b border-slate-400 w-24 inline-block"></span>
                  <span className="text-[6.5px] text-slate-600 font-sans font-medium">Assinatura do Farmacêutico</span>
                </div>
              </div>

              {/* Campo 3: Médico CRM */}
              <div className="border border-slate-300 bg-white p-2 rounded text-[8px] font-mono text-slate-700 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="font-bold text-[7.5px] text-slate-800 border-b border-slate-200 pb-0.5 mb-1 text-center">
                    3. MÉDICO PRESCRITOR
                  </div>
                  <div className="text-center font-bold text-slate-900 text-[8.5px]">
                    {data.prescriberName.toUpperCase()}
                  </div>
                  <div className="text-center text-slate-700">
                    CRM-{data.prescriberUf.toUpperCase()} Nº {data.prescriberCrm}
                  </div>
                  {data.prescriberCpf && (
                    <div className="text-center text-slate-500 text-[7px]">
                      CPF: {data.prescriberCpf}
                    </div>
                  )}
                </div>
                <div className="pt-1.5 flex flex-col items-center">
                  <span className="border-b border-slate-700 w-24 inline-block"></span>
                  <span className="text-[6.5px] text-slate-700 font-sans font-medium">Assinatura do Médico</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card explicativo sobre a Identificação Visual do Prescritor */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-1 text-center sm:text-left">
            <span className="font-bold text-slate-800 flex items-center gap-1.5 justify-center sm:justify-start">
              <Tag className="w-3.5 h-3.5 text-sky-600" />
              Identificação Profissional no PDF
            </span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Gerada automaticamente com aparência de etiqueta/carimbo profissional em cada uma das duas vias da folha A4.
            </p>
          </div>
          <div className="shrink-0 bg-white p-2 rounded-lg border border-slate-200">
            <PrescriberStamp
              name={data.prescriberName}
              crm={data.prescriberCrm}
              uf={data.prescriberUf}
              showSignatureLine={false}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Botões de Ação Principais (Grandes, touch-friendly) */}
      <div className="space-y-3 pt-1">
        {/* Botão Principal: Enviar pelo WhatsApp */}
        <button
          type="button"
          id="btn-whatsapp-share"
          onClick={handleShareWhatsApp}
          disabled={isSharing}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base shadow-lg shadow-emerald-600/25 active:scale-[0.99] transition-all cursor-pointer"
        >
          <Send className="w-5 h-5" />
          <span>{isSharing ? 'Abrindo compartilhamento...' : 'ENVIAR PELO WHATSAPP'}</span>
        </button>

        {/* Abrir PDF */}
        <button
          type="button"
          id="btn-open-pdf"
          onClick={handleOpenPdf}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-semibold text-sm border border-slate-300 shadow-xs active:scale-[0.99] transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4 text-sky-600" />
          <span>ABRIR PDF</span>
        </button>

        {/* Baixar PDF */}
        <button
          type="button"
          id="btn-download-pdf"
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-semibold text-sm border border-slate-300 shadow-xs active:scale-[0.99] transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>BAIXAR PDF</span>
        </button>
      </div>

      {shareFeedback && (
        <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-800 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-sky-600 shrink-0" />
          <span>{shareFeedback}</span>
        </div>
      )}

      {/* Aviso Legal e Responsabilidade */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-900">
          <Printer className="w-4 h-4 text-slate-700" />
          <span>Responsabilidade e Conferência:</span>
        </div>
        <p className="leading-relaxed">
          A ferramenta apenas auxilia na digitação e geração do documento. O conteúdo da prescrição é de <strong>responsabilidade exclusiva do profissional médico prescritor</strong>. O médico deve revisar o documento antes da assinatura.
        </p>
      </div>

      {/* Ações Secundárias */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          id="btn-edit-current"
          onClick={onEdit}
          className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
        >
          Editar dados
        </button>
        <button
          type="button"
          id="btn-new-recipe"
          onClick={onReset}
          className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors inline-flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Nova Prescrição</span>
        </button>
      </div>

      {/* Modal de Prévia Completa do PDF */}
      <PdfPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pdfUrl={pdfUrl}
        pdfFile={pdfFile}
      />
    </div>
  );
};
