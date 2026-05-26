"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
} from "recharts";

interface BarData {
  name: string;
  count: number;
  color?: string;
}

interface LineData {
  month: string;
  [sport: string]: string | number;
}

interface Props {
  type: "bar" | "line";
  data: BarData[] | LineData[];
  lines?: { key: string; color: string }[];
  height?: number;
}

const TOOLTIP_STYLE = {
  backgroundColor: "#27272a",
  border: "1px solid #3f3f46",
  borderRadius: "8px",
  color: "#f4f4f5",
  fontSize: "12px",
};

export default function StatsChart({ type, data, lines = [], height = 200 }: Props) {
  if (type === "bar") {
    const barData = data as BarData[];
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
          <XAxis type="number" tick={{ fill: "#71717a", fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 12 }} tickLine={false} axisLine={false} width={40} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "#3f3f46" }} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {barData.map((entry, i) => (
              <rect key={i} fill={entry.color ?? "#34d399"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data as LineData[]} margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
        <XAxis dataKey="month" tick={{ fill: "#71717a", fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: "#71717a", fontSize: 11 }} tickLine={false} axisLine={false} width={28} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: "11px", color: "#a1a1aa" }} />
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            stroke={l.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
