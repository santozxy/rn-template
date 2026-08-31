export type MaskType = (string | RegExp)[];

export type MaskObject = {
  [K in MaskKey]: MaskType;
};

export type MaskKey = keyof typeof mask;

export const mask = {
  cpf: [
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
  ],
  cnpj: [
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    "/",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
  ],
  // cadastur = 11 digits 18.469168.95-7
  cadastur: [
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    "-",
    /[0-9xX]/,
  ],
  rg: [
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /[0-9xX]/,
  ],
  susCard: [
    /\d/,
    /\d/,
    /\d/,
    " ",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    " ",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    " ",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
  cep: [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/],
  phoneFixed: [
    "(",
    /\d/,
    /\d/,
    ")",
    " ",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
  phoneMobile: [
    "(",
    /\d/,
    /\d/,
    ")",
    " ",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
  date: [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/],
  time: [/[0-2]/, /\d/, ":", /[0-5]/, /\d/],
  creditCard: [
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    " ",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    " ",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    " ",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
  voterID: [
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    " ",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    " ",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
  pisPasep: [
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    "-",
    /\d/,
  ],
  legalProcess: [
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    ".",
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
  isbn: [
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    "-",
    /\d/,
  ],
  plate: [
    /[A-Z0-9]/,
    /[A-Z0-9]/,
    /[A-Z0-9]/,
    "-",
    /[A-Z0-9]/,
    /[A-Z0-9]/,
    /[A-Z0-9]/,
    /[A-Z0-9]/,
  ],
  carPlate: [/[A-Z]/, /[A-Z]/, /[A-Z]/, "-", /\d/, /[A-J0-9]/, /\d/, /\d/],
  chassis: Array(21).fill(/[A-Z0-9]/),
  motor: Array(20).fill(/\S/),
  decimalNumber: [/\d/, ".", /\d/, /\d/],
};

export function applyMask(value: string, mask: MaskType): string {
  let maskedValue = "";
  let valueIndex = 0;

  for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
    const maskChar = mask[i];
    const valueChar = value[valueIndex];

    if (typeof maskChar === "string") {
      maskedValue += maskChar;
      if (valueChar === maskChar) {
        valueIndex++;
      }
    } else {
      if (maskChar.test(valueChar)) {
        maskedValue += valueChar;
        valueIndex++;
      } else {
        break;
      }
    }
  }
  return maskedValue;
}

export function removeMask(value: string, type?: MaskType): string {
  return value.replace(/[^\d]/g, "");
}

export function formatPhone(phone?: string | null) {
  if (!phone) return "";

  const cleanPhone = phone.replace(/\D/g, "");
  return applyMask(
    cleanPhone,
    cleanPhone.length <= 10 ? mask.phoneFixed : mask.phoneMobile,
  );
}

export function validateCpf(cpf: string): boolean {
  // Rejeita CPFs com todos os dígitos iguais (ex: 00000000000, 11111111111)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let firstDigit = 11 - (sum % 11);
  if (firstDigit >= 10) firstDigit = 0;
  if (firstDigit !== parseInt(cpf.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  let secondDigit = 11 - (sum % 11);
  if (secondDigit >= 10) secondDigit = 0;
  if (secondDigit !== parseInt(cpf.charAt(10))) return false;

  return true;
}

export const formatCPF = (cpf?: string) => {
  if (!cpf) {
    return "Não Informado";
  }

  const cleanCPF = cpf.replace(/[^\d]/g, "");

  return (
    cleanCPF.slice(0, 3) +
    "." +
    cleanCPF.slice(3, 6) +
    "." +
    cleanCPF.slice(6, 9) +
    "-" +
    cleanCPF.slice(9, 11)
  );
};

export const formatRG = (rg: string) => {
  const cleanRG = rg.replace(/[^\d]/g, "");

  return (
    cleanRG.slice(0, 2) +
    "." +
    cleanRG.slice(2, 5) +
    "." +
    cleanRG.slice(5, 8) +
    "-" +
    cleanRG.slice(8)
  );
};

export const formatCNPJ = (cnpj: string | null) => {
  if (!cnpj) {
    return "Não Informado";
  }
  const cleanCNPJ = cnpj.replace(/[^\d]/g, "");

  return (
    cleanCNPJ.slice(0, 2) +
    "." +
    cleanCNPJ.slice(2, 5) +
    "." +
    cleanCNPJ.slice(5, 8) +
    "/" +
    cleanCNPJ.slice(8, 12) +
    "-" +
    cleanCNPJ.slice(12, 14)
  );
};
