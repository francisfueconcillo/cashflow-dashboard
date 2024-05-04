function formatNumber(number: number) {
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const tier = Math.log10(Math.abs(number)) / 3 | 0;
  const suffix = suffixes[tier];

  if (tier === 0) return number;

  const scale = Math.pow(10, tier * 3);
  const scaled = number / scale;

  return scaled.toFixed(2) + suffix;
}

export { formatNumber }