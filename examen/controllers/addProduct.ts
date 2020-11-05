import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
import { ProductSchema, IContext } from "../schemas.ts";

const addProduct = async (ctx: IContext) => {
  try {
    const db: Database = ctx.state.db;
    const ProductCollection = db.collection<ProductSchema>("ProductCollection");
    const { value: newProduct } = ctx.request.body({ type: "json" });
    const solicitud: Partial<ProductSchema> = await newProduct;
    const exists = await ProductCollection.findOne({ sku: solicitud.sku });
    if (exists) {
      ctx.response.status = 400;
      ctx.response.body = "Bad Request";
      return;
    } else if (!(solicitud.sku && solicitud.name && solicitud.price) || solicitud.price < 0) {
      ctx.response.status = 400;
      ctx.response.body = "Bad Request";
      return;
    } else {
      ProductCollection.insertOne({ ...solicitud });
      ctx.response.status = 200;
      ctx.response.body = "OK";
      return;
    }
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = "Server Error";
  }
};

export { addProduct };
