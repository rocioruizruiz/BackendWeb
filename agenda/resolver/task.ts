import { ITask, TaskSchema } from "../types/types.ts"
import { Database } from "../config/deps.ts"
import type {IContext} from "../config/deps.ts"
export const resolvers = {
  Query: {
    getTask: async (
      parent: any,
      args: { _id: string },
      ctx: IContext,
      info: any
    ) => {
      const db: Database = ctx.state.db;
      const tasks = db.collection<TaskSchema>("TaskCollection");
      return await tasks.findOne({ _id: { $oid: args._id } });
    },
    getTaskByState: async (
      parent: any,
      args: { state: string },
      ctx: IContext,
      info: any
    ) => {
      const db: Database = ctx.state.db;
      const tasks = db.collection<TaskSchema>("TaskCollection");
      return await tasks.find({ state: args.state });
    },
    getTaskByDate: async (
      parent: any,
      args: { enddate: string },
      ctx: IContext,
      info: any
    ) => {
      const db: Database = ctx.state.db;
      const tasks = db.collection<TaskSchema>("TaskCollection");
      const pedido: string[] = args.enddate.split("-");
      const allTasks = await tasks.find({});
      return allTasks.filter((t) => filterByEndDate(t, pedido));
    },
    getTasks: async (parent: any, args: any, ctx: IContext, info: any) => {
      const db: Database = ctx.state.db;
      const tasks = db.collection<TaskSchema>("TaskCollection");
      return await tasks.find({}).limit(5);
    },
  },
  Mutation: {
    addTask: async (
      parent: any,
      args: {
        input: TaskSchema;
      },
      ctx: IContext,
      info: any
    ) => {
      const task: Partial<ITask> = args.input;
      const db: Database = ctx.state.db;
      const tasks = db.collection<TaskSchema>("TaskCollection");
      await tasks.insertOne({ ...args.input });
      return {
        done: true,
      };
    },
    removeTask: async (
      parent: any,
      args: { _id: string },
      ctx: IContext,
      info: any
    ) => {
      const db: Database = ctx.state.db;
      const tasks = db.collection<TaskSchema>("TaskCollection");
      await tasks.deleteOne({ _id: { $oid: args._id } });
      return {
        done: true,
      };
    },
    completeTask: async (
      parent: any,
      args: { _id: string },
      ctx: IContext,
      info: any
    ) => {
      const db: Database = ctx.state.db;
      const tasks = db.collection<TaskSchema>("TaskCollection");
      await tasks.updateOne(
        { _id: { $oid: args._id } },
        { $set: { state: "DONE" } }
      );
      return {
        done: true,
      };
    },
    updateTask: async (
      parent: any,
      args: { _id: string; input: TaskSchema },
      ctx: IContext,
      info: any
    ) => {
      const db: Database = ctx.state.db;
      const tasks = db.collection<TaskSchema>("TaskCollection");
      await tasks.updateOne(
        { _id: { $oid: args._id } },
        { $set: { ...args.input } }
      );
      return {
        done: true,
      };
    },
    startTask: async (
      parent: any,
      args: { _id: string },
      ctx: IContext,
      info: any
    ) => {
      const db: Database = ctx.state.db;
      const tasks = db.collection<TaskSchema>("TaskCollection");
      await tasks.updateOne(
        { _id: { $oid: args._id } },
        { $set: { state: "DOING" } }
      );
      return {
        done: true,
      };
    },
  },
};

const filterByEndDate = (t:TaskSchema, pedido:string[]) => {
  const fecha: string[] = t.enddate.split("-");
  return ((fecha[2] < pedido[2]) ||
    (fecha[2] == pedido[2] && fecha[1] < pedido[1]) ||
    (fecha[2] == pedido[2] && fecha[1] <= pedido[1] && fecha[0] <= pedido[0]));
}


