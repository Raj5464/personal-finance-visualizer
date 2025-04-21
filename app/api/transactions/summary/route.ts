// app/api/transactions/summary/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ error: "Valid month (YYYY-MM) is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const spentData = await db.collection("transactions")
      .aggregate([
        {
          $match: {
            date: {
              $gte: startDate.toISOString().split("T")[0],
              $lt: endDate.toISOString().split("T")[0],
            },
          },
        },
        {
          $group: {
            _id: "$category",
            amount: { $sum: { $toDouble: "$amount" } },
          },
        },
        {
          $project: {
            category: "$_id",
            amount: 1,
            _id: 0,
          },
        },
      ])
      .toArray();

    console.log(`Fetched spent data for ${month}:`, spentData);
    return NextResponse.json(spentData);
  } catch (error) {
    console.error(`Error fetching spent amounts for month ${request.url}:`, error);
    return NextResponse.json({ error: "Failed to fetch spent amounts" }, { status: 500 });
  }
}