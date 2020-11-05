import { Router } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import {addClient} from "./controllers/addClient.ts"
import { addProduct } from "./controllers/addProduct.ts";
import { getInvoiceById } from "./controllers/getInvoiceById.ts";
import { postInvoice } from "./controllers/postInvoice.ts";

const router = new Router();

const status = (ctx: any) => {
  try {
    ctx.response.status = 200;
    ctx.response.body = "OK";
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = "Server Error";
  }
};

router.get("/status", status)
  .get("/invoice/:ID", getInvoiceById);

router.post("/client", addClient)
  .post("/product", addProduct)
  .post("/invoice", postInvoice);
export { router as default };
