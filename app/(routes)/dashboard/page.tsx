"use client";
import React, { useState, useEffect } from "react";
import { TransactionForm } from "./_components/TransactionForm";
import { TransactionList } from "./_components/TransactionList";
import { MonthlyChart } from "./_components/MonthlyChart";

type Transaction = {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
};

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        const transformedTransactions = data.map((t: any) => ({
          ...t,
          id: t._id,
          category: t.category || "Uncategorized",
        }));
        setTransactions(transformedTransactions);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchTransactions();
  }, []);

  const addTransaction = async (tx: {
    amount: number;
    date: string;
    description: string;
    category: string;
  }) => {
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tx),
      });
      const savedTx = await res.json();
      setTransactions((prev) => [
        ...prev,
        { ...savedTx, _id: savedTx._id },
      ]);
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  const deleteTransaction = async (_id: string) => {
    try {
      // Send DELETE request to the API
      const res = await fetch(`/api/transactions/${_id}`, {
        method: "DELETE",
      });

      // Check if delete was successful
      if (res.ok) {
        // Update state to remove the deleted transaction
        setTransactions((prev) => prev.filter((t) => t._id !== _id));
      } else {
        const errorData = await res.json();
        console.error(errorData.error || "Failed to delete transaction");
      }
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <TransactionForm onAdd={addTransaction} />
      <TransactionList transactions={transactions} onDelete={deleteTransaction} />
      <MonthlyChart
        transactions={transactions.map(({ _id, ...rest }) => rest)}
      />
    </div>
  );
}
