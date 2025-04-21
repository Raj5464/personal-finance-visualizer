// app/dashboard/budgets/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface BudgetData {
  category: string;
  amount: number;
}

interface PieChartData {
  name: string;
  value: number;
}

interface BudgetResponse {
  budgets?: Record<string, number>;
  month?: string;
}

const CATEGORIES = ["Entertainment", "Transport", "Food", "Utilities", "Other"];
const COLORS = ["#FF6B6B", "#4ECDC4"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const YEARS = Array.from({ length: 5 }, (_, i) => (2025 - i).toString()); // 2021-2025

export default function Budgets() {
  const [budgets, setBudgets] = useState<Record<string, number>>({
    Entertainment: 0,
    Transport: 0,
    Food: 0,
    Utilities: 0,
    Other: 0,
  });
  const [categoryPieData, setCategoryPieData] = useState<Record<string, PieChartData[]>>({});
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [pieChartData, setPieChartData] = useState<PieChartData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch budgets and spent amounts for the selected month
  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const month = `${selectedYear}-${(MONTHS.indexOf(selectedMonth) + 1).toString().padStart(2, "0")}`;
      console.log(`Fetching budgets for month: ${month}`);

      // Fetch budgets
      const budgetResponse = await fetch(`/api/budgets?month=${month}`, { cache: "no-store" });
      if (!budgetResponse.ok) {
        throw new Error(`Failed to fetch budgets: ${budgetResponse.status} ${budgetResponse.statusText}`);
      }
      const budgetData: BudgetResponse = await budgetResponse.json();
      console.log("Budget API response:", budgetData);

      const fetchedBudgets = budgetData.budgets || { Entertainment: 0, Transport: 0, Food: 0, Utilities: 0, Other: 0 };
      setBudgets(fetchedBudgets);

      // Fetch spent amounts
      let spentByCategory: Record<string, number> = { Entertainment: 0, Transport: 0, Food: 0, Utilities: 0, Other: 0 };
      try {
        const spentResponse = await fetch(`/api/transactions/summary?month=${month}`, { cache: "no-store" });
        if (!spentResponse.ok) {
          throw new Error(`Failed to fetch spent amounts: ${spentResponse.status} ${spentResponse.statusText}`);
        }
        const spentData: BudgetData[] = await spentResponse.json();
        console.log("Spent API response:", spentData);

        spentData.forEach((item) => {
          if (CATEGORIES.includes(item.category)) {
            spentByCategory[item.category] = item.amount;
          }
        });
      } catch (spentError) {
        console.warn("Spent data fetch failed, using 0 for all categories:", spentError);
      }

      const totalSpent = Object.values(spentByCategory).reduce((sum, val) => sum + val, 0);
      const totalBudget = Object.values(fetchedBudgets).reduce((sum, val) => sum + val, 0);

      setPieChartData([
        { name: "Total Budget", value: totalBudget },
        { name: "Total Spent", value: totalSpent },
      ]);

      // Set category-wise pie chart data
      const newCategoryPieData: Record<string, PieChartData[]> = {};
      CATEGORIES.forEach((category) => {
        newCategoryPieData[category] = [
          { name: "Budget", value: fetchedBudgets[category] || 0 },
          { name: "Spent", value: spentByCategory[category] || 0 },
        ];
      });
      setCategoryPieData(newCategoryPieData);

      console.log("Pie chart data:", { totalBudget, totalSpent });
      console.log("Category pie data:", newCategoryPieData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to load budget data. Please try again.");
      setPieChartData([]);
      setCategoryPieData({});
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  // Fetch data on mount or when month/year changes
  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  // Handle budget form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const updatedBudgets = { ...budgets, [selectedCategory]: parseFloat(budgetAmount) || 0 };
    const month = `${selectedYear}-${(MONTHS.indexOf(selectedMonth) + 1).toString().padStart(2, "0")}`;

    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budgets: updatedBudgets, month }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save budget: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("POST response:", result);

      setBudgets(updatedBudgets);
      setBudgetAmount("");
      setSuccess("Budget updated successfully!");

      // Re-fetch budgets to ensure UI reflects the latest database state
      await fetchBudgets();
    } catch (err) {
      console.error("POST error:", err);
      setError("Unable to save budget. Please try again.");
    }
  };

  // Handle budget deletion
  const handleDelete = async () => {
    setError(null);
    setSuccess(null);

    try {
      const month = `${selectedYear}-${(MONTHS.indexOf(selectedMonth) + 1).toString().padStart(2, "0")}`;
      const response = await fetch(`/api/budgets?month=${month}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete budget: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("DELETE response:", result);

      setBudgets({ Entertainment: 0, Transport: 0, Food: 0, Utilities: 0, Other: 0 });
      setPieChartData([]);
      setCategoryPieData({});
      setSuccess("Budget deleted successfully!");
    } catch (err) {
      console.error("DELETE error:", err);
      setError("Unable to delete budget. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Budgets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget Form */}
        <Card>
          <CardHeader>
            <CardTitle>Set Monthly Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 mb-4">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium">
                  Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium">
                  Budget Amount
                </label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  placeholder="Enter budget amount"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Update Budget
              </Button>
            </form>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="default" className="mt-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Budget vs Spent Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Budget vs Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button
                onClick={handleDelete}
                variant="destructive"
                disabled={loading || !Object.values(budgets).some((val) => val > 0)}
              >
                Delete Budget
              </Button>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : pieChartData.length === 0 || pieChartData.every((d) => d.value === 0) ? (
              <p>No budget or spending data for {selectedMonth} {selectedYear}.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category-wise Pie Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {CATEGORIES.map((category) => (
          <Card key={category} className="w-full">
            <CardHeader>
              <CardTitle className="text-sm">{category} Budget vs Spent</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryPieData[category]?.every((d) => d.value === 0) ? (
                <p className="text-center text-sm">No data for {category}</p>
              ) : (
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={categoryPieData[category] || []}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={50}
                      label
                    >
                      {categoryPieData[category]?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}