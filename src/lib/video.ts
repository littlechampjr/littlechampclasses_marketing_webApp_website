/** Returns a YouTube embed URL, or null if not usable. */
export function toYouTubeEmbed(url: string): string | null {
  const u = url.trim();
  if (!u) return null;
  if (u.includes("youtube.com/embed/")) return u.split("?")[0] ?? u;
  const watch = u.match(/[?&]v=([^&]+)/);
  if (watch?.[1]) return `https://www.youtube.com/embed/${watch[1]}`;
  const short = u.match(/youtu\.be\/([^?]+)/);
  if (short?.[1]) return `https://www.youtube.com/embed/${short[1]}`;
  return null;
}
