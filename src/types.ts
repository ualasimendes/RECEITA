export type CouncilType = 'CRM' | 'CRO' | 'CRMV';

export interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  quantity?: string;
  instructions: string; // Posologia
}

export interface PrescriptionData {
  // 1. Identificação do Emitente / Prescritor (Mesmo do carimbo e cabeçalho da receita)
  prescriberName: string; // apenas letras
  councilType: CouncilType; // CRM, CRO ou CRMV
  prescriberCrm: string; // apenas números
  prescriberUf: string;
  prescriberStreet: string; // apenas letras no nome da rua
  prescriberNumber: string; // apenas números
  prescriberComplement?: string; // complemento/bairro/cidade
  prescriptionDate: string; // YYYY-MM-DD

  // 2. Paciente
  patientName: string; // apenas letras
  patientBirthDate: string; // YYYY-MM-DD
  patientAddress: string; // endereço completo

  // 3. Medicamentos (1 a 3) e Regra ANVISA para Anabolizantes
  medicines: MedicineItem[];
  isAnabolic: boolean; // O medicamento é anabolizante? (Sim/Não)
  cid?: string; // Obrigatório se isAnabolic = true (CID-10)
  prescriberCpf?: string; // Obrigatório se isAnabolic = true (CPF do prescritor)

  // 4. Observações
  observations: string;

  // Metadados
  createdAt: string;
}

export type FlowStep =
  | 'welcome' // Tela 0: Boas-vindas
  | 'prescriber' // Tela 1: Emitente / Prescritor (Cabeçalho da receita e carimbo)
  | 'patient' // Tela 2: Paciente (Nome, Nascimento, Endereço)
  | 'medicines' // Tela 3: Medicamentos + Pergunta Anabolizante (CID + CPF)
  | 'observations' // Tela 4: Observações adicionais
  | 'review' // Tela 5: Revisão final
  | 'success'; // Tela 6: Concluído e Download PDF

export const BRAZILIAN_STATES = [
  { uf: 'AC', name: 'Acre' },
  { uf: 'AL', name: 'Alagoas' },
  { uf: 'AP', name: 'Amapá' },
  { uf: 'AM', name: 'Amazonas' },
  { uf: 'BA', name: 'Bahia' },
  { uf: 'CE', name: 'Ceará' },
  { uf: 'DF', name: 'Distrito Federal' },
  { uf: 'ES', name: 'Espírito Santo' },
  { uf: 'GO', name: 'Goiás' },
  { uf: 'MA', name: 'Maranhão' },
  { uf: 'MT', name: 'Mato Grosso' },
  { uf: 'MS', name: 'Mato Grosso do Sul' },
  { uf: 'MG', name: 'Minas Gerais' },
  { uf: 'PA', name: 'Pará' },
  { uf: 'PB', name: 'Paraíba' },
  { uf: 'PR', name: 'Paraná' },
  { uf: 'PE', name: 'Pernambuco' },
  { uf: 'PI', name: 'Piauí' },
  { uf: 'RJ', name: 'Rio de Janeiro' },
  { uf: 'RN', name: 'Rio Grande do Norte' },
  { uf: 'RS', name: 'Rio Grande do Sul' },
  { uf: 'RO', name: 'Rondônia' },
  { uf: 'RR', name: 'Roraima' },
  { uf: 'SC', name: 'Santa Catarina' },
  { uf: 'SP', name: 'São Paulo' },
  { uf: 'SE', name: 'Sergipe' },
  { uf: 'TO', name: 'Tocantins' },
];

