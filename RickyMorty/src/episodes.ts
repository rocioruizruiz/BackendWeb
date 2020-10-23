import type{ EpisodeSchema} from "../schemas.ts"
import { episodes } from "../db/mongo.ts"


const home = (ctx:any) => {
    ctx.response.body =
      "Hello to Rick & Morty REST API\nGET: '/episodes' returns all episodes in database \n ";
};

const getEpisodes = async (ctx:any) => {
  try{
    const data: EpisodeSchema[] = await episodes.find({});
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

const getEpisodeById = async (context: any) => {
  try{
    let id: string = context.params.id;
    const episode:EpisodeSchema | null = await episodes.findOne({id: Number(id)});

    if (episode) {
      context.response.body = {
        success: true,
        data: episode,
      };
    } else {
      context.response.status = 404;
      context.response.body = {
        success: false,
        data: "No episode found for given ID",
      };
    }
  }catch(e) {
    context.response.body = null;
    context.response.status = 500
    console.log(e);
  }
};

const deleteEpisodeById = async (context: any) => {
    let id: string = context.params.id;
    const episode = await episodes.deleteOne({id: Number(id)});
  
    if (episode === 1) {
      context.response.body = {
        success: true,
        data: "episode Deleted",
      };
    } else {
      context.response.body = {
        success: false,
        data: "No episode found for given ID",};
   }
};

const addEpisode = async (context: any) => {
    console.log("post episode");
    if (!context.request.hasBody) {
        context.response.status = 404;
        context.response.body = {
          success: false,
          data: "Couldn´t add episode",
        };
    }
    const body = context.request.body();
    let char: Partial<EpisodeSchema> | undefined;
    if (body.type === "json") {
      char = await body.value;
    }
    if (char) {
      const object_id = await episodes.insertOne(char);
      console.log(object_id);
      context.response.status = 200;
      context.response.body = char;
      context.response.type = "json";
      return
    }
    context.response.status = 400;
};

export { getEpisodes, getEpisodeById, deleteEpisodeById, addEpisode }

