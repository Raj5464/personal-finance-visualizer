// app/api/transactions/categories/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("transactions");

    // Aggregate expenses by category
    const categoryData = await collection
      .aggregate([
        {
          $group: {
            _id: "$category",
            totalAmount: { $sum: "$amount" },
          },
        },
        {
          $project: {
            category: "$_id",
            totalAmount: 1,
            _id: 0,
          },
        },
      ])
      .toArray();

    return NextResponse.json(categoryData);
  } catch (error) {
    console.error("Error fetching category data:", error);
    return NextResponse.json({ error: "Failed to fetch category data" }, { status: 500 });
  }
}