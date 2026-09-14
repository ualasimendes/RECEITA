/**
 * Utilitários de validação e sanitização estrita para regras de preenchimento:
 * - Nomes: estritamente letras e acentos (sem dígitos numéricos).
 * - Números: estritamente dígitos numéricos (sem letras).
 * - Datas: datas reais e válidas no calendário.
 */

// 1. REGRAS DE NOME E RUA (Apenas letras, acentos, espaços, hífens e apóstrofos - SEM NÚMEROS)
export const cleanLetterOnlyInput = (value: string): string => {
  // Remove qualquer número (0-9) mantendo letras, acentuação e pontuações comuns
  return value.replace(/[0-9]/g, '');
};

export const validatePersonName = (
  name: string,
  fieldLabel = 'Nome'
): { valid: boolean; message?: string } => {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, message: `Por favor, informe o ${fieldLabel.toLowerCase()}.` };
  }
  // Não pode conter números
  if (/\d/.test(trimmed)) {
    return { valid: false, message: `O ${fieldLabel.toLowerCase()} deve conter apenas letras, sem números.` };
  }
  // Deve conter apenas caracteres alfabéticos válidos (incluindo acentuação em português)
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'.-]+$/;
  if (!nameRegex.test(trimmed)) {
    return { valid: false, message: `O ${fieldLabel.toLowerCase()} contém caracteres inválidos. Use apenas letras.` };
  }
  if (trimmed.length < 2) {
    return { valid: false, message: `O ${fieldLabel.toLowerCase()} deve ter pelo menos 2 letras.` };
  }
  return { valid: true };
};

export const cleanStreetNameInput = (value: string): string => {
  // Nome da rua: apenas letras, acentos, espaços, hífens, vírgulas ou pontos, SEM dígitos numéricos
  return value.replace(/[0-9]/g, '');
};

export const validateStreetName = (
  street: string
): { valid: boolean; message?: string } => {
  const trimmed = street.trim();
  if (!trimmed) {
    return { valid: false, message: 'Por favor, informe o nome da rua ou avenida (apenas letras).' };
  }
  if (/\d/.test(trimmed)) {
    return { valid: false, message: 'O nome da rua deve conter apenas letras. O número deve ser preenchido no campo ao lado.' };
  }
  if (trimmed.length < 3) {
    return { valid: false, message: 'O nome da rua deve ter no mínimo 3 caracteres.' };
  }
  return { valid: true };
};

// 2. REGRAS DE NÚMEROS (Apenas dígitos de 0 a 9)
export const cleanDigitsOnlyInput = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const validateNumberOnly = (
  value: string,
  fieldLabel = 'Número',
  minDigits = 1,
  maxDigits = 10
): { valid: boolean; message?: string } => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { valid: false, message: `Por favor, informe o ${fieldLabel.toLowerCase()}.` };
  }
  if (!/^\d+$/.test(trimmed)) {
    return { valid: false, message: `O campo ${fieldLabel.toLowerCase()} deve conter apenas números.` };
  }
  if (trimmed.length < minDigits) {
    return {
      valid: false,
      message: `O ${fieldLabel.toLowerCase()} deve ter no mínimo ${minDigits} ${minDigits === 1 ? 'dígito' : 'dígitos'}.`,
    };
  }
  if (trimmed.length > maxDigits) {
    return {
      valid: false,
      message: `O ${fieldLabel.toLowerCase()} não pode ter mais de ${maxDigits} dígitos.`,
    };
  }
  return { valid: true };
};

// 3. REGRAS DE DATAS (Data tem que ser data de calendário válida)
export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const validateCalendarDate = (
  dateStr: string,
  fieldLabel = 'Data'
): { valid: boolean; message?: string; parsedDate?: Date } => {
  if (!dateStr || !dateStr.trim()) {
    return { valid: false, message: `Por favor, informe uma ${fieldLabel.toLowerCase()} válida.` };
  }

  const trimmed = dateStr.trim();
  let year = 0;
  let month = 0;
  let day = 0;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const parts = trimmed.split('-');
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    day = parseInt(parts[2], 10);
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    const parts = trimmed.split('/');
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    year = parseInt(parts[2], 10);
  } else {
    return { valid: false, message: `Formato de ${fieldLabel.toLowerCase()} inválido. Use dia, mês e ano válidos.` };
  }

  if (year < 1900 || year > 2099) {
    return { valid: false, message: `Ano inválido na ${fieldLabel.toLowerCase()} (ano entre 1900 e 2099).` };
  }
  if (month < 1 || month > 12) {
    return { valid: false, message: `Mês inválido na ${fieldLabel.toLowerCase()}.` };
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return {
      valid: false,
      message: `Dia ${day} é inválido para o mês ${String(month).padStart(2, '0')}/${year}.`,
    };
  }

  const parsed = new Date(year, month - 1, day, 12, 0, 0);
  if (isNaN(parsed.getTime())) {
    return { valid: false, message: `Data inválida no calendário.` };
  }

  return { valid: true, parsedDate: parsed };
};

export const validatePatientBirthDate = (
  dateStr: string
): { valid: boolean; message?: string; age?: number } => {
  const base = validateCalendarDate(dateStr, 'Data de nascimento');
  if (!base.valid || !base.parsedDate) {
    return base;
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (base.parsedDate.getTime() > today.getTime()) {
    return { valid: false, message: 'A data de nascimento não pode ser no futuro.' };
  }

  const now = new Date();
  let age = now.getFullYear() - base.parsedDate.getFullYear();
  const m = now.getMonth() - base.parsedDate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < base.parsedDate.getDate())) {
    age--;
  }

  if (age > 130) {
    return { valid: false, message: 'Data de nascimento excede o limite aceitável de idade.' };
  }

  return { valid: true, age };
};

// 4. VALIDAÇÃO DE CPF (Conforme Lei 9.965/2000 e ANVISA para anabolizantes)
export const formatCpf = (value: string): string => {
  const digits = cleanDigitsOnlyInput(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
};

export const validateCpf = (cpfRaw: string): { valid: boolean; message?: string } => {
  const clean = cleanDigitsOnlyInput(cpfRaw);
  if (!clean) {
    return { valid: false, message: 'O CPF do prescritor é obrigatório para anabolizantes (Regra ANVISA).' };
  }
  if (clean.length !== 11) {
    return { valid: false, message: 'O CPF deve conter exatamente 11 dígitos numéricos.' };
  }
  // Bloqueia dígitos todos iguais (111.111.111-11 etc.)
  if (/^(\d)\1{10}$/.test(clean)) {
    return { valid: false, message: 'CPF inválido (dígitos repetidos).' };
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean.charAt(i), 10) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(9), 10)) {
    return { valid: false, message: 'CPF inválido. Verifique os números digitados.' };
  }

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean.charAt(i), 10) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(10), 10)) {
    return { valid: false, message: 'CPF inválido. Verifique os números digitados.' };
  }

  return { valid: true };
};

// 5. VALIDAÇÃO DE CID (Código Internacional de Doenças - ANVISA Anabolizantes)
export const validateCid = (cidRaw: string): { valid: boolean; message?: string } => {
  const trimmed = cidRaw.trim().toUpperCase();
  if (!trimmed) {
    return { valid: false, message: 'O CID é obrigatório para prescrição de anabolizantes (Regra ANVISA).' };
  }
  // Formato CID-10 padrão: Ex: E34, E34.9, M62.5, E29.1, Z76.0
  const cidRegex = /^[A-Z][0-9]{2}(\.[0-9]{1,2})?$/;
  if (!cidRegex.test(trimmed)) {
    return {
      valid: false,
      message: 'CID em formato inválido. Use a classificação CID-10 (Ex: E34.9, E29.1, M62.5).',
    };
  }
  return { valid: true };
};

export const formatIsoDateToDisplay = (isoOrYmd: string): string => {
  const validation = validateCalendarDate(isoOrYmd);
  if (!validation.valid || !validation.parsedDate) {
    const fallback = new Date();
    const d = String(fallback.getDate()).padStart(2, '0');
    const m = String(fallback.getMonth() + 1).padStart(2, '0');
    return `${d}/${m}/${fallback.getFullYear()}`;
  }
  const d = String(validation.parsedDate.getDate()).padStart(2, '0');
  const m = String(validation.parsedDate.getMonth() + 1).padStart(2, '0');
  const y = validation.parsedDate.getFullYear();
  return `${d}/${m}/${y}`;
};

export const formatIsoDateToExtenso = (isoOrYmd: string): string => {
  const monthNames = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ];

  const validation = validateCalendarDate(isoOrYmd);
  const dateObj = validation.valid && validation.parsedDate ? validation.parsedDate : new Date();
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = monthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${day} de ${month} de ${year}`;
};
