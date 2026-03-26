export const calculateExamBand = (correct: number, total: number) => {
  const score = correct / total;

  if (score >= 0.9) return 9;
  if (score >= 0.8) return 8;
  if (score >= 0.7) return 7;
  if (score >= 0.6) return 6.5;
  if (score >= 0.5) return 6;
  return 5;
};