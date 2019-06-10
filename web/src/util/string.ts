export function getLongestCommonPrefix(items: string[]): string {
  let prefix = "";
  const minLength = Math.min(...items.map(i => i.length));
  for (let i = 0; i < minLength; i++) {
    prefix += items[0][0];
    if (items.some(i => !i.startsWith(prefix))) {
      return prefix.slice(0, -1);
    }
  }
  return prefix;
}
