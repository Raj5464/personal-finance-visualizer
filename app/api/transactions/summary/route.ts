import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Transaction from "@/app/models/Transaction";

export async function GET() {
  await connectToDatabase();

  const summary = await Transaction.aggregate([
    {
      $group: {
        _id: "$category",
        amount: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        amount: 1,
      },
    },
  ]);

  return NextResponse.json(summary);
}
