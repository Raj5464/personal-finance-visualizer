/*"use client";
import React, { useState } from 'react';

type IncomeInputProps = {
  onSetIncome: (income: number) => void;
};

export function IncomeInput({ onSetIncome }: IncomeInputProps) {
  const [income, setIncome] = useState<string>('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(income);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a positive number');
      return;
    }
    setError('');
    onSetIncome(num);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label className="block font-medium">Set Income:</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={income}
          onChange={e => setIncome(e.target.value)}
          className="border p-2 rounded flex-grow"
          placeholder="Enter total income"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Set
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}*/