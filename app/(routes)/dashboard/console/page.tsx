// File: app/(routes)/dashboard/expenses/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Progress } from "@/components/ui/progress";
import CategoryPieChart from "./CategoryPieChart";

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/transactions");
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const data = await res.json();
        const cleaned = data.map((t: any) => ({
          ...t,
          amount:
            typeof t.amount === "string" ? parseFloat(t.amount) : t.amount,
        }));
        setTransactions(cleaned);
      } catch (err) {
        console.error(err);
        setError("Error fetching data");
      }
    }
    fetchData();
  }, []);

  const totalExpense = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const latestTransaction =
    transactions.length > 0 ? transactions[transactions.length - 1] : null;

  // Prepare weekly data for the sparkline (last 7 days)
  const today = new Date();
  const dates: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    dates.push(d);
  }
  const dataMap: Record<string, number> = {};
  transactions.forEach((tx) => {
    const txDate = new Date(tx.date);
    const key = `${txDate.getFullYear()}-${String(
      txDate.getMonth() + 1
    ).padStart(2, "0")}-${String(txDate.getDate()).padStart(2, "0")}`;
    dataMap[key] = (dataMap[key] || 0) + tx.amount;
  });
  const sparkData = dates.map((d) => {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
    return {
      day: d.toLocaleDateString("default", { weekday: "short" }),
      total: dataMap[key] || 0,
    };
  });

  // Simulated budget for demonstration
  const budget = 50000;
  const usedPct = Math.min(100, (totalExpense / budget) * 100);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="h-32">
          <CardHeader className="">
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent >
            <p className="text-2xl font-semibold pb-20">
              ₹{totalExpense.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="h-32">
          <CardHeader>
            <CardTitle>Most Recent</CardTitle>
          </CardHeader>
          <CardContent>
            {latestTransaction ? (
              <>
                <p className="font-medium text-sm ">
                  {latestTransaction.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  ₹{latestTransaction.amount.toFixed(2)} • {latestTransaction.category}
                </p>
              </>
            ) : (
              <p className="text-sm">No transactions yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="h-32">
          <CardHeader>
            <CardTitle>Budget Utilization</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center">
            <p className="text-sm mb-2">
              Stage 3 Update
              
            </p>
         
          </CardContent>
        </Card>
       
      </div>
     

      {/* Main Content: Weekly Sparkline & Transactions List */}
      <div >
      <Card className="mb-6">
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryPieChart transactions={transactions} />
            </CardContent>
          </Card>

      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 h-[250px]">
          <CardHeader>
            <CardTitle>Weekly Spending</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="h-[250px] overflow-auto">
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-sm">No transactions found</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {transactions.map((tx) => (
                  <li key={tx._id} className="flex justify-between border-b pb-1">
                    <span>{tx.description}</span>
                    <span>₹{tx.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
