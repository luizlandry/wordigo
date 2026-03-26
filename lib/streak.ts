export const updateStreak = (lastActive: Date | null) => {
  const today = new Date();

  if (!lastActive) return 1;

  const diff = (today.getTime() - new Date(lastActive).getTime()) / (1000 * 3600 * 24);

  if (diff < 1) return null; // same day
  if (diff < 2) return "increment";

  return 1; // reset
};