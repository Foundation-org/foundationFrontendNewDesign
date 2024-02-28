export const formatCountNumber = (num) => {
  if (num >= 1000) {
    const formatted = (num / 1000).toLocaleString(undefined, { minimumFractionDigits: num % 1000 !== 0 ? 1 : 0 });
    return formatted + 'k';
  }
  return num.toLocaleString();
};
