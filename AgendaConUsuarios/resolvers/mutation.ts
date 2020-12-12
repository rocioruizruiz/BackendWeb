import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

import { TaskSchema, UserSchema, SessionSchema } from "../mongo/schema.ts";


export interface IContext {
    db: Database;

}

export interface ITask {
  id: string;
  name: string;
  description?: string;
  status: string;
  enddate: string;
  reporter: string;
  assignee: string;
}
export interface IUser {
  id: string;
  email: string;
  password: string;
}
interface ISession {
    id: string;
    token: string;
    userid: string;
}

const Mutation = {
  addTask: async (parent: any, args: { task: TaskSchema }, ctx:IContext) => {
    const db: Database = ctx.db;
    const tasks = db.collection<TaskSchema>("TaskCollection");
    const sessions = db.collection<SessionSchema>("SessionCollection");
    const users = db.collection<UserSchema>("UserCollection");
    const session = await sessions.findOne({});  
    if (session) {
        const usr = await users.findOne({ _id: { $oid: session.userid } });
        await tasks.insertOne({ ...args.task, reporter: usr?.email });
    }
    
    return true;
    
  },
    removeTask: async (parent: any, args: { _id: string }, ctx: IContext) => {
        const db: Database = ctx.db;
        const tasks = db.collection<TaskSchema>("TaskCollection");
        const sessions = db.collection<SessionSchema>("SessionCollection");
        const users = db.collection<UserSchema>("UserCollection");
        const session = await sessions.findOne({});     
        if (session) {
            const usr = await users.findOne({ _id: { $oid: session.userid } });
            const task = await tasks.findOne({ _id: { $oid: args._id } });
            if (task && task.reporter === usr?.email) {
                await tasks.deleteOne({ _id: { $oid: task._id.$oid } });
                return true;
            }
        } return false; 
  },
    completeTask: async (parent: any, args: { _id: string }, ctx: IContext) => { 
        const db: Database = ctx.db;
        const tasks = db.collection<TaskSchema>("TaskCollection");
        const sessions = db.collection<SessionSchema>("SessionCollection");
        const users = db.collection<UserSchema>("UserCollection");
        const session = await sessions.findOne({});  
        // si la sessio está activa
        if (session) {
            const usr = await users.findOne({ _id: { $oid: session.userid } });
            const task = await tasks.findOne({ _id: { $oid: args._id } });
            console.log(usr, "     ", task);
            //si el usuario es  el assignee
            if (task && (task.assignee === usr?.email)) {
                await tasks.updateOne(
                    { _id: { $oid: args._id } },
                    { $set: { status: "DONE" } }
                );
                return true;
            }
        }
        return false;
  },
  updateTask: async (
    parent: any,
    args: { _id: string, task: TaskSchema },
    ctx: IContext
  ) => {
    const db: Database = ctx.db;
      const tasks = db.collection<TaskSchema>("TaskCollection");
      const sessions = db.collection<SessionSchema>("SessionCollection");
        const users = db.collection<UserSchema>("UserCollection");
        const session = await sessions.findOne({});  
        // si la sessio está activa
      if (session) {
          const usr = await users.findOne({ _id: { $oid: session.userid } });
          const task = await tasks.findOne({ _id: { $oid: args._id } });
          //si el usuario es el reporter o el assignee
          if (task && (task.reporter === usr?.email || task.assignee === usr?.email)) {
              await tasks.updateOne(
                  { _id: { $oid: args._id } },
                  { $set: { ...args.task } }
              );
              return true;
          }
      }
      return false;
  },
  startTask: async (parent: any, args: { _id: string }, ctx: IContext) => {
    const db: Database = ctx.db;
      const tasks = db.collection<TaskSchema>("TaskCollection");
      const sessions = db.collection<SessionSchema>("SessionCollection");
        const users = db.collection<UserSchema>("UserCollection");
        const session = await sessions.findOne({});  
        // si la sessio está activa
      if (session) {
          const usr = await users.findOne({ _id: { $oid: session.userid } });
          const task = await tasks.findOne({ _id: { $oid: args._id } });
          //si el usuario es  el assignee
          if (task && (task.assignee === usr?.email)) {
              await tasks.updateOne(
                  { _id: { $oid: args._id } },
                  { $set: { status: "DOING" } }
              );
              return true;
          }
      }
      return false;
  },

  /********************** NEW ************************/

  signUp: async (parent: any, args: { user: UserSchema }, ctx: IContext) => {
    try {
      const db: Database = ctx.db;
      const users = db.collection<UserSchema>("UserCollection");
      if (await users.findOne({ email: args.user.email }))throw new GQLError("User Already Exists");
      await users.insertOne({ ...args.user });
      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },

  signIn: async (parent: any, args: { user: UserSchema }, ctx: IContext) => {
    try {
      const db: Database = ctx.db;
      const users = db.collection<UserSchema>("UserCollection");
      const exists = await users.findOne({ ...args.user });
        if (exists) {
            console.log(exists);
            const sessions = db.collection<SessionSchema>("SessionCollection");
            const id = await sessions.insertOne({
                token: "mytoken",
                userid: exists._id.$oid,
            });
            console.log(id);
        setTimeout(
          async () => await sessions.deleteOne({ _id: { $oid: id.$oid } }),
          20000
        );
        return true;
      }
      return false;
    } catch (e) {
      throw new GQLError(e);
    }
  },
  logOut: async (parent: any, args: { email: string }, ctx: IContext) => {
    try {
      const db: Database = ctx.db;
      const users = db.collection<UserSchema>("UserCollection");
      const sessions = db.collection<SessionSchema>("SessionCollection");
      const exists = await users.findOne({ email: args.email });
      if (exists && (await sessions.findOne({ userid: exists._id.$oid }))) {
        await sessions.deleteOne({ userid: exists._id.$oid });
        return true;
      }
      return false;
    } catch (e) {
      throw new GQLError(e);
    }
  },
  deleteAccount: async (
    parent: any,
    args: { email: string },
    ctx: IContext
  ) => {
    const db: Database = ctx.db;
    const users = db.collection<UserSchema>("UserCollection");
    const sessions = db.collection<SessionSchema>("SessionCollection");
    const exists = await users.findOne({ email: args.email });
    if (exists && (await sessions.findOne({ userid: exists._id.$oid }))) {
      await users.deleteOne({ _id: exists._id });
      return true;
    }
    return false;
  },
};




export { Mutation }
