// app/(routes)/dashboard/expenses/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryPieChart from "./CategoryPieChart";

interface RawTransaction {
  _id: string;
  amount: number | string;
  date: string;
  description: string;
  category: string;
}

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transactions");
        if (!res.ok) throw new Error("Failed to fetch transactions");

        // Parse JSON and coerce amounts to numbers
        const raw: RawTransaction[] = await res.json();
        const parsed: Transaction[] = raw.map(tx => ({
          ...tx,
          amount: typeof tx.amount === "number"
            ? tx.amount
            : parseFloat(tx.amount) || 0,
        }));

        setTransactions(parsed);
      } catch (err) {
        console.error(err);
        setError("Error fetching transactions");
      }
    }

    fetchTransactions();
  }, []);

  // Group transactions by category
  const categorizedTransactions = transactions.reduce((acc, transaction) => {
    const { category } = transaction;
    if (!acc[category]) acc[category] = [];
    acc[category].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">Transaction Dashboard</h1>
        {error && <div className="text-red-500">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Category Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryPieChart transactions={transactions} />
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {transactions.length === 0 ? (
                  <p>No transactions available</p>
                ) : (
                  transactions.map(({ _id, description, amount }) => (
                    <li key={_id} className="flex justify-between">
                      <span>{description}</span>
                      <span>₹{amount.toFixed(2)}</span>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Display separate boxes for each category */}
          {Object.keys(categorizedTransactions).map((category) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category} Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {categorizedTransactions[category].map(
                    ({ _id, description, amount }) => (
                      <li key={_id} className="flex justify-between">
                        <span>{description}</span>
                        <span>₹{amount.toFixed(2)}</span>
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
