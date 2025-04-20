// lib/mongodb.ts
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;
let dbPromise: Promise<Db>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const dbName = "FIN-VIS"; // Your database name from the GET/POST route

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable to cache the connection
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
  dbPromise = clientPromise.then((client) => client.db(dbName));
} else {
  // In production, create a new connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
  dbPromise = clientPromise.then((client) => client.db(dbName));
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const client = await clientPromise;
  const db = await dbPromise;
  console.log("Connected to database:", db.databaseName);
  return { client, db };
}