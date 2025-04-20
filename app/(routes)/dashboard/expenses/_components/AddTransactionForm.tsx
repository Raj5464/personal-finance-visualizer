// app/(routes)/dashboard/expenses/_components/AddTransactionForm.tsx
"use client";

import { useState } from "react";

export default function AddTransactionForm() {
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    description: "",
    category: "Food",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (!response.ok) throw new Error("Failed to add transaction");

      console.log("Transaction added:", formData);
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium">Amount</label>
        <input
          id="amount"
          type="number"
          step="0.01"
          required
          value={formData.amount}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium">Date</label>
        <input
          id="date"
          type="date"
          required
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <input
          id="description"
          type="text"
          required
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium">Category</label>
        <select
          id="category"
          required
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Bills">Bills</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Add Transaction
      </button>
    </form>
  );
}
