export const getLevel = (xp: number) => {
  if (xp < 50) return 1;
  if (xp < 150) return 2;
  if (xp < 300) return 3;
  if (xp < 600) return 4;
  return 5;
};