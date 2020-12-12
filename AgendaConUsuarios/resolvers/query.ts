import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";


import { TaskSchema, UserSchema, SessionSchema } from "../mongo/schema.ts";


interface IContext {
  db: Database;
}

interface ITask {
  id: string;
  name: string;
  description?: string;
  status: string;
  enddate: string;
  reporter: string;
  assignee: string;
}

const Query = {
  getTask: async (
    parent: any,
    args: { _id: string },
    ctx: IContext,
    info: any
  ) => {
    const db: Database = ctx.db;
    const tasks = db.collection<TaskSchema>("TaskCollection");
    return await tasks.findOne({ _id: { $oid: args._id } });
  },
  getTaskByStatus: async (
    parent: any,
    args: { status: string },
    ctx: IContext
  ) => {
    const db: Database = ctx.db;
    const tasks = db.collection<TaskSchema>("TaskCollection");
    console.log(args.status);
    return await tasks.find({ status: args.status });
  },

  getTasks: async (parent: any, args: any, ctx: IContext, info: any) => {
    const db: Database = ctx.db;
    const tasks = db.collection<TaskSchema>("TaskCollection");
    return await tasks.find({});
  },
  getMyTasks: async (parent: any, args: any, ctx: IContext, info: any) => {
    const db: Database = ctx.db;
    const tasks = db.collection<TaskSchema>("TaskCollection");
    const sessions = db.collection<SessionSchema>("SessionCollection");
    const users = db.collection<UserSchema>("UserCollection");
    const session = await sessions.findOne({});
    // si la session está activa
    if (session) {
      //el usuario logeado
      const usr = await users.findOne({ _id: { $oid: session.userid } });
      //los task cuyo assignee o reporter es el usuario logeado
      return await tasks.find({
        $or: [{ assignee: usr?.email }, { reporter: usr?.email }],
      });
    }
  },
  getMyOpenTasks: async (parent: any, args: any, ctx: IContext, info: any) => {
    const db: Database = ctx.db;
    const tasks = db.collection<TaskSchema>("TaskCollection");
    const sessions = db.collection<SessionSchema>("SessionCollection");
    const users = db.collection<UserSchema>("UserCollection");
    const session = await sessions.findOne({});
    // si la session está activa
    if (session) {
      //el usuario logeado
      const usr = await users.findOne({ _id: { $oid: session.userid } });
      //los task cuyo assignee o reporter es el usuario logeado
        return await tasks.find({
            $and: [{
                $or: [{ assignee: usr?.email }, { reporter: usr?.email }]
            }, {
                $or: [{ status: "DOING" }, { status: "TODO" }],
            }]
      });
    }
    },
  getUsers: async (
    parent: any,
    args: { _id: string },
    ctx: IContext,
    info: any
  ) => {
    const db: Database = ctx.db;
    const users = db.collection<UserSchema>("UserCollection");
    //console.log(user);
    return await users.find({});
  },
};

export { Query };

