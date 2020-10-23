import type{ CharacterSchema} from "../schemas.ts"
import { characters } from "../db/mongo.ts"


const getCharacters = async (ctx:any) => {
  try{
    const data: CharacterSchema[] = await characters.find({});
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

const getCharacterById = async (context: any) => {
  try{
    let id: string = context.params.id;
    const character:CharacterSchema | null = await characters.findOne({id: Number(id)});

    if (character) {
      context.response.body = {
        success: true,
        data: character,
      };
    } else {
      context.response.status = 404;
      context.response.body = {
        success: false,
        data: "No character found for given ID",
      };
    }
  }catch(e) {
    context.response.body = null;
    context.response.status = 500
    console.log(e);
  }
};


export {getCharacters, getCharacterById }