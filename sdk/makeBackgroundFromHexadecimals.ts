export function makeBackgroundFromHexadecimals(hexadecimals: string[]) {
  const percent = 100 / hexadecimals.length;
  const partOne = hexadecimals.map((hex, index) => {
    return `${hex} ${percent * index}% ${percent * (index + 1)}%`;
  }).join(", ");

  return `linear-gradient(to right, ${partOne})`;
}
