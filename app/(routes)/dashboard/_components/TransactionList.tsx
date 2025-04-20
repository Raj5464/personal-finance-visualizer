// app/(routes)/dashboard/_components/TransactionList.tsx
"use client";
import React from 'react';

export const TransactionList = ({
  transactions,
  onDelete,
}: {
  transactions: any[];
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div key={tx._id} className="flex justify-between items-center p-4 border border-gray-300 rounded">
          <div>
            <p className="font-medium">₹{tx.amount}</p>
            <p className="text-sm text-gray-500">{tx.date} — {tx.description}</p>
            <p className="text-sm text-gray-500">Category: {tx.category}</p>
          </div>
          <button
            onClick={() => onDelete(tx._id)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
