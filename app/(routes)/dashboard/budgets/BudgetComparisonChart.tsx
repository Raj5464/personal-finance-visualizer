"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

type SummaryItem = {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentUsed: number;
};

export default function BudgetComparisonChart() {
  const [data, setData] = useState<SummaryItem[]>([]);

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await fetch("/api/budget-summary?month=2025-04");
      const json = await res.json();
      setData(json);
    };
    fetchSummary();
  }, []);

  return (
    <div className="w-full h-auto p-4 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Budget vs Spent</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="budgeted" fill="#8884d8" name="Budgeted" />
          <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-2">
        <h3 className="text-lg font-medium">Insights</h3>
        {data.map((item) => (
          <p key={item.category} className="text-sm">
            <strong>{item.category}</strong>: {item.percentUsed}% used —
            {item.spent > item.budgeted
              ? ` Over Budget by ₹${item.spent - item.budgeted}`
              : ` ₹${item.remaining} remaining`}
          </p>
        ))}
      </div>
    </div>
  );
}
