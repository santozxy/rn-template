export function defaultListKeyExtractor<T>(item: T, index: number) {
  if (item !== null && typeof item === "object" && "id" in item) {
    const id = item.id;
    if (typeof id === "string" || typeof id === "number") return String(id);
  }

  return index.toString();
}
