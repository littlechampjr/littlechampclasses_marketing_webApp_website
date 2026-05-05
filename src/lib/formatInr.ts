export function formatInrFromPaise(paise: number): string {
  const rupees = paise / 100;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(rupees);
  } catch {
    return `₹${Math.round(rupees).toLocaleString("en-IN")}`;
  }
}
