export function isLegacyKaren(text: string | null | undefined): boolean {
  if (!text) return false;
  // If the text contains any standard Unicode Myanmar/Karen block characters, it is NOT legacy.
  const hasUnicodeKaren = /[\u1000-\u109F\uAA60-\uAA7F\uA9E0-\uA9FF]/.test(text);
  return !hasUnicodeKaren;
}
