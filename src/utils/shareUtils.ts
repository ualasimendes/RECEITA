/**
 * Utilitários para compartilhamento nativo de arquivo PDF e integração com WhatsApp
 */

export interface ShareResult {
  success: boolean;
  sharedDirectly: boolean;
  message?: string;
}

export async function sharePdfViaWhatsApp(
  pdfFile: File,
  patientName: string,
  doctorName: string
): Promise<ShareResult> {
  const shareText = `Olá! Segue a receita médica do paciente ${patientName}, emitida pelo Dr(a). ${doctorName}, para impressão e conferência no balcão.`;

  // 1. Tenta compartilhamento nativo com o arquivo PDF (padrão em Android e iOS Safari)
  if (navigator.canShare && navigator.share) {
    try {
      const shareData = {
        title: `Receita Médica - ${patientName}`,
        text: shareText,
        files: [pdfFile],
      };

      if (navigator.canShare({ files: [pdfFile] })) {
        await navigator.share(shareData);
        return { success: true, sharedDirectly: true };
      }
    } catch (error: unknown) {
      // Usuário cancelou ou fechou a folha de compartilhamento nativa
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, sharedDirectly: false, message: 'Compartilhamento cancelado pelo usuário.' };
      }
      console.warn('Erro no compartilhamento nativo com arquivo:', error);
    }
  }

  // 2. Fallback para ambientes onde o navegador não suporta compartilhamento direto de arquivos
  // Baixa o arquivo para o dispositivo do médico
  downloadPdfFile(pdfFile);

  // Redireciona para o WhatsApp com a mensagem introdutória
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText}\n(O arquivo em anexo "${pdfFile.name}" foi salvo no dispositivo para envio)`
  )}`;
  
  // Abre o WhatsApp
  window.location.href = whatsappUrl;

  return {
    success: true,
    sharedDirectly: false,
    message: 'Arquivo PDF baixado. Anexe o documento na conversa do WhatsApp.',
  };
}

export function downloadPdfFile(file: File | { blob: Blob; filename: string }): void {
  const blob = file instanceof File ? file : file.blob;
  const filename = file instanceof File ? file.name : file.filename;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Limpeza de memória
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
