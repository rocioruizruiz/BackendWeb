import type{ CharacterSchema, EpisodeSchema} from "../schemas.ts"
import { characters, episodes } from "../db/mongo.ts"
import { ObjectId } from "https://deno.land/x/mongo@v0.12.1/ts/types.ts";

const getCharacters = async (ctx:any) => {
  try{
    const data: CharacterSchema[] = await characters.find({});
    ctx.response.body = data;
    ctx.response.status = 200;
  }catch(e){
    ctx.response.body = {
      success: false
    }
    ctx.response.status = 404;
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
      context.status = 200;
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



const updateCharacterById = async (context: any) => {

  const id :string = context.params.id;
  let s:any = await characters.findOne({"id": Number(id)});
  if(s.status){
    if(s.status == "Alive"){
      s.status = "Dead";
    }else{
      s.status = "Alive";
    }
  }
  let char: Partial<CharacterSchema> | undefined; 

 
  const {matchedCount} = await characters.updateOne(
    {id: Number(id)},
    {$set: {status: s.status}}
  );
  s = await characters.findOne({"id": Number(id)});
  const form: Array<{[key:string]: string | number | string[] | {[key:string]:string}}> = 
  [ {"id": s.id}, {"name": s.name}, {"status": s.status}, {"type": s.type}, {"gender": s.gender}, {"origin":s.origin}, {"location":s.location}, {"image": s.image}, {"episode":s.episode} ];
  if (matchedCount) {
    context.response.body = {
      data: form,
    };
    context.response.status = 200;
    return;
  }else {
      context.response.body = {
        success: false,
        data: "No character found for given ID",
      }
      context.response.status = 404;
    }
    context.response.status = 500;
}



const deleteCharacterById = async (context: any) => {
  let id: string = context.params.id;
  const character = await characters.deleteOne({id: Number(id)});

  if (character === 1) {
    context.response.body = {
      data: "OK",
    };
    context.response.status = 200;
  } else {
    context.response.body = {
      data: "Not Found",
    };
    context.status = 404;
  }
};



export {getCharacters, getCharacterById, updateCharacterById, deleteCharacterById}

