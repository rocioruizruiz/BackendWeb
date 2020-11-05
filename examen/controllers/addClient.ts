import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
import { ClientSchema, IContext } from "../schemas.ts";

const addClient = async (ctx: IContext) => {
  try {
    const db: Database = ctx.state.db;
    const ClientCollection = db.collection<ClientSchema>("ClientCollection");
    const {value: newClient} = ctx.request.body({type: "json"});
    const solicitud: Partial<ClientSchema> = await newClient;
    const exists = await ClientCollection.findOne({cif: solicitud.cif})
      if (exists) {
          ctx.response.status = 400;
          ctx.response.body = "Bad Request";
          return;
      }else if (!(solicitud.cif && solicitud.name && solicitud.address)){
          ctx.response.status = 400;
          ctx.response.body = "Bad Request";
          return;
      } else {
          ClientCollection.insertOne({...solicitud})
          ctx.response.status = 200;
          ctx.response.body = "OK";
          return;
      }
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = 'Server Error';
  }
}; 

export { addClient };