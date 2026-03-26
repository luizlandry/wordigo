export const calculateBandScore = (text: string) => {
  const words = text.trim().split(/\s+/).length;

  // basic realistic scoring logic
  if (words < 20) return 4.0;
  if (words < 40) return 5.0;
  if (words < 80) return 6.0;
  if (words < 120) return 6.5;
  if (words < 180) return 7.0;
  if (words < 250) return 7.5;

  return 8.0;
};