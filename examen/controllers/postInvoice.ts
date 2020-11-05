import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
import { FactureSchema, ClientSchema, IContext } from "../schemas.ts";

const postInvoice = async (ctx: IContext) => {
    try {
        const db: Database = ctx.state.db;
        const FactureCollection = db.collection<FactureSchema>("FactureCollection");
        const ClientCollection = db.collection<ClientSchema>("ClientCollection");
        const { value: newFacture } = ctx.request.body({ type: "json" });
        const solicitud: Partial<FactureSchema> = await newFacture;
    
        if (!(solicitud.clientCIF && solicitud.products)) {
            ctx.response.status = 400;
            ctx.response.body = "Bad Request1";
            return;
        } else {
            const exists = await ClientCollection.findOne({ cif: solicitud.clientCIF })
            const validProducts = solicitud.products.filter(p => p.sku && p.amount);
            if (!exists || (validProducts.length != solicitud.products.length)) {
                ctx.response.status = 400;
                ctx.response.body = "Bad Request2";
                return;
            } else {
                ctx.response.status = 200;
                ctx.response.body = "OK but not added to DB :(";
                const obj_id = await FactureCollection.insertOne({ ...solicitud })
                if (obj_id) {
                    ctx.response.status = 202;
                    ctx.response.body = `Accepted with id:  ${obj_id.$oid}`;
                }
                return;
            }
        }
    } catch (e) {
        ctx.response.status = 500;
        ctx.response.body = "Server Error";
    }
};

export { postInvoice };
