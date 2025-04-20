// app/(routes)/dashboard/expenses/CategoryPieChart.tsx
"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface Transaction {
  amount: number;
  category: string;
}

interface CategoryPieChartProps {
  transactions: Transaction[];
}

export default function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Ensure rendering only occurs on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const counts: Record<string, number> = {};
    transactions.forEach((tx) => {
      counts[tx.category] = (counts[tx.category] || 0) + tx.amount;
    });
    const data = Object.entries(counts).map(([name, value]) => ({ name, value }));
    setCategoryData(data);
  }, [transactions]);

  if (!isClient) return null;

  // Colors array can be expanded to match number of categories
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4C4C"];

  return (
    <PieChart width={300} height={300}>
      <Pie
        data={categoryData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={70}
        outerRadius={110}
        fill="#8884d8"
        labelLine={false}
        label={({  value }) => `₹${value.toFixed(2)}`} 
      >
        {categoryData.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend verticalAlign="bottom" height={36} />
    </PieChart>
  );
}
