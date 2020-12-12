import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";


import { TaskSchema, UserSchema } from "../mongo/schema.ts";
import { ITask, IUser } from "./mutation.ts"
interface IContext {
  db: Database;
}



const User = {
  assignee: async (
    parent: { email: string },
    args: any,
    ctx: IContext
  ): Promise<IUser | null> => {
    //console.log(parent.email, "  |||  ", parent);
    const db: Database = ctx.db;
    const TasksCollection = db.collection<TaskSchema>("TaskCollection");
    const task: any = await TasksCollection.find({ assignee: parent.email });   
    console.log(parent.email, "|||||||||!", task);
    return task;
  },

  reporter: async (
    parent: { email: string },
    args: any,
    ctx: IContext
  ): Promise<IUser | null> => {
    const db: Database = ctx.db;
    const TaskCollection = db.collection<TaskSchema>("TaskCollection");
    const task: any = await TaskCollection.find({ reporter: parent.email });
    console.log(parent.email, "|||||||||!", task);
    return task;
  },
};

export { User };
