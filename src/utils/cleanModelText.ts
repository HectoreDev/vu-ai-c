


export const cleanModelText = (raw: string): string => {
  if (!raw) return "";

  return raw
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^json\s*/gi, "")
    .replace(/\\n/g, " ")
    .replace(/\r?\n|\r/g, " ")
    .replace(/\\"/g, '"')
    .replace(/\s{2,}/g, " ")
    .trim();
}