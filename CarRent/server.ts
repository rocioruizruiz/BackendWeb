import {  Application, Router, RouterContext } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import {
  applyGraphQL, GQLError,
} from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

import { Schema } from "./schema/schema.ts"
import { Query } from "./resolvers/Query.ts";
import { Mutation } from "./resolvers/Mutation.ts";
import { Viaje } from "./resolvers/Viaje.ts";
import { Cliente } from "./resolvers/Cliente.ts";
import { Coche } from "./resolvers/Coche.ts";
import { Conductor } from "./resolvers/Conductor.ts";
import { UserSchema } from "./mongo/schema.ts";


const resolvers = {
  Query,
  Mutation,
  Viaje,
  Cliente,
  Coche,
  Conductor,
}

try {
  // connect to Mongo DB
  const DB_URL = Deno.env.get("DB_URL");
  const DB_NAME = Deno.env.get("DB_NAME");

  if (!DB_URL || !DB_NAME) {
    throw Error("Please define DB_URL and DB_NAME on .env file");
  }

  const client = new MongoClient();
  client.connectWithUri(DB_URL);
  const db = client.database(DB_NAME);

  const app = new Application();

  app.use(async (ctx, next) => {
    const value = await ctx.request.body().value;
    // it allows launching of graphql playground
    if (!value || value.operationName === "IntrospectionQuery") {
      await next();
    } else {
      const noAuthResolvers = ["login", "registroUsuario"];
      if (noAuthResolvers.some((elem) => value.query.includes(elem))) {
        await next();
      } else {
        const token = ctx.request.headers.get("token") || "none";
        console.log(token); /**************************************************/
        const user = await db
          .collection<UserSchema>("UserCollection")
          .findOne({ token });
        if (user) {

          ctx.state.user = user;
          if (
            user.rol === "Administrador" && (
              value.query.includes("getCoches") ||
              value.query.includes("getClientes") ||
              value.query.includes("getConductores") ||
              value.query.includes("getViajes"))
            ){
            await next();
          }
            
          else if (
            user.rol === "Cliente" &&
            (value.query.includes("logout") ||
              value.query.includes("solicitarCoche"))
          ) {
            await next();
          }
          
          else if (
            user.rol === "Conductor" &&
            (value.query.includes("logout") ||
              value.query.includes("cambiarDisponibilidadCoche") ||
              value.query.includes("registrarCoche"))
          ) {
            await next();
          } else {
            ctx.response.status = 401;
            ctx.response.body = { error: "Authentication Error" };
          }
        }else {
          ctx.response.status = 401;
          ctx.response.body = { error: "Authentication Error" };
        }
      }
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
        user: ctx.state.user, //no haria falta porque ya esta en el ctx, pero asi es mas facil y no tengo que poner ctx.state.user
      };
    },
  });

  app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

  const port = Deno.env.get("PORT") || "8000";

  console.log(`Server start at http://localhost:${port}`);
  await app.listen({ port: parseInt(port) });
} catch (e) {
  console.error(e);
}