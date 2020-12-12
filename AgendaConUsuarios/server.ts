import { Application, Router } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import type { RouterContext } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import {
  applyGraphQL,
  GQLError,
} from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

import { Schema } from "./schema/schema.ts";
import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { Task } from "./resolvers/task.ts";
import { User } from "./resolvers/user.ts";
import { SessionSchema } from "./mongo/schema.ts";

const resolvers = {
  Query,
  Mutation,
  Task,
  User
};

try {
  // connect to Mongo DB
  const DB_URL = Deno.env.get("DB_URL");
  const DB_NAME = Deno.env.get("DB_NAME");

  if (!DB_URL || !DB_NAME) {
    throw new GQLError("Please define DB_URL and DB_NAME on .env file");
  }

  const client = new MongoClient();
  client.connectWithUri(DB_URL);
  const db = client.database(DB_NAME);

  const app = new Application();

  app.use(async (ctx, next) => {
    try {
      let value = await ctx.request.body().value;
      //console.log(value);
      const sessions: any = db.collection<SessionSchema>("SessionCollection");
      if (
        value.query.includes("signUp") ||
        value.query.includes("signIn") ||
        value.query.includes("query IntrospectionQuery")
      ) {
        await next();
      } else {
        if (await sessions.findOne({ token: ctx.request.headers.get("token") })) {
          await next();
        } else {
          ctx.response.status = 401;
          ctx.response.body = { error: "Unauthorized User" };
        }
      }
    } catch (e) {
      throw new GQLError("error");
    }
});


  const GraphQLService = await applyGraphQL<Router>({
    Router,
    path: "/graphql",
    typeDefs: Schema,
    resolvers,
    context: (ctx: RouterContext) => {
      return {
        ctx,
        db,
      };
    },
  });

  app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

  const port = Deno.env.get("PORT") || "4000";

  console.log(`Server start at http://localhost:${port}`);
  await app.listen({ port: parseInt(port) });
} catch (e) {
  console.error(e);
}
