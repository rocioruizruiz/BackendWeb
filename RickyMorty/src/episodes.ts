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



export { getEpisodes, getEpisodeById }

