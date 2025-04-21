import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

// POST - Create or Update a budget
export async function POST(req: NextRequest) {
  try {
    const { category, amount, month } = await req.json();
    const { db } = await connectToDatabase();

    const collection = db.collection("budgets");

    // Upsert the budget
    await collection.updateOne(
      { category, month },
      { $set: { category, month, budget: amount } },
      { upsert: true }
    );

    return NextResponse.json({ message: "Budget saved/updated" });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to save budget" }, { status: 500 });
  }
}

// GET - Return budgets and compare with transaction totals
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const budgets = db.collection("budgets");
    const transactions = db.collection("transactions");

    // Get all budgets
    const allBudgets = await budgets.find({}).toArray();

    const comparison = await Promise.all(
      allBudgets.map(async (budget) => {
        const spent = await transactions
          .aggregate([
            {
              $match: {
                category: budget.category,
                date: { $regex: `^${budget.month}` }, // match YYYY-MM
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" },
              },
            },
          ])
          .toArray();

        return {
          category: budget.category,
          month: budget.month,
          budget: budget.budget,
          spent: spent[0]?.total || 0,
        };
      })
    );

    return NextResponse.json(comparison);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
  }
}

// DELETE - Remove a specific budget (by category and month)
export async function DELETE(req: NextRequest) {
  try {
    const { category, month } = await req.json();
    const { db } = await connectToDatabase();

    const collection = db.collection("budgets");

    await collection.deleteOne({ category, month });

    return NextResponse.json({ message: "Budget deleted" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete budget" }, { status: 500 });
  }
}
