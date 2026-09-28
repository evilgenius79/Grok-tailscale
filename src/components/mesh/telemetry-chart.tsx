import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatClock } from "@/lib/mesh/format";

export type ChartRow = {
  t: number;
  cpu: number | null;
  rx: number | null;
  tx: number | null;
  latency: number | null;
};

const tooltipStyle = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-line)",
  borderRadius: 8,
  color: "var(--color-fg)",
  fontSize: 12,
};

export function TelemetryChart({ rows, kind }: { rows: ChartRow[]; kind: "host" | "latency" }) {
  if (rows.length < 2) {
    return <p className="text-sm text-muted">Not enough samples yet. Leave this tab open.</p>;
  }
  if (kind === "latency") {
    return (
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows}>
            <XAxis dataKey="t" hide />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={tooltipStyle}
              labelFormatter={(value) => formatClock(Number(value))}
              formatter={(value) => [`${value} ms`, "Nearest relay"]}
            />
            <Area
              type="monotone"
              dataKey="latency"
              stroke="var(--color-primary)"
              fill="var(--color-primary)"
              fillOpacity={0.16}
              strokeWidth={2}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="h-36 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows}>
            <XAxis dataKey="t" hide />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              contentStyle={tooltipStyle}
              labelFormatter={(value) => formatClock(Number(value))}
              formatter={(value) => [`${value}%`, "CPU"]}
            />
            <Area
              type="monotone"
              dataKey="cpu"
              stroke="var(--color-primary)"
              fill="var(--color-primary)"
              fillOpacity={0.16}
              strokeWidth={2}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="h-36 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows}>
            <XAxis dataKey="t" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={tooltipStyle}
              labelFormatter={(value) => formatClock(Number(value))}
              formatter={(value, name) => [`${value} Mb/s`, name === "rx" ? "Receive" : "Transmit"]}
            />
            <Area type="monotone" dataKey="rx" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.12} strokeWidth={2} />
            <Area type="monotone" dataKey="tx" stroke="var(--color-accent)" fill="var(--color-accent)" fillOpacity={0.12} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
