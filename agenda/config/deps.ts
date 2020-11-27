import {
  Application,
  Router,
  RouterContext,
} from "https://deno.land/x/oak@v6.2.0/mod.ts";
import {
  applyGraphQL,
  gql,
  //GQLError,
} from "https://deno.land/x/oak_graphql/mod.ts";
import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
import { MongoClient, ObjectId } from "https://deno.land/x/mongo@v0.13.0/mod.ts";
import type { Context } from "https://deno.land/x/oak@v6.3.1/context.ts";
import "https://deno.land/x/dotenv/load.ts";
export default "https://deno.land/x/dotenv/load.ts";

export {
  Application,
  MongoClient,
  ObjectId,
  Router,
  gql,
  applyGraphQL,
  Database,
};
export type { RouterContext };
export type IContext = Context<Record<string, any>>;