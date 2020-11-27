import { Application, Router, applyGraphQL } from "./config/deps.ts"
import type { IContext} from "./config/deps.ts"
import db from "./config/db.ts"
import { types } from "./schema/schema.ts"
import { resolvers } from "./resolver/task.ts"
const app = new Application();

const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs: types,
  resolvers: resolvers,
  context: (ctx: IContext) => {
    return ctx;
  },
});

app.use(async (ctx, next) => {
  ctx.state.db = db;
  await next();
});
app.use(GraphQLService.routes(), GraphQLService.allowedMethods());


console.log("Server start at http://localhost:8080");
await app.listen({ port: 8080 });
