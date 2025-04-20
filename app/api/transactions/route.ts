// app/api/transactions/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const transactions = await db.collection("transactions").find().toArray();
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("transactions");

    const { amount, date, description, category } = await request.json();

    const result = await collection.insertOne({
      amount,
      date,
      description,
      category,
    });

    const insertedTransaction = await collection.findOne({ _id: result.insertedId });

    return NextResponse.json(insertedTransaction);
  } catch (error) {
    console.error("Error inserting transaction:", error);
    return NextResponse.json({ error: "Failed to insert transaction" }, { status: 500 });
  }
}