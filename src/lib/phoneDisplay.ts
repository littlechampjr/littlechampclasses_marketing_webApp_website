/** Format 10-digit Indian national number for display, e.g. `(+91) 98765 43210`. */
export function formatIndianMobileDisplay(national10: string): string {
  const d = national10.replace(/\D/g, "");
  if (d.length !== 10) return national10;
  return `(+91) ${d.slice(0, 5)} ${d.slice(5)}`;
}
