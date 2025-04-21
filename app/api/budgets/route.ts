// app/api/budgets/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("budgets");

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    if (!month) {
      return NextResponse.json({ error: "Month is required" }, { status: 400 });
    }

    const budget = await collection.findOne({ month });
    return NextResponse.json(budget || {});
  } catch (error) {
    console.error("Error fetching budget:", error);
    return NextResponse.json({ error: "Failed to fetch budget" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("budgets");

    const { budgets, month } = await request.json();

    if (!budgets || !month) {
      return NextResponse.json({ error: "Budgets and month are required" }, { status: 400 });
    }

    const result = await collection.updateOne(
      { month },
      {
        $set: {
          budgets,
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    if (result.matchedCount === 0 && result.upsertedCount === 0) {
      return NextResponse.json({ message: "Failed to save budget" }, { status: 500 });
    }

    const message = result.matchedCount > 0 ? "✅ Budget updated successfully!" : "✅ Budget saved successfully!";
    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error saving/updating budget:", error);
    return NextResponse.json({ error: "Failed to save/update budget" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("budgets");

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    if (!month) {
      return NextResponse.json({ error: "Month is required" }, { status: 400 });
    }

    const result = await collection.deleteOne({ month });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "No budget found for this month" }, { status: 404 });
    }

    return NextResponse.json({ message: "✅ Budget deleted successfully!" });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return NextResponse.json({ error: "Failed to delete budget" }, { status: 500 });
  }
}