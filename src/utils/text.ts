export function textToPascalCase(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
export function textToCamelCase(text: string): string {
  const pascalCase = textToPascalCase(text);
  return pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);
}

export function textToKebabCase(text: string): string {
  return text.toLowerCase().split(" ").join("-");
}

export function formatDistance(distance: number): string {
  if (!distance) {
    return "";
  }
  if (distance < 1) {
    return `~${(distance * 1000).toFixed(0)}m`;
  }
  return `~${distance.toFixed(0)}km`;
}

export function getFirstAndLastName(fullName?: string): string {
  if (!fullName) return "";
  const names = fullName.trim().split(" ");
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  return `${names[0]} ${names[names.length - 1]}`;
}

export function removeAccents(text: string): string {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "C")
    .replace(/ñ/g, "n")
    .replace(/Ñ/g, "N")
    .replace(/°/g, "")
    .replace(/º/g, "")
    .replace(/ª/g, "")
    .replace(/§/g, "paragrafo");
}

export function removeSpecialCharacters(
  text: string,
  space: boolean = false,
): string {
  if (!text) return "";
  return text.replace(/[^a-zA-Z0-9\s]/g, space ? " " : "");
}

export function normalizeText(text?: string | null | number): string {
  if (!text) return "";
  return removeSpecialCharacters(
    removeAccents(String(text)),
    true,
  ).toLowerCase();
}

export function formatPlate(text: string | null): string {
  if (!text) {
    return "";
  }
  const regex = /([A-Z]+)(\d+)/;
  const resultado = text.replace(regex, "$1-$2");
  return resultado;
}

export function getTimePeriod(hour?: string | null) {
  if (!hour) return "N/A";
  const h = parseInt(hour.split(":")[0], 10);
  if (isNaN(h)) return "N/A";

  if (h >= 0 && h < 6) return "Madrugada";
  if (h >= 6 && h < 12) return "Manhã";
  if (h >= 12 && h < 18) return "Tarde";
  return "Noite";
}

export function getLabel(
  list: any[] | undefined,
  id: string | number | undefined,
  keyName = "key",
) {
  if (!list || !Array.isArray(list) || !id) return "Não Informado";
  const item = list.find((i) => String(i[keyName] || i.id) === String(id));
  return item?.label || item?.name || "Não Informado";
}

export function formatCurrency(value?: number | string): string {
  if (!value) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

export function getSummaryValue(value: string | undefined, isVisible: boolean) {
  if (!isVisible) {
    return "R$ ••••••••";
  }
  return formatCurrency(value);
}

export function formatPercentage(value?: string) {
  if (!value) return "+0,00%";
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return value;
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);

  return `${numberValue > 0 ? "+" : ""}${formattedValue}%`;
}

export function abbreviateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

export function abbreviateDepartmentName(departmentName: string): string {
  const departmentSentRegex = /Secretaria (Municipal|Estadual|Federal)? de/gi;
  if (departmentSentRegex.test(departmentName)) {
    return departmentName.replace(departmentSentRegex, "Sec.");
  }
  return abbreviateText(departmentName, 20);
}

export function formatCompactCurrency(value?: string | number) {
  const amount = Number(value ?? 0);
  const absoluteAmount = Math.abs(amount);

  if (absoluteAmount >= 1_000_000) {
    return `R$ ${(amount / 1_000_000).toLocaleString("pt-BR", {
      maximumFractionDigits: 2,
    })} mi`;
  }

  if (absoluteAmount >= 1_000) {
    return `R$ ${(amount / 1_000).toLocaleString("pt-BR", {
      maximumFractionDigits: 1,
    })} mil`;
  }

  return formatCurrency(amount);
}

export function formatPercentageValue(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(Math.abs(value));
}
