import { MongoClient} from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import type { CharacterSchema, EpisodeSchema, LocationSchema, IData } from "../schemas.ts";


const url = {
  characters: "https://rickandmortyapi.com/api/character",
  episodes: "https://rickandmortyapi.com/api/episode",
  locations: "https://rickandmortyapi.com/api/location",
};



const fetchData = async (url: string):Promise<Array<{[key:string]: string | number | string[] | {[key:string]:string}}>> => {
  let response = await fetch(url);
  let data:IData = await response.json();
  const results = [...data.results];

  while(data.info.next){
    response = await fetch(data.info.next);
    data = await response.json();
    results.push(...data.results);
  }

  return results;
};



try{
  const dataPromises = [
    fetchData(url.characters),
    fetchData(url.episodes),
    fetchData(url.locations),
  ]; /* Cuando esto se ejecuta, como son asyncronas, tu pidess lals tres y cada unp va a lo suyo.
      *antes de recibir los datos ya esta en const data(en la siguiente linea). Estan los datos pedidos pero no los tengo
      *Pero en la linea siguiente lo que hago es esperar a que me lleguen todos los dataPromises. 
      *No hago el wait fetch dat, await fetch data .. etc. Porque así es mas rapido. 
      *Tu lo pides en mono hilo, la red lo hace en paralelo, y a ti te llega en monohilo.
    */
  const data = await Promise.all(dataPromises);
  //Aqui ya tengo todos los datos en 1 array

  const results = {   //esto es para dar nombre a data[0], etc. No consume tiempo porque son referencias. Estamos dando un alias.
    characters: data[0],
    episodes: data[1],
    locations: data[2],
  }

  const DB_URL = Deno.env.get("DB_URL");
  const DB_NAME = Deno.env.get("DB_NAME");

  if(!DB_URL || !DB_NAME){
    throw Error("Please define DB_URL and DB_NAME on .env file");
  }

const client = new MongoClient();
  
client.connectWithUri(DB_URL);
const db = client.database(DB_NAME);
const charactersCollection = db.collection<CharacterSchema>("CharactersCollection");
const episodesCollection = db.collection<EpisodeSchema>("EpisodesCollection");
const locationsCollection = db.collection<LocationSchema>("LocationsCollection");


  
  await Promise.all([ //esto tb es para no hacerlo monohilo. (si en js pero no cuando se cargan los datos)
    charactersCollection.deleteMany({}),
    episodesCollection.deleteMany({}),
    locationsCollection.deleteMany({}),
  ]);

  const charsToInsert = results.characters.map( (character) => {
    delete character["url"];
    delete character["created"];
    return {
      ...character,
      origin: Number((character.origin as {[key:string]:string}).url.split("/").slice(-1)[0]),
      location: Number((character.location as {[key:string]:string}).url.split("/").slice(-1)[0]),
      episode: (character.episode as string[]).map(ep => Number(ep.split("/").slice(-1)[0])),
    }

  });

  const episodesToInsert = results.episodes.map( (episode) => {
    delete episode["url"];
    delete episode["created"];

    return {
      ...episode,
      characters: (episode.characters as string[]).map(ch => Number(ch.split("/").slice(-1)[0])),
    }
  });

  const locationsToInsert = results.locations.map( (location) => {
    delete location["url"];
    delete location["created"];
    return {
      ...location,
      residents: (location.residents as string[]).map(res => Number(res.split("/").slice(-1)[0])),  //para quedarte con el numero final de la url (el id) 
      //slice(-1) coge el ultimo. Slice(2) coge del dos al final. Convierto array de string en array de numeros.
    }
  });

  await Promise.all([
    charactersCollection.insertMany(charsToInsert),
    episodesCollection.insertMany(episodesToInsert),
    locationsCollection.insertMany(locationsToInsert),
  ]);

  console.info("Yay!, done!");

  

}catch(e){
  console.error(e);
}

