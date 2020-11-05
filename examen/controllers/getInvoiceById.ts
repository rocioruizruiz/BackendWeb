import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
import { helpers } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { exists } from "https://deno.land/std@0.69.0/fs/exists.ts";
import { ClientSchema, FactureSchema, IContext, ProductSchema } from "../schemas.ts";

const getInvoiceById = async (ctx: IContext) => {
    try {
        const db: Database = ctx.state.db;
        const FactureCollection = db.collection<FactureSchema>("FactureCollection");
        const ClientCollection = db.collection<ClientSchema>("ClientCollection");
        const ProductCollection = db.collection<ProductSchema>("ProductCollection");

        const { clientCIF } = helpers.getQuery(ctx, { mergeParams: true });
        const invoice = await FactureCollection.findOne({ clientCIF: clientCIF });
        if (invoice) {
            //Devolver datos del cliente
            const client = await ClientCollection.findOne({ cif: clientCIF });
            if (client) { //sigue existiendo el cliente
                let clientData = { "client": { ...client } };
                if (invoice.products.length > 0) {
                    const totalData = invoice.products.map(async (p) => {
                        const product = await ProductCollection.findOne({ sku: p.sku });
                        if (product && product.price) {
                            const totalprice = product.price * p.amount;
                            delete product["price"];
                            let productData = {
                                "ProductList": { ...product, totalprice: totalprice, amount: p.amount }
                            }
                            return {
                                ...clientData, ...productData
                            };
                        }
                    });
                    ctx.response.status = 200;
                    ctx.response.body = totalData;
                }
                ctx.response.status = 400;
                ctx.response.body = "Sth Happened";
               
            } else {
                ctx.response.status = 404;
                ctx.response.body = "Client not longer exists";
            }




        }
    } catch (e) {
        ctx.response.status = 500;
        ctx.response.body = "Server Error";
    }
};

export {getInvoiceById}
