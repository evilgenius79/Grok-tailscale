export function Sparkline({
  values,
  label,
  tone = "primary",
}: {
  values: number[];
  label: string;
  tone?: "primary" | "accent";
}) {
  const points = values.filter((value) => Number.isFinite(value));
  if (points.length < 2) {
    return <div className="h-12 text-xs text-muted">Waiting for samples</div>;
  }
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const width = 160;
  const height = 48;
  const coords = points
    .map((value, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - 4 - ((value - min) / span) * (height - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      className={tone === "accent" ? "h-12 w-full text-accent" : "h-12 w-full text-primary"}
    >
      <polyline fill="none" stroke="currentColor" strokeWidth="2" points={coords} />
    </svg>
  );
}
