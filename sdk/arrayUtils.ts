export function groupArrayItens<T>(array: T[], groupSize: number) {
  const grouped: T[][] = [];
  for (let i = 0; i < array.length; i += groupSize) {
    grouped.push(array.slice(i, i + groupSize));
  }
  return grouped;
}

export function createArrayGroups<T>(array: T[], maxGroups: number) {
  const groupSize = Math.ceil(array.length / maxGroups);
  return groupArrayItens(array, groupSize);
}

export function pickRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
