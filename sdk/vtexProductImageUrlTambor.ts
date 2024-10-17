function findCharPos(str: string, char: string, count: number) {
  let pos = str.indexOf(char);
  while (count > 1) {
    pos = str.indexOf(char, pos + 1);
    count--;
  }
  return pos;
}

export function changeImageSizeUrl(url: string, width: number, height: number) {
  const fiveSlashPos = findCharPos(url, "/", 5);
  const sixSlashPos = findCharPos(url, "/", 6);
  const start = url.slice(0, fiveSlashPos);
  const end = url.slice(sixSlashPos + 1);
  let currentMiddle = url.slice(fiveSlashPos + 1, sixSlashPos);

  const hasDash = currentMiddle.includes("-");
  if (hasDash) {
    currentMiddle = currentMiddle.split("-")[0];
  }

  const newMiddle = `${currentMiddle}-${width}-${height}`;
  return `${start}/${newMiddle}/${end}`;
}
