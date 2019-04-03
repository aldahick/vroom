export function toMoneyString(value: number) {
  const tokens = value.toFixed(2).split(".");
  for (let i = tokens[0].length - 3; i > 0; i -= 3) {
    tokens[0] = tokens[0].slice(0, i) + "," + tokens[0].slice(i);
  }
  return "$" + tokens.join(".");
}
