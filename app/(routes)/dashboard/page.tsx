"use client";
import React, { useState } from 'react';
//import { IncomeInput } from './_components/IncomeInput';
import { TransactionForm } from './_components/TransactionForm';
import { TransactionList } from './_components/TransactionList';
import { MonthlyChart } from './_components/MonthlyChart';

export default function DashboardPage() {
  // Total income
  const [income, setIncome] = useState<number | null>(null);
  // Expense transactions
  const [transactions, setTransactions] = useState<{
    id: string;
    amount: number;
    date: string;
    description: string;
  }[]>([]);

  // Add a new expense (subtracts from income)
  const addTransaction = (tx: { amount: number; date: string; description: string }) => {
    setTransactions(prev => [...prev, { ...tx, id: Date.now().toString() }]);
  };

  // Delete an expense
  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Calculate remaining balance
  const totalExpenses = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const remaining = income !== null ? income - totalExpenses : null;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
     

          {/* Add Expense Form */}
          <TransactionForm onAdd={addTransaction} />

          {/* Expense List */}
          <TransactionList transactions={transactions} onDelete={deleteTransaction} />

          {/* Monthly Expenses Chart */}
          <MonthlyChart transactions={transactions.map(({ id, ...rest }) => rest)} />
        
      
    </div>
  );
}
