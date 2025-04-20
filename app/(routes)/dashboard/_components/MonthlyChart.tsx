"use client";
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type Tx = { amount: number; date: string };

type MonthlyChartProps = { transactions: Tx[]; };

export function MonthlyChart({ transactions }: MonthlyChartProps) {
  const data = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString('default', { month: 'short' }), total: 0 }));
  transactions.forEach(tx => {
    const idx = new Date(tx.date).getMonth(); data[idx].total += tx.amount;
  });
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#FF0000" />
      </BarChart>
    </ResponsiveContainer>
  );
}
