import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { UserSchema } from "../mongo/schema.ts";

interface IContext {
  db: Database;
}

interface IUser {
  name: string;
  email: string;
}

const Post= {
  author: async (
    parent: { author: string },
    args: any,
    ctx: IContext
  ): Promise<IUser | null> => {
    const db: Database = ctx.db;
    const UsersCollection = db.collection<UserSchema>("UserCollection");
      const user: any = await UsersCollection.findOne({ email: parent.author });
      console.log(parent.author, "    ", user.email);
    return user;
  },

};
  
export { Post };
