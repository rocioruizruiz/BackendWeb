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

const deleteLocationById = async (context: any) => {
    let id: string = context.params.id;
    const location = await locations.deleteOne({id: Number(id)});
  
    if (location === 1) {
      context.response.body = {
        success: true,
        data: "location Deleted",
      };
    } else {
      context.response.body = {
        success: false,
        data: "No location found for given ID",
      };
    }
};

const addLocation = async (context: any) => {
    console.log("post location");
    if (!context.request.hasBody) {
        context.response.body = {
            success: false,
            data: "Couldn't add location",
          };
    }
    const body = context.request.body();
    let char: Partial<LocationSchema> | undefined;
    if (body.type === "json") {
        char = await body.value;
    }
    if (char) {
        const object_id = await locations.insertOne(char);
        console.log(object_id);
        context.response.status = 200;
        context.response.body = char;
        context.response.type = "json";
        return;
    } 
    context.response.status = 400;
};

export { getLocations, getLocationById, deleteLocationById, addLocation }

