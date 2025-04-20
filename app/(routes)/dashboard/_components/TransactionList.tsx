"use client";
import React from 'react';

type Tx = {
  id: string;
  amount: number;
  date: string;
  description: string;
};

type TransactionListProps = {
  transactions: Tx[];
  onDelete: (id: string) => void;
};

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  return (
    <div className="space-y-2">
      {transactions.map(tx => (
        <div key={tx.id} className="flex justify-between items-center border p-2 rounded">
          <div>
            <p className="font-medium">${tx.amount.toFixed(2)}</p>
            <p className="text-sm text-gray-500">{tx.date} — {tx.description}</p>
          </div>
          <button onClick={() => onDelete(tx.id)} className="text-red-600 hover:underline">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
