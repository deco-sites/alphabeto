export function findValuesByKey<T = unknown>(obj: unknown, searchKey: string): T[] {
  const values: T[] = [];

  function searchRecursively(item: unknown) {
    if (typeof item === "object" && item !== null) {
      if (Array.isArray(item)) {
        // If the item is an array, apply the search recursively to each element
        item.forEach((subItem) => searchRecursively(subItem));
      } else {
        for (const key in item as Record<string, unknown>) {
          // deno-lint-ignore no-prototype-builtins
          if ((item as Record<string, unknown>).hasOwnProperty(key)) {
            // Compare keys ignoring case sensitivity
            if (key.toLowerCase() === searchKey.toLowerCase()) {
              values.push((item as Record<string, T>)[key]);
            } else {
              searchRecursively((item as Record<string, unknown>)[key]);
            }
          }
        }
      }
    }
  }

  // Start the search from the provided object
  searchRecursively(obj);

  return values;
}

export function refReplacer() {
  const objectToPathMap = new Map<object, string>(); // Mapeia objetos para suas localizações em string
  const valueReferenceMap = new Map<object, string>(); // Mapeia valores complexos para referências de caminho
  let rootValue: unknown = null; // Guarda o valor inicial para comparação de referência

  return function (this: unknown, key: string | number, value: unknown) {
    const currentPath = objectToPathMap.get(this as object) + (Array.isArray(this) ? `[${key}]` : "." + key); // Determina o caminho atual
    const isComplexObject = value === Object(value); // Verifica se o valor é um objeto ou array

    if (isComplexObject) objectToPathMap.set(value as object, currentPath); // Salva o caminho do objeto atual

    const existingReference = valueReferenceMap.get(value as object) || ""; // Obtém referência existente para o valor, se houver
    const cleanedPath = currentPath.replace(/undefined\.\.?/, ""); // Remove strings 'undefined' do caminho
    let formattedValue = existingReference ? `#REF:${existingReference[0] === "[" ? "$" : "$."}${existingReference}` : value; // Define o valor formatado, com referência caso exista

    if (!rootValue) rootValue = value; // Define o valor raiz na primeira execução
    else if (formattedValue === rootValue) formattedValue = "#REF:$"; // Usa referência raiz para valores repetidos

    if (!existingReference && isComplexObject) valueReferenceMap.set(value as object, cleanedPath); // Armazena o caminho do valor se for novo

    return formattedValue;
  };
}

export function removeCircularRefs(obj: unknown) {
  return JSON.parse(JSON.stringify(obj, refReplacer()));
}
