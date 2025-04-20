"use client";
import React, { useState } from 'react';

export const TransactionForm = ({ onAdd }: { onAdd: Function }) => {
  const [amount, setAmount] = useState<number | string>('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && date && description && category) {
      onAdd({ amount, date, description, category });
      setAmount('');
      setDate('');
      setDescription('');
      setCategory('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded"
      >
        <option value="" disabled>Select Category</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Utilities">Utilities</option>
        <option value="Other">Other</option>
      </select>
      <button type="submit" className="w-full py-2 mt-4 bg-red-500 text-white rounded">
        Add Transaction
      </button>
    </form>
  );
};
