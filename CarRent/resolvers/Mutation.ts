import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

import { UserSchema, CocheSchema, ViajeSchema} from "../mongo/schema.ts";
import { IContext, IViaje } from "../types.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

interface ICreateCarArgs {
    matricula: string;
    tipo: string;
    conductor: string;
    disponibilidad: string;
}


interface ICreateUserArgs {
  email: string;
  password: string;
  rol: string;
}


const Mutation = {
  registroUsuario: async (
    parent: any,
    args: ICreateUserArgs,
    ctx: IContext
  ): Promise<boolean> => {
    try {
      const db: Database = ctx.db;
      const UsersCollection: Collection<UserSchema> = db.collection<UserSchema>(
        "UserCollection"
      );

      const found = await UsersCollection.findOne({ email: args.email });
      if (found) throw new GQLError("user with email already in DB");
      if (
        args.rol === "Cliente" ||
        args.rol === "Conductor" ||
        args.rol === "Administrador"
      ) {
        await UsersCollection.insertOne({ ...args });
        return true;
      }
      return false;
    } catch (e) {
      throw new GQLError(e);
    }
  },

  registrarCoche: async (
    parent: any,
    args: ICreateCarArgs,
    ctx: IContext
  ): Promise<boolean> => {
    try {
      const db: Database = ctx.db;
      const cochesCollection: Collection<CocheSchema> = db.collection<CocheSchema>(
        "CocheCollection"
      );
      const found = await cochesCollection.findOne({
        matricula: args.matricula,
      });
      if (found) throw new GQLError("car with id already in DB");
      const driver = await cochesCollection.findOne({conductor: ctx.user.email});
      if(driver) throw new GQLError("driver already has an assigned car");

      await cochesCollection.insertOne({ ...args, conductor: ctx.user.email });
      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },

  login: async (
    parent: any,
    args: { email: string; password: string },
    ctx: IContext
  ): Promise<string> => {
    try {
      const exists = await ctx.db
        .collection<UserSchema>("UserCollection")
        .findOne({ email: args.email, password: args.password });
      if (exists) {
        const token = v4.generate();
        await ctx.db
          .collection<UserSchema>("UserCollection")
          .updateOne({ email: args.email }, { $set: { token } });
        setTimeout(() => {
          ctx.db
            .collection<UserSchema>("UserCollection")
            .updateOne({ email: args.email }, { $set: { token: "" } });
        }, 60 * 60 * 1000);
        return token;
      } else {
        throw new GQLError("User and password do not match");
      }
    } catch (e) {
      throw new GQLError(e);
    }
  },

  logout: async (parent: any, args: {}, ctx: IContext): Promise<boolean> => {
    try {
      const exists = await ctx.db
        .collection<UserSchema>("UserCollection")
        .findOne({ email: ctx.user.email, token: ctx.user.token });
      if (exists) {
        await ctx.db
          .collection<UserSchema>("UserCollection")
          .updateOne({ email: ctx.user.email }, { $set: { token: "" } });
        return true;
      } else {
        throw new GQLError("Unexpected error");
      }
    } catch (e) {
      throw new GQLError(e);
    }
  },

  cambiarDisponibilidadCoche: async (
    parent: any,
    args: { disponibilidad: string },
    ctx: IContext
  ): Promise<boolean> => {
    try {
      const db: Database = ctx.db;
      const cochesCollection: Collection<CocheSchema> = db.collection<CocheSchema>(
        "CocheCollection"
      );
      await cochesCollection.updateOne(
        { conductor: ctx.user.email },
        { $set: { disponibilidad: args.disponibilidad } }
      );
      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },


  solicitarCoche: async (
    parent: any,
    args: {
      tipo: string;
    },
    ctx: IContext
  ) => {
    try {
      const db: Database = ctx.db;
      const cochesCollection: Collection<CocheSchema> = db.collection<CocheSchema>("CocheCollection");
      const viajesCollection: Collection<ViajeSchema> = db.collection<ViajeSchema>("ViajeCollection");

      const coche = await cochesCollection.findOne({ disponibilidad: "Disponible", tipo: args.tipo });
      if (coche) {
        await cochesCollection.updateOne({ matricula: coche.matricula }, { $set: { disponibilidad: "No disponible" } });
        const viaje = await viajesCollection.insertOne({ conductor: coche.conductor, cliente: ctx.user.email, coche: coche.matricula });
        return viaje;
      } else {
        throw new GQLError("Not available cars");
      }
      
    } catch (e) {
      throw new GQLError(e);
    }
  },
};

export { Mutation }