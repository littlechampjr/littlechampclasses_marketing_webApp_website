/** Stable HSL background for subject placeholder tiles from a subject key. */
export function subjectPlaceholderStyles(subjectKey: string): { background: string; color: string } {
  let h = 0;
  for (let i = 0; i < subjectKey.length; i++) h = (h * 31 + subjectKey.charCodeAt(i)) >>> 0;
  const hues = [200, 220, 25, 195, 340, 160];
  const hue = hues[h % hues.length];
  return {
    background: `hsl(${hue} 55% 88%)`,
    color: `hsl(${hue} 45% 28%)`,
  };
}

export function subjectInitials(subjectTag: string): string {
  const parts = subjectTag.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0]![0] + parts[1]![0]).toUpperCase();
  }
  const w = parts[0] ?? "?";
  return w.slice(0, 2).toUpperCase();
}
