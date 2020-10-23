import { MongoClient} from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import type { CharacterSchema, EpisodeSchema, LocationSchema } from "../schemas.ts"

const DB_URL = Deno.env.get("DB_URL");
const DB_NAME = Deno.env.get("DB_NAME");
if(!DB_URL || !DB_NAME){
  throw Error("Please define DB_URL and DB_NAME on .env file");
}

const client = new MongoClient();
client.connectWithUri(DB_URL);
const db = client.database(DB_NAME);

export const characters = db.collection<CharacterSchema>("CharactersCollection");
export const episodes = db.collection<EpisodeSchema>("EpisodesCollection");
export const locations = db.collection<LocationSchema>("LocationsCollection");
