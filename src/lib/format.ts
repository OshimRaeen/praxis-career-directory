export function formatInrLpa(amount: number | null): string {
  if (amount === null || Number.isNaN(amount)) return "—";
  if (amount >= 100_000) {
    const lpa = amount / 100_000;
    const formatted = Number.isInteger(lpa) ? lpa.toFixed(0) : lpa.toFixed(1);
    return `₹${formatted}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatUsdCompact(amount: number | null): string {
  if (amount === null || Number.isNaN(amount)) return "—";
  if (amount >= 1_000) {
    const k = amount / 1_000;
    const formatted = Number.isInteger(k) ? k.toFixed(0) : k.toFixed(1);
    return `$${formatted}k`;
  }
  return `$${amount.toLocaleString("en-US")}`;
}

export function formatCurrencyAmount(
  amount: number | null,
  currency: string | null
): string {
  if (amount === null || Number.isNaN(amount)) return "—";
  if (currency === "INR") return formatInrLpa(amount);
  if (currency === "USD") return formatUsdCompact(amount);

  const symbolMap: Record<string, string> = {
    EUR: "€",
    CAD: "CA$",
    MYR: "RM ",
    EGP: "EGP ",
    QAR: "QAR ",
  };
  const prefix = currency ? (symbolMap[currency] ?? `${currency} `) : "";
  if (amount >= 1_000) {
    const k = amount / 1_000;
    return `${prefix}${Number.isInteger(k) ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return `${prefix}${amount.toLocaleString("en-US")}`;
}

export function formatSalaryRange(
  min: number | null,
  max: number | null,
  currency: string | null
): string {
  if (min === null && max === null) return "Not disclosed";
  if (min !== null && max !== null && min !== max) {
    return `${formatCurrencyAmount(min, currency)} – ${formatCurrencyAmount(max, currency)}`;
  }
  return formatCurrencyAmount(min ?? max, currency);
}

export function formatEquityRange(
  min: number | null,
  max: number | null
): string {
  if (min === null && max === null) return "Not stated";
  if (min !== null && max !== null && min !== max) {
    return `${min}% – ${max}%`;
  }
  return `${min ?? max}%`;
}