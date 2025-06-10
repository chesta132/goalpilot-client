function avgCalc(items: number[]) {
  const validValue = items.filter((value) => typeof value === "number" && !isNaN(value));

  if (validValue.length === 0) {
    return 0;
  }

  const sum = validValue.reduce((acc, val) => acc + val, 0);
  const average = sum / validValue.length;
  return average;
}

function sum(items: number[]) {
  const sum = items.reduce((acc, val) => acc + val, 0);
  return sum
}

export { avgCalc, sum };
