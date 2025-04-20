"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

interface Props {
  transactions: Transaction[];
  small?: boolean;
}

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
];

export default function CategoryPieChart({ transactions, small = false }: Props) {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const map: Record<string, number> = {};
    transactions.forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    setData(Object.entries(map).map(([name, value]) => ({ name, value })));
  }, [transactions]);

  return (
    <ResponsiveContainer width="100%" height={small ? 100 : 280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={small ? 40 : 80}
          fill="#8884d8"
          label={small ? false : ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          stroke="none"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        {!small && <Tooltip />}
        {!small && <Legend verticalAlign="bottom" height={36} />}
      </PieChart>
    </ResponsiveContainer>
  );
}
