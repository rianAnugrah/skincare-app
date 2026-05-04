interface StatusBadgeProps {
  status: "valid" | "invalid";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const isValid = status === "valid";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide ${
        isValid
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {isValid ? "✓ Valid" : "✗ Invalid"}
    </span>
  );
}
