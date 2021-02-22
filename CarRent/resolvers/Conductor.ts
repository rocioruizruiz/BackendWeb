import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { ViajeSchema, CocheSchema } from "../mongo/schema.ts";

interface IContext {
  db: Database;
}

const Conductor = {
  coche: async (parent: { email: string }, args: any, ctx: IContext) => {
    const db: Database = ctx.db;
        const cochesCollection = db.collection<CocheSchema>("CocheCollection");
    return await cochesCollection.findOne({ conductor: parent.email });
  },
  viajes: async (parent: { email: string }, args: any, ctx: IContext) => {
    const db: Database = ctx.db;
    const viajesCollection = db.collection<ViajeSchema>("ViajeCollection");
    return await viajesCollection.find({ conductor: parent.email });
  },
};

export { Conductor };
