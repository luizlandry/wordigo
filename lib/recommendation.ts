export const recommendLesson = (weakAreas: string[]) => {
  if (weakAreas.includes("grammar")) return "Grammar Course";
  if (weakAreas.includes("vocabulary")) return "Vocabulary Builder";
  return "Mixed Practice";
};

