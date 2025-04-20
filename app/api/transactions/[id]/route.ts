// app/api/transactions/[id]/route.ts
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/mongodb";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await the params to get the id
    const { id } = await params;
    console.log("Received ID:", id);

    // Check if the id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Connect to the database
    const { db } = await connectToDatabase();
    const collection = db.collection("transactions");

    // Attempts to delete the transaction
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    console.log("Delete result:", result);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Transaction deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}