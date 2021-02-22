import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { ViajeSchema, CocheSchema } from "../mongo/schema.ts";

interface IContext {
  db: Database;
}


const Cliente = {
  viajes: async (parent: { email: string }, args: any, ctx: IContext) => {
    const db: Database = ctx.db;
    const viajesCollection = db.collection<ViajeSchema>("ViajeCollection");
    return await await viajesCollection.find({
      cliente: parent.email,
    });
  },
};

export { Cliente };
