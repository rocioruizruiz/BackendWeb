import { MongoClient } from "../config/deps.ts";


const DB_URL = Deno.env.get("DB_URL");
const DB_NAME = Deno.env.get("DB_NAME");
if (!DB_URL || !DB_NAME) {
  throw Error("Please define DB_URL and DB_NAME on .env file");
}

const client = new MongoClient();
client.connectWithUri(DB_URL);
const db = client.database(DB_NAME);

export default db;
