"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: { session: number; value: number }[];
}

export function NetWorthChart({ data }: Props) {
  if (data.length < 2) return <p className="text-slate-500 text-sm text-center py-2">Complete sessions to see your chart!</p>;
  return (
    <ResponsiveContainer width="100%" height={120}>
      <LineChart data={data}>
        <XAxis dataKey="session" tick={{ fill: "#64748b", fontSize: 11 }} />
        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
        <Tooltip
          contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8 }}
          labelStyle={{ color: "#94a3b8" }}
          itemStyle={{ color: "#fbbf24" }}
        />
        <Line type="monotone" dataKey="value" stroke="#fbbf24" strokeWidth={2} dot={{ fill: "#fbbf24", r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
