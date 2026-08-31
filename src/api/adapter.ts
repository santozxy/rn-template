const snakeToCamel = (str: string): string =>
  str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", ""),
  );

const camelToSnake = (str: string): string =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const convertKeys = <T>(obj: T, converter: (str: string) => string): T => {
  if (typeof obj !== "object" || obj === null || obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeys(item, converter)) as T;
  }

  const record = obj as Record<string, unknown>;

  return Object.keys(record).reduce<Record<string, unknown>>((result, key) => {
    const value = record[key];
    const newKey = converter(key);
    result[newKey] = convertKeys(value, converter);
    return result;
  }, {}) as T;
};

const snakeToCamelObject = <T>(obj: T): T => convertKeys(obj, snakeToCamel);

const camelToSnakeObject = <T>(obj: T): T => convertKeys(obj, camelToSnake);

export const adapter = <T>(direction: "toCamel" | "toSnake", obj: T): T => {
  if (direction === "toCamel") {
    return snakeToCamelObject(obj);
  }
  if (direction === "toSnake") {
    return camelToSnakeObject(obj);
  }
  return obj;
};
