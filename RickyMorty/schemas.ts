// Defining schema interface
export interface CharacterSchema {
    _id: { $oid: string };
    id: number,
    name:string,
    status: string,
    species: string,
    type: string,
    gender: string,
    origin: number,
    location: number,
    image: string,
    episode: number[],
}

  
export interface LocationSchema {
    _id: { $oid: string };
    id: number;
    name: string;
    type: string;
    dimension: string;
    residents: number[];
}
  
export interface EpisodeSchema {
  _id: { $oid: string };
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: number[];
}
  
export interface IData {
  info: {
    next?: string;
  }
  results: Array<{[key:string]: string | number | string[] | {[key:string]:string}}>
}