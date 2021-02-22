import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

import { UserSchema, PostSchema} from "../mongo/schema.ts";
import { IContext, IUser, IPost, IComment } from "../types.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { spliceOne } from "https://deno.land/std@0.71.0/node/_utils.ts";
interface ICreatePostArgs {
  post: {
    id: string;
    titulo: string;
    cuerpo: string;
  }
}

interface IDeletePostArgs {
  id: string
  author?: string
}

interface ICreateUserArgs{
    email: string,
    name: string,
    rol: string[]
}

interface IDeleteUserArgs {
  email: string;
  rol: string[];
}

const Mutation = {
  createPost: async (
    parent: any,
    args: ICreatePostArgs,
    ctx: IContext
  ): Promise<boolean> => {
    try {
      const db: Database = ctx.db;
      const postsCollection: Collection<PostSchema> = db.collection<PostSchema>(
        "PostCollection"
      );
      const usersCollection: Collection<UserSchema> = db.collection<UserSchema>(
        "UserCollection"
      );

      console.log(`id: ${args.post.id}`); /*********************************+*/
      const found = await postsCollection.findOne({ id: args.post.id });
      if (found) throw new GQLError("post with id already in DB");

      const post = { ...args.post, author: ctx.user.email };
      await postsCollection.insertOne(post);
      

      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },
  createUser: async (
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
      await UsersCollection.insertOne({ ...args });
      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },

  deletePost: async (
    parent: any,
    args: IDeletePostArgs,
    ctx: IContext
  ): Promise<boolean> => {
    try {
      const db: Database = ctx.db;
      const postsCollection: Collection<PostSchema> = db.collection<PostSchema>(
        "PostCollection"
      );
      if (ctx.user.rol.includes("EDITOR")) {
        await postsCollection.deleteOne({ id: args.id });
        return true;
      }
      const post = await postsCollection.findOne({ id: args.id });
      if (post?.author == ctx.user.email) {
        await postsCollection.deleteOne({ id: args.id });
        return true;
      }
      return false;
    } catch (e) {
      throw new GQLError(e);
    }
  },
  addComment: async (
    parent: any,
    args: {
      id: string;
      texto: string;
    },
    ctx: IContext
  ): Promise<boolean> => {
    try {
      const db: Database = ctx.db;
      const postsCollection:
        | Collection<PostSchema>
        | any = db.collection<PostSchema>("PostCollection");
      const comment = { texto:args.texto, author:ctx.user.email };
      console.log(args);

      await postsCollection.updateOne(
        { id: args.id },
        { $push: { comments: comment } }
      );
      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },
  deleteComment: async (
    parent: any,
    args: Partial<IDeletePostArgs>,
    ctx: IContext
  ): Promise<boolean> => {
    try {
      const db: Database = ctx.db;
      const postsCollection: Collection<PostSchema> | any = db.collection<PostSchema>(
        "PostCollection"
      );
      if (ctx.user.rol.includes("EDITOR")) {
        if (args.author) {
          await postsCollection.updateMany(
            { id: args.id },
            { $pull: { comments: { author: args.author } } }
          );
        
          return true;
        }
      }

      if (ctx.user.rol.includes("USER")) {
        await postsCollection.updateMany(
          { id: args.id },
          { $pull: { comments: { author: ctx.user.email } } }
        );
        return true;
      }
      //}
      return false;
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

  deleteUser: async (
    parent: any,
    args: IDeleteUserArgs,
    ctx: IContext
  ): Promise<boolean> => {
    try {
      const exists = await ctx.db
        .collection<UserSchema>("UserCollection")
        .findOne({ email: args.email, rol: args.rol });
      if (exists) {
        await ctx.db
          .collection<UserSchema>("UserCollection")
          .deleteOne({ email: args.email, rol: args.rol });
        await ctx.db
          .collection<PostSchema>("PostCollection")
          .deleteMany({ author: args.email });
        return true;
      } else {
        throw new GQLError("Unexpected error");
      }
    } catch (e) {
      throw new GQLError(e);
    }
  },
};

export { Mutation }