import {
  Database
} from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import {
  GQLError,
} from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

 import { UserSchema, CocheSchema, ViajeSchema } from "../mongo/schema.ts";

 import { IContext } from "../types.ts";


 const Query = {
   getCoches: async (parent: any, args: any, ctx: IContext) => {
     try {
       const db: Database = ctx.db;
       const cochesCollection = db.collection<CocheSchema>("CocheCollection");
       const coches = await cochesCollection.find({});
       return coches;
     } catch (e) {
       throw new GQLError(e);
     }
   },

   getClientes: async (parent: any, args: any, ctx: IContext) => {
     try {
       const db: Database = ctx.db;
       const clientes = await db
         .collection<UserSchema>("UserCollection")
         .find({ rol: "Cliente" });
       return clientes;
     } catch (e) {
       throw new GQLError(e);
     }
   },

   getConductores: async (parent: any, args: any, ctx: IContext) => {
     try {
       const db: Database = ctx.db;
       const conductores = await db
         .collection<UserSchema>("UserCollection")
         .find({ rol: "Conductor" });
       return conductores;
     } catch (e) {
       throw new GQLError(e);
     }
   },

   getViajes: async (parent: any, args: any, ctx: IContext) => {
     try {
       const db: Database = ctx.db;
       const viajes = await db
         .collection<ViajeSchema>("ViajeCollection")
         .find({});
       return viajes;
     } catch (e) {
       throw new GQLError(e);
     }
   },
 };

 export {Query}