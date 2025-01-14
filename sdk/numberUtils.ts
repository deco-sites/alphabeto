export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}
export function isOdd(number: number): boolean {
  return number % 2 !== 0;
}

export function isEven(number: number): boolean {
  return !isOdd(number);
}
