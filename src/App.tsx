/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FlowStep, PrescriptionData, MedicineItem, CouncilType } from './types';
import { StepProgressBar } from './components/StepProgressBar';
import { WelcomeStep } from './components/steps/WelcomeStep';
import { PrescriberStep } from './components/steps/PrescriberStep';
import { PatientStep } from './components/steps/PatientStep';
import { MedicinesStep } from './components/steps/MedicinesStep';
import { ObservationsStep } from './components/steps/ObservationsStep';
import { ReviewStep } from './components/steps/ReviewStep';
import { SuccessView } from './components/SuccessView';
import { generatePrescriptionPdf } from './utils/pdfGenerator';
import { getTodayDateString } from './utils/validators';

// Mapeamento de rotas e URLs amigáveis para cada etapa solicitada
export const STEP_TO_PATH: Record<FlowStep, string> = {
  welcome: '/',
  prescriber: '/emitente',
  patient: '/paciente',
  medicines: '/prescricao',
  observations: '/observacoes',
  review: '/gerar-pdf',
  success: '/enviar-wpp',
};

export function getStepFromPath(pathname: string): FlowStep {
  const clean = decodeURIComponent(pathname || '').toLowerCase().replace(/\/+$/, '');
  if (!clean || clean === '' || clean === '/inicio' || clean === '/home') {
    return 'welcome';
  }
  if (clean === '/emitente' || clean === '/prescritor') return 'prescriber';
  if (clean === '/paciente') return 'patient';
  if (clean === '/prescricao' || clean === '/prescrição' || clean === '/medicamentos') return 'medicines';
  if (clean === '/observacoes' || clean === '/observações') return 'observations';
  if (clean === '/gerar-pdf' || clean === '/revisao' || clean === '/revisão') return 'review';
  if (clean === '/enviar-wpp' || clean === '/sucesso' || clean === '/concluido') return 'success';
  return 'welcome';
}

const createEmptyMedicine = (): MedicineItem => ({
  id: Math.random().toString(36).substring(2, 9),
  name: '',
  dosage: '',
  instructions: '',
});

export default function App() {
  // Controle de etapas independentes mapeadas para URLs da barra de navegação
  const [currentStep, setCurrentStep] = useState<FlowStep>(() => {
    if (typeof window !== 'undefined') {
      return getStepFromPath(window.location.pathname);
    }
    return 'welcome';
  });

  const [editingFromReview, setEditingFromReview] = useState(false);

  // 1. Dados do emitente / prescritor (iniciam 100% em branco)
  const [prescriberName, setPrescriberName] = useState('');
  const [councilType, setCouncilType] = useState<CouncilType>('CRM');
  const [prescriberCrm, setPrescriberCrm] = useState('');
  const [prescriberUf, setPrescriberUf] = useState('RJ');
  const [prescriberStreet, setPrescriberStreet] = useState('');
  const [prescriberNumber, setPrescriberNumber] = useState('');
  const [prescriberComplement, setPrescriberComplement] = useState('');
  const [prescriptionDate, setPrescriptionDate] = useState(getTodayDateString());

  // 2. Dados do paciente (iniciam 100% em branco)
  const [patientName, setPatientName] = useState('');
  const [patientBirthDate, setPatientBirthDate] = useState('');
  const [patientAddress, setPatientAddress] = useState('');

  // 3. Medicamentos (inicia com 1 item em branco) + Anabolizante
  const [medicines, setMedicines] = useState<MedicineItem[]>([createEmptyMedicine()]);
  const [isAnabolic, setIsAnabolic] = useState<boolean>(false);
  const [cid, setCid] = useState('');
  const [prescriberCpf, setPrescriberCpf] = useState('');

  // 4. Observações (inicia em branco)
  const [observations, setObservations] = useState('');

  // Limpeza de qualquer resquício de rascunhos anteriores salvos
  useEffect(() => {
    try {
      sessionStorage.removeItem('receita_draft_data_v2');
      sessionStorage.removeItem('receita_draft_data');
    } catch {
      // Ignora erro
    }
  }, []);

  // Estado da geração do PDF
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    prescription: PrescriptionData;
    pdfFile: File;
    pdfUrl: string;
  } | null>(null);

  // Sincronização com o histórico do navegador (suporte a botão voltar/avançar e URLs diretas)
  useEffect(() => {
    const handlePopState = () => {
      const stepFromUrl = getStepFromPath(window.location.pathname);
      setCurrentStep(stepFromUrl);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navegador de rotas centralizado que atualiza a URL em receita.walacemendes.com.br/...
  const navigateToStep = (step: FlowStep, replace = false) => {
    const targetPath = STEP_TO_PATH[step] || '/';
    if (window.location.pathname !== targetPath) {
      if (replace) {
        window.history.replaceState({ step }, '', targetPath);
      } else {
        window.history.pushState({ step }, '', targetPath);
      }
    }
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manipulação de Medicamentos
  const handleAddMedicine = () => {
    if (medicines.length >= 3) return;
    setMedicines([...medicines, createEmptyMedicine()]);
  };

  const handleRemoveMedicine = (id: string) => {
    if (medicines.length <= 1) return;
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  const handleUpdateMedicine = (id: string, field: keyof MedicineItem, value: string) => {
    setMedicines(
      medicines.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  // Navegação entre etapas com atualização da URL
  const goToNextStep = (next: FlowStep) => {
    if (editingFromReview) {
      setEditingFromReview(false);
      navigateToStep('review');
    } else {
      navigateToStep(next);
    }
  };

  const goToBackStep = (prev: FlowStep) => {
    if (editingFromReview) {
      setEditingFromReview(false);
      navigateToStep('review');
    } else {
      navigateToStep(prev);
    }
  };

  const handleEditSection = (step: FlowStep) => {
    setEditingFromReview(true);
    navigateToStep(step);
  };

  // Geração Final do PDF A4 com Primeira e Segunda Via
  const handleGeneratePdf = () => {
    setIsGenerating(true);

    try {
      const prescriptionData: PrescriptionData = {
        prescriberName: prescriberName.trim(),
        councilType,
        prescriberCrm: prescriberCrm.trim(),
        prescriberUf,
        prescriberStreet: prescriberStreet.trim(),
        prescriberNumber: prescriberNumber.trim(),
        prescriberComplement: prescriberComplement.trim(),
        prescriptionDate,
        patientName: patientName.trim(),
        patientBirthDate: patientBirthDate.trim(),
        patientAddress: patientAddress.trim(),
        medicines: medicines.map((m) => ({
          id: m.id,
          name: m.name.trim(),
          dosage: m.dosage.trim(),
          quantity: m.quantity ? m.quantity.trim() : undefined,
          instructions: m.instructions.trim(),
        })),
        isAnabolic,
        cid: isAnabolic ? cid.trim().toUpperCase() : undefined,
        prescriberCpf: isAnabolic ? prescriberCpf.trim() : undefined,
        observations: observations.trim(),
        createdAt: new Date().toISOString(),
      };

      const pdfOutput = generatePrescriptionPdf(prescriptionData);

      setGeneratedResult({
        prescription: prescriptionData,
        pdfFile: pdfOutput.file,
        pdfUrl: pdfOutput.objectUrl,
      });

      navigateToStep('success');
    } catch (err) {
      console.error('Erro na geração do PDF:', err);
      alert('Houve um erro ao gerar o documento PDF. Por favor, tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Inicia uma nova receita totalmente em branco, zerando qualquer rascunho ou dado prévio
  const handleStartBlankPrescription = () => {
    try {
      sessionStorage.clear();
      localStorage.clear();
    } catch {
      // Ignora erro de storage
    }
    setPrescriberName('');
    setCouncilType('CRM');
    setPrescriberCrm('');
    setPrescriberUf('RJ');
    setPrescriberStreet('');
    setPrescriberNumber('');
    setPrescriberComplement('');
    setPrescriptionDate(getTodayDateString());
    setPatientName('');
    setPatientBirthDate('');
    setPatientAddress('');
    setMedicines([createEmptyMedicine()]);
    setIsAnabolic(false);
    setCid('');
    setPrescriberCpf('');
    setObservations('');
    setGeneratedResult(null);
    setEditingFromReview(false);
    navigateToStep('prescriber');
  };

  const handleResetForNewPrescription = () => {
    handleStartBlankPrescription();
    navigateToStep('welcome');
  };

  // Carrega receita com dados de teste fictícios mediante validação de senha (modo exclusivo de teste)
  const handleLoadTestPrescription = () => {
    setPrescriberName('Dr. Roberto Carlos Mendes');
    setCouncilType('CRM');
    setPrescriberCrm('123456');
    setPrescriberUf('RJ');
    setPrescriberStreet('Rua das Flores');
    setPrescriberNumber('120');
    setPrescriberComplement('Sala 302 - Centro Empresarial, Rio de Janeiro');
    setPrescriptionDate(getTodayDateString());
    setPatientName('Mariana da Silva Albuquerque');
    setPatientBirthDate('1990-04-15');
    setPatientAddress('Avenida das Américas, 500, Bloco 2, Apto 101 - Barra da Tijuca, Rio de Janeiro');
    setMedicines([
      {
        id: 'med-test-1',
        name: 'Amoxicilina + Clavulanato de Potássio 875mg/125mg',
        dosage: '1 comprimido',
        quantity: '1 caixa (14 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral a cada 12 horas durante 10 dias consecutivos.',
      },
      {
        id: 'med-test-2',
        name: 'Dipirona Monoidratada 500mg/mL',
        dosage: '30 gotas',
        quantity: '1 frasco (20 mL)',
        instructions: 'Tomar 30 gotas por via oral a cada 6 horas em caso de dor ou febre (máximo 4 vezes ao dia).',
      },
    ]);
    setIsAnabolic(false);
    setCid('');
    setPrescriberCpf('');
    setObservations('Uso adulto e oral. Ingerir os medicamentos com água. Manter repouso relativo e hidratação adequada.');
    setGeneratedResult(null);
    setEditingFromReview(false);
    navigateToStep('review');
  };

  // Monta objeto completo para a tela de revisão
  const currentPrescriptionData: PrescriptionData = {
    prescriberName,
    councilType,
    prescriberCrm,
    prescriberUf,
    prescriberStreet,
    prescriberNumber,
    prescriberComplement,
    prescriptionDate,
    patientName,
    patientBirthDate,
    patientAddress,
    medicines,
    isAnabolic,
    cid,
    prescriberCpf,
    observations,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Barra de Navegação e Progresso do Topo (oculta na tela de boas-vindas para imersão total) */}
      {currentStep !== 'welcome' && (
        <StepProgressBar
          currentStep={currentStep}
          canGoBack={currentStep !== 'welcome' && currentStep !== 'success'}
          onBack={() => {
            if (editingFromReview) {
              setEditingFromReview(false);
              navigateToStep('review');
              return;
            }
            switch (currentStep) {
              case 'prescriber':
                navigateToStep('welcome');
                break;
              case 'patient':
                navigateToStep('prescriber');
                break;
              case 'medicines':
                navigateToStep('patient');
                break;
              case 'observations':
                navigateToStep('medicines');
                break;
              case 'review':
                navigateToStep('observations');
                break;
              default:
                break;
            }
          }}
        />
      )}

      <main className="flex-1 flex flex-col justify-start">
        {/* TELA 0 — BOAS-VINDAS: URL / */}
        {currentStep === 'welcome' && (
          <WelcomeStep
            onStart={handleStartBlankPrescription}
            onLoadTestPrescription={handleLoadTestPrescription}
          />
        )}

        {/* TELA 1 — EMITENTE / PRESCRITOR: URL /emitente */}
        {currentStep === 'prescriber' && (
          <PrescriberStep
            name={prescriberName}
            councilType={councilType}
            crm={prescriberCrm}
            uf={prescriberUf}
            street={prescriberStreet}
            number={prescriberNumber}
            complement={prescriberComplement}
            prescriptionDate={prescriptionDate}
            onUpdate={(fields) => {
              if (fields.name !== undefined) setPrescriberName(fields.name);
              if (fields.councilType !== undefined) setCouncilType(fields.councilType);
              if (fields.crm !== undefined) setPrescriberCrm(fields.crm);
              if (fields.uf !== undefined) setPrescriberUf(fields.uf);
              if (fields.street !== undefined) setPrescriberStreet(fields.street);
              if (fields.number !== undefined) setPrescriberNumber(fields.number);
              if (fields.complement !== undefined) setPrescriberComplement(fields.complement);
              if (fields.prescriptionDate !== undefined) setPrescriptionDate(fields.prescriptionDate);
            }}
            onNext={() => goToNextStep('patient')}
            onBack={() => goToBackStep('welcome')}
          />
        )}

        {/* TELA 2 — PACIENTE: URL /paciente */}
        {currentStep === 'patient' && (
          <PatientStep
            name={patientName}
            birthDate={patientBirthDate}
            address={patientAddress}
            onUpdate={(name, birthDate, address) => {
              setPatientName(name);
              setPatientBirthDate(birthDate);
              setPatientAddress(address);
            }}
            onNext={() => goToNextStep('medicines')}
            onBack={() => goToBackStep('prescriber')}
          />
        )}

        {/* TELA 3 — PRESCRIÇÃO: URL /prescricao */}
        {currentStep === 'medicines' && (
          <MedicinesStep
            medicines={medicines}
            isAnabolic={isAnabolic}
            cid={cid}
            prescriberCpf={prescriberCpf}
            onUpdateMedicine={handleUpdateMedicine}
            onAddMedicine={handleAddMedicine}
            onRemoveMedicine={handleRemoveMedicine}
            onUpdateAnabolic={(fields) => {
              if (fields.isAnabolic !== undefined) setIsAnabolic(fields.isAnabolic);
              if (fields.cid !== undefined) setCid(fields.cid);
              if (fields.prescriberCpf !== undefined) setPrescriberCpf(fields.prescriberCpf);
            }}
            onNext={() => goToNextStep('observations')}
            onBack={() => goToBackStep('patient')}
          />
        )}

        {/* TELA 4 — OBSERVAÇÕES: URL /observacoes */}
        {currentStep === 'observations' && (
          <ObservationsStep
            observations={observations}
            onUpdate={setObservations}
            onNext={() => goToNextStep('review')}
            onSkip={() => goToNextStep('review')}
            onBack={() => goToBackStep('medicines')}
          />
        )}

        {/* TELA 5 — REVISÃO / GERAR PDF: URL /gerar-pdf */}
        {currentStep === 'review' && (
          <ReviewStep
            data={currentPrescriptionData}
            isGenerating={isGenerating}
            onEditSection={handleEditSection}
            onGenerate={handleGeneratePdf}
            onBack={() => navigateToStep('observations')}
          />
        )}

        {/* TELA 6 — RECEITA GERADA / ENVIAR WHATSAPP: URL /enviar-wpp */}
        {currentStep === 'success' && generatedResult && (
          <SuccessView
            data={generatedResult.prescription}
            pdfFile={generatedResult.pdfFile}
            pdfUrl={generatedResult.pdfUrl}
            onEdit={() => navigateToStep('review')}
            onReset={handleResetForNewPrescription}
          />
        )}
      </main>

      {/* Rodapé institucional com Responsabilidade */}
      {currentStep !== 'welcome' && (
        <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-400 px-4">
          <p className="text-[11px] text-slate-700 font-semibold mb-0.5">
            A ferramenta apenas auxilia na digitação e formatação da receita médica.
          </p>
          <p className="text-[10px] text-slate-500 max-w-xl mx-auto">
            O conteúdo da prescrição é de responsabilidade exclusiva do médico prescritor. O médico deve revisar o documento antes da assinatura.
          </p>
        </footer>
      )}
    </div>
  );
}
