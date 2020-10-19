import { MongoClient } from "https://deno.land/x/mongo@v0.12.1/mod.ts";

const client = new MongoClient;
client.connectWithUri("mongodb+srv://<db_url>");
const db = client.database("RickyMorty"); // si no existe la crea;
const episodes = db.collection<EpisodeSchema>("Episodes");
const characters = db.collection<CharacterSchema>("Characters");
let del = await episodes.deleteMany({});
del = await characters.deleteMany({});



interface IInfo {
    next?: string;
}

interface IDataE {
    info: IInfo;
    results: EpisodeSchema[];
}
interface IDataC {
    info: IInfo;
    results: CharacterSchema[];
}

interface EpisodeSchema {
    id: {$oid: string};
    name: string;
    air_date: string;
    episode: string;
    characters: string[];
    url: string;
    created: string;
}
interface INameUrl{
    name: string;
    url: string;
}

interface CharacterSchema{
    id: {$oid: string};
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    origin: INameUrl;
    location: INameUrl
    image: string;
    episode: string[];
    url: string;
    created: string;
}


// EPISODES
let url = "https://rickandmortyapi.com/api/episode/";
let response = await fetch(url);
let data: IDataE = await response.json();

data.results.forEach(ep => {
    episodes.insertOne(ep);
})

console.log(`Added ${data.results.length} episodes`);

while (data.info.next) {
    response = await fetch(data.info.next);
    data = await response.json();
    data.results.forEach(ep => {
        episodes.insertOne(ep);
    })
    //episodes.insert(...data.results);
    console.log(`Added ${data.results.length} episodes`);
}


//CHARACTERS
url = "https://rickandmortyapi.com/api/character/";
response = await fetch(url);
let dataC: IDataC = await response.json();

dataC.results.forEach(ch => {
    characters.insertOne(ch);
})

console.log(`Added ${dataC.results.length} characters`);

while (dataC.info.next) {
    response = await fetch(dataC.info.next);
    dataC = await response.json();
    dataC.results.forEach(ch => {
        characters.insertOne(ch);
    })
    //episodes.insert(...data.results);
    console.log(`Added ${dataC.results.length} characters`);
}


