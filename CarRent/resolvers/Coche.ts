import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { ViajeSchema, UserSchema } from "../mongo/schema.ts";

interface IContext {
  db: Database;
}

const Coche = {
  viajes: async (parent: { matricula: string }, args: any, ctx: IContext) => {
    const db: Database = ctx.db;
    const viajesCollection = db.collection<ViajeSchema>("ViajeCollection");
    return await viajesCollection.find({ coche: parent.matricula });
  },
  conductor: async (
    parent: { conductor: string },
    args: any,
    ctx: IContext
  ) => {
    const db: Database = ctx.db;
    const usersCollection = db.collection<UserSchema>("UserCollection");
    return await usersCollection.findOne({ email: parent.conductor });
  },
};

export { Coche };
