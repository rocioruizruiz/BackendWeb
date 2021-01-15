import {
  Database
} from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import {
  GQLError,
} from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

 import { UserSchema, PostSchema } from "../mongo/schema.ts";

 import { IContext } from "../types.ts";






 const Query = {

  getPosts: async (parent: any, args: any, ctx: IContext) => {
    try {
      const db: Database = ctx.db;
      const postsCollection = db.collection<PostSchema>("PostCollection");
      const posts= await postsCollection.find({});
      return posts;
    } catch (e) {
      throw new GQLError(e);
    }
  },



   getUsers: async (parent: any, args: any, ctx: IContext) => {
     try {
       const db: Database = ctx.db;
       const users = await db.collection<UserSchema>("UserCollection").find();
       return users;
     } catch (e) {
       throw new GQLError(e);
     }
   },
 };

 export {Query}