"use client";
import React, { useState } from 'react';

type TxInput = {
  amount: number;
  date: string;
  description: string;
};

type TransactionFormProps = {
  onAdd: (tx: TxInput) => void;
};

export function TransactionForm({ onAdd }: TransactionFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0 || !date) {
      setError('Amount and date are required, amount must be positive');
      return;
    }
    setError('');
    onAdd({ amount: amt, date, description });
    setAmount(''); setDate(''); setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 border p-4 rounded">
      <div>
        <label className="block font-medium">Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Enter expense amount"
        />
      </div>
      
      <div>
        <label className="block font-medium">Date:</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block font-medium">Description:</label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Enter description (optional)"
        />
      </div>
      <button type="submit" className="w-full bg-red-600 text-white py-2 rounded">
        Add Expense
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}