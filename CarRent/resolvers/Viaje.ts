import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { UserSchema, CocheSchema } from "../mongo/schema.ts";
import { IContext} from "../types.ts";



const Viaje = {

  coche: async (
    parent: { coche: string },
    args: any,
    ctx: IContext
  ) => {
    const db: Database = ctx.db;
    const cochesCollection = db.collection<CocheSchema>("CocheCollection");
    return await cochesCollection.findOne({
      matricula: parent.coche,
    });
  } ,

  conductor: async (
    parent: {
      conductor: string;
    },
    args: any,
    ctx: IContext
  ) => {
    const db: Database = ctx.db;
    //const cochesCollection = db.Collection.findOne({})
    const UsersCollection = db.collection<UserSchema>("UserCollection");
    return await UsersCollection.findOne({ email: parent.conductor });
  },
  cliente: async (
    parent: { cliente: string },
    args: any,
    ctx: IContext
  ) => {
    const db: Database = ctx.db ;
    const UsersCollection = db.collection<UserSchema>("UserCollection");
    return await UsersCollection.findOne({
      email: ctx.user.email,
    });
  },

  

};
  
export { Viaje };
