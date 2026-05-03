/** Returns 10-digit national number or null if invalid (India). */
export function parseIndianMobileNational10(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  let rest = digits;
  if (rest.startsWith("91") && rest.length === 12) {
    rest = rest.slice(2);
  }
  if (rest.length !== 10 || !/^[6-9]/.test(rest)) {
    return null;
  }
  return rest;
}
