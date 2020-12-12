import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { UserSchema } from "../mongo/schema.ts";

interface IContext {
  db: Database;
}

interface IUser {
  name: string;
  email: string;
}

const Task = {
  assignee: async (
    parent: { assignee: string },
    args: any,
    ctx: IContext
  ): Promise<IUser | null> => {
    const db: Database = ctx.db;
    const UsersCollection = db.collection<UserSchema>("UserCollection");
    const user: any = await UsersCollection.findOne({ email: parent.assignee });
    console.log(parent.assignee, "    ", user.email);
    return user;
  },

  reporter: async (
    parent: { reporter: string },
    args: any,
    ctx: IContext
  ): Promise<IUser | null> => {
    const db: Database = ctx.db;
    const UsersCollection = db.collection<UserSchema>("UserCollection");
    const user: any = await UsersCollection.findOne({ email: parent.reporter });
    return user;
  },
};

export { Task };
