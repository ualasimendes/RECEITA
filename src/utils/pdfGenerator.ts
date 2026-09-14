import { jsPDF } from 'jspdf';
import { PrescriptionData } from '../types';
import { formatIsoDateToExtenso, formatCpf, validatePatientBirthDate } from './validators';

export function generatePrescriptionPdf(data: PrescriptionData): {
  doc: jsPDF;
  blob: Blob;
  file: File;
  objectUrl: string;
  filename: string;
} {
  // Cria documento A4 retrato em milímetros
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const halfHeight = pageHeight / 2; // 148.5 mm
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2; // 182 mm

  // Paleta de cores médica
  const primaryColor = [15, 76, 129]; // Azul médico clássico
  const darkText = [30, 41, 59]; // Slate 800
  const mutedText = [100, 116, 139]; // Slate 500
  const lightBorder = [203, 213, 225]; // Slate 300

  // Formatação de data em português a partir da data de emissão validada
  const rawDate = data.prescriptionDate || data.createdAt || new Date().toISOString();
  const formattedDate = `Emissão: ${formatIsoDateToExtenso(rawDate)}`;

  // Formata o endereço completo do emitente a partir dos campos validados
  const prescriberAddress = `${data.prescriberStreet}, nº ${data.prescriberNumber}${
    data.prescriberComplement ? ` - ${data.prescriberComplement}` : ''
  }`;

  const councilLabel = data.councilType || 'CRM';

  // Função auxiliar para renderizar cada via (idênticas)
  const renderVia = (offsetY: number, viaTitle: string) => {
    let currentY = offsetY + 5;

    // Moldura elegante da via
    doc.setDrawColor(lightBorder[0], lightBorder[1], lightBorder[2]);
    doc.setLineWidth(0.35);
    doc.roundedRect(marginX - 2, offsetY + 2.5, contentWidth + 4, halfHeight - 5, 1.5, 1.5, 'D');

    // Identificação da Via no canto superior direito
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.25);
    doc.roundedRect(pageWidth - marginX - 54, currentY - 1.2, 54, 5.2, 1, 1, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(viaTitle, pageWidth - marginX - 27, currentY + 2.4, { align: 'center' });

    // IDENTIFICAÇÃO BEM GRANDE NO INÍCIO: "Receituário de Controle Especial"
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Receituário de Controle Especial', marginX + 2, currentY + 2.6);

    // EM BAIXO EM LETRAS MIÚDAS: "gerado manualmente através do site receita.walacemendes.com.br"
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(100, 116, 139);
    doc.text('gerado manualmente através do site receita.walacemendes.com.br', marginX + 2.2, currentY + 6.2);

    currentY += 8.2;

    // Linha divisória fina abaixo do cabeçalho principal
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.25);
    doc.line(marginX, currentY, pageWidth - marginX, currentY);
    currentY += 2;

    // 1. CABEÇALHO DA RECEITA: IDENTIFICAÇÃO DO EMITENTE (Aumentado em área e tipografia)
    const headerBoxWidth = contentWidth;
    const hasHeaderCpf = Boolean(data.prescriberCpf && data.prescriberCpf.trim().length === 11);
    const headerBoxHeight = hasHeaderCpf ? 18.5 : 16.5;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginX, currentY - 1, headerBoxWidth, headerBoxHeight, 1.2, 1.2, 'FD');

    // Etiqueta formal do emitente em destaque aumentado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.6);
    doc.setTextColor(71, 85, 105);
    doc.text('IDENTIFICAÇÃO DO EMITENTE', marginX + 3.5, currentY + 2.6);

    // Nome do Emitente com fonte ampliada e marcante
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(data.prescriberName.toUpperCase(), marginX + 3.5, currentY + 6.8);

    // Conselho, UF, Número de Registro e CPF (se preenchido) em fonte maior
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    let prescriberCouncilLine = `${councilLabel}-${data.prescriberUf.toUpperCase()} Nº ${data.prescriberCrm}`;
    if (hasHeaderCpf && data.prescriberCpf) {
      prescriberCouncilLine += `  •  CPF: ${formatCpf(data.prescriberCpf)}`;
    }
    doc.text(prescriberCouncilLine, marginX + 3.5, currentY + 10.6);

    // Endereço completo do emitente em fonte ampliada e legível
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.4);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    const estAddressLines = doc.splitTextToSize(prescriberAddress, headerBoxWidth - 7);
    doc.text(estAddressLines[0] || prescriberAddress, marginX + 3.5, currentY + (hasHeaderCpf ? 14.5 : 14.2));

    currentY += headerBoxHeight + 2.5;

    // 3. Paciente (Nome completo, Data de nascimento com idade calculada, Endereço completo)
    const patientBirthInfo = data.patientBirthDate
      ? validatePatientBirthDate(data.patientBirthDate)
      : null;
    const formattedBirthDate = data.patientBirthDate
      ? data.patientBirthDate.split('-').reverse().join('/')
      : '';
    const birthLabel = formattedBirthDate
      ? `NASC: ${formattedBirthDate}${
          patientBirthInfo?.valid && patientBirthInfo.age !== undefined
            ? ` (${patientBirthInfo.age} anos)`
            : ''
        }`
      : '';

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(marginX, currentY - 1, contentWidth, 11, 1, 1, 'F');

    // Linha 1: PACIENTE e DATA DE NASCIMENTO
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('PACIENTE:', marginX + 2.5, currentY + 2.8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.text(data.patientName, marginX + 18, currentY + 2.8);

    if (birthLabel) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(birthLabel, pageWidth - marginX - 2.5, currentY + 2.8, { align: 'right' });
    }

    // Linha 2: ENDEREÇO DO PACIENTE
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    doc.text('ENDEREÇO:', marginX + 2.5, currentY + 7.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    const patAddressLines = doc.splitTextToSize(data.patientAddress, contentWidth - 25);
    doc.text(patAddressLines[0] || '', marginX + 19, currentY + 7.5);

    currentY += 13.5;

    // Se for anabolizante: exibir faixa com CID e CPF do Prescritor exigidos pela ANVISA
    if (data.isAnabolic) {
      doc.setFillColor(254, 243, 199); // amber-100
      doc.setDrawColor(245, 158, 11); // amber-500
      doc.setLineWidth(0.2);
      doc.roundedRect(marginX, currentY - 1, contentWidth, 5.5, 0.8, 0.8, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(146, 64, 14); // amber-900
      doc.text(
        `EXIGÊNCIA LEGAL ANVISA (LEI 9.965/00)  •  CID: ${data.cid || 'N/I'}  •  CPF DO EMITENTE: ${formatCpf(
          data.prescriberCpf || ''
        )}`,
        pageWidth / 2,
        currentY + 2.6,
        { align: 'center' }
      );

      currentY += 8;
    }

    // 4. Prescrição (Medicamentos)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('PRESCRIÇÃO:', marginX, currentY);
    currentY += 4;

    const tagWidth = 42;
    const tagHeight = 11;
    const tagX = pageWidth - marginX - tagWidth;
    const medTextWidth = contentWidth - tagWidth - 5;

    data.medicines.forEach((med, index) => {
      const medStartY = currentY;

      // ETIQUETA PERSONALIZADA DE DISPENSAÇÃO (LOTE / VALIDADE)
      const tagY = medStartY - 0.8;

      // Fundo e borda arredondada da etiqueta
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(148, 163, 184); // slate-400
      doc.setLineWidth(0.28);
      doc.roundedRect(tagX, tagY, tagWidth, tagHeight, 1.2, 1.2, 'FD');

      // Faixa superior da etiqueta
      doc.setFillColor(241, 245, 249); // slate-100
      doc.roundedRect(tagX, tagY, tagWidth, 3.2, 1.2, 1.2, 'F');
      doc.rect(tagX, tagY + 2, tagWidth, 1.2, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.2);
      doc.line(tagX, tagY + 3.2, tagX + tagWidth, tagY + 3.2);

      // Título da etiqueta
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.2);
      doc.setTextColor(71, 85, 105);
      doc.text('DISPENSAÇÃO', tagX + tagWidth / 2, tagY + 2.3, { align: 'center' });

      // Linha 1 da etiqueta: LOTE
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.4);
      doc.setTextColor(30, 41, 59);
      doc.text('LOTE:', tagX + 2.2, tagY + 6.6);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text('___________________', tagX + 11.2, tagY + 6.3);

      // Linha 2 da etiqueta: VALIDADE
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.4);
      doc.setTextColor(30, 41, 59);
      doc.text('VAL:', tagX + 2.2, tagY + 9.8);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text('____ / ________', tagX + 11.2, tagY + 9.5);

      // AO LADO: NOME E DOSAGEM DO MEDICAMENTO
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      doc.setTextColor(darkText[0], darkText[1], darkText[2]);
      let medTitle = `${index + 1}. ${med.name} — ${med.dosage}`;
      if (med.quantity && med.quantity.trim().length > 0) {
        medTitle += `  [Qtd: ${med.quantity}]`;
      }
      const splitTitle = doc.splitTextToSize(medTitle, medTextWidth);
      doc.text(splitTitle, marginX + 2, currentY);
      currentY += splitTitle.length * 3.4;

      // Posologia
      if (med.instructions) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.4);
        doc.setTextColor(51, 65, 85);
        const posText = `Posologia: ${med.instructions}`;
        const splitPos = doc.splitTextToSize(posText, medTextWidth - 2);
        doc.text(splitPos, marginX + 4, currentY);
        currentY += splitPos.length * 3.1 + 1;
      }

      // Garante que o espaçamento mínimo respeite a altura da etiqueta (11mm)
      const medTotalHeight = currentY - medStartY;
      if (medTotalHeight < tagHeight + 2) {
        currentY = medStartY + tagHeight + 2;
      } else {
        currentY += 1.5;
      }
    });

    // 5. Observações (apenas se preenchidas)
    if (data.observations && data.observations.trim().length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
      doc.text('Observações:', marginX + 2, currentY);
      currentY += 2.8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(darkText[0], darkText[1], darkText[2]);
      const obsLines = doc.splitTextToSize(data.observations.trim(), contentWidth - 4);
      doc.text(obsLines, marginX + 4, currentY);
    }

    // 4. BLOCO INFERIOR DE CONTROLE ESPECIAL: 3 CAMPOS TOTALMENTE INDEPENDENTES
    // 1. Cliente ciente / Comprador  |  2. Farmacêutico dispensador  |  3. Médico CRM
    const footerBoxHeight = 33.5;
    const footerY = offsetY + halfHeight - 43;

    // Linha divisória antes do bloco inferior
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.25);
    doc.line(marginX, footerY - 1.8, pageWidth - marginX, footerY - 1.8);

    // Dimensões dos 3 campos (largura total 186mm)
    const gap = 2.5;
    const col1Width = 63; // 1. Cliente ciente (ampliado para endereço)
    const col2Width = 57; // 2. Farmacêutico (carimbo, data conferência, assinatura)
    const col3Width = 61; // 3. Médico CRM
    const col1X = marginX;
    const col2X = col1X + col1Width + gap;
    const col3X = col2X + col2Width + gap;

    // ==========================================
    // CAMPO 1: CLIENTE CIENTE (COMPRADOR)
    // ==========================================
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(180, 195, 215);
    doc.setLineWidth(0.25);
    doc.roundedRect(col1X, footerY, col1Width, footerBoxHeight, 1, 1, 'FD');

    // Cabeçalho Campo 1
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(col1X, footerY, col1Width, 3.8, 1, 1, 'F');
    doc.rect(col1X, footerY + 2.2, col1Width, 1.6, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.line(col1X, footerY + 3.8, col1X + col1Width, footerY + 3.8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.4);
    doc.setTextColor(51, 65, 85);
    doc.text('1. CLIENTE CIENTE (COMPRADOR)', col1X + col1Width / 2, footerY + 2.7, { align: 'center' });

    // Dados do Comprador (CPF em vez de RG, e endereço ampliado)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.8);
    doc.setTextColor(100, 116, 139);
    doc.text('Nome: _________________________________________', col1X + 2, footerY + 6.6);
    doc.text('CPF: ______________________  Tel: _______________', col1X + 2, footerY + 9.6);
    doc.text('Endereço: ____________________________________', col1X + 2, footerY + 12.6);
    doc.text('Compl / Bairro / Cidade: _______________________', col1X + 2, footerY + 15.6);

    // Divisória sutil
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(col1X + 2, footerY + 16.8, col1X + col1Width - 2, footerY + 16.8);

    // Termo de ciência da impossibilidade de troca
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(4.0);
    doc.setTextColor(71, 85, 105);
    const cienteLines = doc.splitTextToSize(
      'Estou ciente que após a compra deste medicamento não será possível fazer a troca devido às normas sanitárias vigentes (Portaria SVS/MS 344/98 e RDC ANVISA).',
      col1Width - 4
    );
    doc.text(cienteLines, col1X + 2, footerY + 19.3);

    // Assinatura do Cliente
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.25);
    doc.line(col1X + 6, footerY + 28.5, col1X + col1Width - 6, footerY + 28.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.6);
    doc.setTextColor(71, 85, 105);
    doc.text('Assinatura do cliente', col1X + col1Width / 2, footerY + 31.2, { align: 'center' });

    // ==========================================
    // CAMPO 2: FARMACÊUTICO DISPENSADOR (CARIMBO, DATA CONFERÊNCIA E ASSINATURA)
    // ==========================================
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(180, 195, 215);
    doc.setLineWidth(0.25);
    doc.roundedRect(col2X, footerY, col2Width, footerBoxHeight, 1, 1, 'FD');

    // Cabeçalho Campo 2
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(col2X, footerY, col2Width, 3.8, 1, 1, 'F');
    doc.rect(col2X, footerY + 2.2, col2Width, 1.6, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.line(col2X, footerY + 3.8, col2X + col2Width, footerY + 3.8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.4);
    doc.setTextColor(51, 65, 85);
    doc.text('2. FARMACÊUTICO CONFERENTE', col2X + col2Width / 2, footerY + 2.7, { align: 'center' });

    // Espaço reservado para o carimbo físico com CRF
    doc.setDrawColor(203, 213, 225);
    doc.setLineDashPattern([1, 1], 0);
    doc.setLineWidth(0.2);
    doc.roundedRect(col2X + 3, footerY + 5.6, col2Width - 6, 12, 0.8, 0.8, 'D');
    doc.setLineDashPattern([], 0);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.6);
    doc.setTextColor(148, 163, 184);
    doc.text('ESPAÇO PARA CARIMBO COM CRF', col2X + col2Width / 2, footerY + 12.0, { align: 'center' });

    // Data da conferência
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.0);
    doc.setTextColor(71, 85, 105);
    doc.text('Data da conferência: _____ / _____ / ________', col2X + col2Width / 2, footerY + 21.0, {
      align: 'center',
    });

    // Assinatura do Farmacêutico
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.25);
    doc.line(col2X + 6, footerY + 28.5, col2X + col2Width - 6, footerY + 28.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.6);
    doc.setTextColor(71, 85, 105);
    doc.text('Assinatura do Farmacêutico', col2X + col2Width / 2, footerY + 31.2, { align: 'center' });

    // ==========================================
    // CAMPO 3: MÉDICO CRM (PRESCRIÇÃO)
    // ==========================================
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.35);
    doc.roundedRect(col3X, footerY, col3Width, footerBoxHeight, 1, 1, 'FD');

    // Moldura decorativa interna
    doc.setDrawColor(100, 116, 139);
    doc.setLineWidth(0.18);
    doc.roundedRect(col3X + 0.8, footerY + 0.8, col3Width - 1.6, footerBoxHeight - 1.6, 0.6, 0.6, 'D');

    // Cabeçalho Campo 3 com Data de Emissão
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(col3X, footerY, col3Width, 3.8, 1, 1, 'F');
    doc.rect(col3X, footerY + 2.2, col3Width, 1.6, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.line(col3X, footerY + 3.8, col3X + col3Width, footerY + 3.8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.2);
    doc.setTextColor(15, 23, 42);
    doc.text(`3. MÉDICO PRESCRITOR • ${formattedDate}`, col3X + col3Width / 2, footerY + 2.7, { align: 'center' });

    // Subtítulo do prescritor
    const roleTitle =
      councilLabel === 'CRO'
        ? 'CIRURGIÃO-DENTISTA'
        : councilLabel === 'CRMV'
        ? 'MÉDICO VETERINÁRIO'
        : 'MÉDICO(A)';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.2);
    doc.setTextColor(100, 116, 139);
    doc.text(roleTitle, col3X + col3Width / 2, footerY + 7.0, { align: 'center' });

    // Nome do prescritor
    const doctorNameUpper = data.prescriberName.trim().toUpperCase();
    const crmUfUpper = `${councilLabel}-${data.prescriberUf.trim().toUpperCase()}`;
    const crmNumber = `Nº ${data.prescriberCrm.trim()}`;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.6);
    doc.setTextColor(15, 23, 42);
    doc.text(doctorNameUpper, col3X + col3Width / 2, footerY + 10.8, { align: 'center' });

    // CRM e Número
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.0);
    doc.setTextColor(15, 23, 42);
    doc.text(`${crmUfUpper}  •  ${crmNumber}`, col3X + col3Width / 2, footerY + 14.5, { align: 'center' });

    // Endereço
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.2);
    doc.setTextColor(71, 85, 105);
    const stampAddressLines = doc.splitTextToSize(prescriberAddress, col3Width - 4);
    doc.text(stampAddressLines[0] || prescriberAddress, col3X + col3Width / 2, footerY + 18.0, {
      align: 'center',
    });

    // CPF se houver
    if (data.prescriberCpf && data.prescriberCpf.trim().length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.2);
      doc.setTextColor(71, 85, 105);
      doc.text(`CPF: ${formatCpf(data.prescriberCpf)}`, col3X + col3Width / 2, footerY + 21.4, {
        align: 'center',
      });
    }

    // Linha de assinatura do Médico
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.35);
    doc.line(col3X + 6, footerY + 28.5, col3X + col3Width - 6, footerY + 28.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.6);
    doc.setTextColor(15, 23, 42);
    doc.text('Assinatura', col3X + col3Width / 2, footerY + 31.2, { align: 'center' });

    // Rodapé de Responsabilidade Obrigatório
    const legalNoticeY = offsetY + halfHeight - 6.2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.7);
    doc.setTextColor(110, 120, 135);
    const line1 =
      'A ferramenta apenas auxilia na digitação e geração do documento. O conteúdo da prescrição é de responsabilidade exclusiva do profissional médico prescritor.';
    const line2 =
      'O sistema não diagnostica, não prescreve automaticamente, não sugere medicamentos e não escolhe tratamentos. O médico deve revisar o documento antes da assinatura.';
    doc.text(line1, pageWidth / 2, legalNoticeY, { align: 'center' });
    doc.text(line2, pageWidth / 2, legalNoticeY + 2.3, { align: 'center' });
  };

  // Renderiza a PRIMEIRA VIA (metade superior)
  renderVia(0, '1ª VIA — FARMÁCIA (RETENÇÃO)');

  // Linha de corte com tesoura central
  doc.setDrawColor(160, 174, 192);
  doc.setLineWidth(0.2);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(marginX, halfHeight, pageWidth - marginX, halfHeight);
  doc.setLineDashPattern([], 0);

  // Ícone / texto sutil de corte
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('✄   CORTAR AQUI   ✄', pageWidth / 2, halfHeight + 0.8, { align: 'center' });

  // Configura propriedades oficiais do PDF
  doc.setDocumentProperties({
    title: `Receituário de Controle Especial - ${data.patientName || 'Paciente'}`,
    subject: 'Receituário de Controle Especial - Folha A4 Retrato (2 Vias Deitadas)',
    author: data.prescriberName,
    keywords: 'receituario controle especial, a4 retrato, duas vias deitadas, prescricao, anvisa',
    creator: 'Receituário de Controle Especial',
  });

  // Renderiza a SEGUNDA VIA (metade inferior, idêntica)
  renderVia(halfHeight, '2ª VIA — PACIENTE (ORIENTAÇÃO)');

  // Nome do arquivo
  const cleanPatient = data.patientName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 18);
  const dateTag = (data.prescriptionDate || new Date().toISOString().split('T')[0]).replace(/-/g, '_');
  const filename = `receita_${cleanPatient || 'medica'}_${dateTag}.pdf`;

  const blob = doc.output('blob');
  const file = new File([blob], filename, { type: 'application/pdf' });
  const objectUrl = URL.createObjectURL(blob);

  return {
    doc,
    blob,
    file,
    objectUrl,
    filename,
  };
}

