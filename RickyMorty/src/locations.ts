import type{ LocationSchema} from "../schemas.ts"
import { locations } from "../db/mongo.ts"

const home = (ctx:any) => {
    ctx.response.body =
      "Hello to Rick & Morty REST API\nGET: '/locations' returns all locations in database \n ";
};

const getLocations = async (ctx:any) => {
  try{
    const data: LocationSchema[] = await locations.find({});
    ctx.response.body = {
      success: true,
      data: data
    }
  }catch(e){
    ctx.response.body = {
      success: false
    }
    console.log("ERRRRRROR: ", e);
  }
    
};

const getLocationById = async (context: any) => {
  try{
    let id: string = context.params.id;
    const location:LocationSchema | null = await locations.findOne({id: Number(id)});

    if (location) {
      context.response.body = {
        success: true,
        data: location,
      };
    } else {
      context.response.status = 404;
      context.response.body = {
        success: false,
        data: "No location found for given ID",
      };
    }
  }catch(e) {
    context.response.body = null;
    context.response.status = 500
    console.log(e);
  }
};

export { getLocations, getLocationById }

