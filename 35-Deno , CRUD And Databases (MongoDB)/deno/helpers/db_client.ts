import {
  MongoClient,
  Database,
} from "https://deno.land/x/mongo@v0.30.1/mod.ts";
let db = Database;

const client = new MongoClient();

export async function connect() {
  await client.connect(
    // Changed and deleted the user Dont BOTHER
    // Create your own one from MONGO DB ATLAS ITS FREE
    "mongodb+srv://node-db:yJulykHuRjvv6RJV@todo-app.quv8u2u.mongodb.net/todo-app?authMechanism=SCRAM-SHA-1"
  );
  console.log("Database connection was successful!");

  db = client.database("todos-app");
}

export function getDb() {
  return db;
}
