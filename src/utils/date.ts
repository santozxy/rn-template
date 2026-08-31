import {
  endOfMonth,
  format,
  isValid,
  parse,
  parseISO,
  startOfMonth,
} from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";
import { ptBR } from "date-fns/locale";

const TIMEZONE = "America/Sao_Paulo";
const TIME_ONLY_REGEX = /^\d{2}:\d{2}(:\d{2})?$/;
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function normalizeDateValue(value: string | Date) {
  if (value instanceof Date) {
    return isValid(value) ? value : null;
  }

  if (TIME_ONLY_REGEX.test(value)) {
    const parsedTime = parse(
      value,
      value.length === 5 ? "HH:mm" : "HH:mm:ss",
      new Date(),
    );

    return isValid(parsedTime) ? parsedTime : null;
  }

  if (DATE_ONLY_REGEX.test(value)) {
    const parsedDate = parse(value, "yyyy-MM-dd", new Date());
    return isValid(parsedDate) ? parsedDate : null;
  }

  const parsedIsoDate = parseISO(value);
  if (isValid(parsedIsoDate)) {
    return parsedIsoDate;
  }

  const parsedNativeDate = new Date(value);
  return isValid(parsedNativeDate) ? parsedNativeDate : null;
}

export function formatDate(
  dateStr?: string | null | Date,
  format = "dd/MM/yyyy",
  fallback: string | null = "N/A",
) {
  if (!dateStr) return fallback;
  try {
    const normalizedDate = normalizeDateValue(dateStr);

    if (!normalizedDate) return fallback;

    const date = formatInTimeZone(normalizedDate, TIMEZONE, format, {
      locale: ptBR,
    });
    const isValidDate = date && date !== "Invalid Date";

    if (!isValidDate) return fallback;

    return date;
  } catch {
    return fallback;
  }
}

export function getDateInTimezone(): Date {
  const date = new Date();
  const zonedDate = toDate(date, {
    timeZone: TIMEZONE,
  });
  return zonedDate;
}

export function getMonthRange(date: Date) {
  return {
    startDate: format(startOfMonth(date), "yyyy-MM-dd"),
    endDate: format(endOfMonth(date), "yyyy-MM-dd"),
  };
}
