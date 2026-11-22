export function PraxisMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect width="28" height="28" rx="7" fill="#102A43" />
      <circle cx="14" cy="14" r="6.5" stroke="#E75A0F" strokeWidth="2" />
      <circle cx="14" cy="14" r="2.2" fill="#FFFFFF" />
    </svg>
  );
}