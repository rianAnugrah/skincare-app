interface StatusBadgeProps {
  status: "valid" | "invalid";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const isValid = status === "valid";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-[0.1em] uppercase ${
        isValid
          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
          : "bg-red-50 text-red-700 border border-red-100"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isValid ? "bg-emerald-400" : "bg-red-400"}`} />
      {isValid ? "Verified" : "Invalid"}
    </span>
  );
}
