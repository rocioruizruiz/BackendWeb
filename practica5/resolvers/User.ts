import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { PostSchema } from "../mongo/schema.ts";

interface IContext {
  db: Database;
}

interface IPost{
  name: string;
  email: string;
}

const User = {
  posts: async (
    parent: {  email:string },
    args: any,
    ctx: IContext
    ): Promise<IPost | null> => {
    const db: Database = ctx.db;
    const postCollection = db.collection<PostSchema>("PostCollection");
    const post: any = await postCollection.find({
            author: parent.email });
    console.log(parent.email, "    ", post.author);
    return post;
  },
};

export { User };
