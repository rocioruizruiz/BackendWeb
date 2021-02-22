import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";

export interface IPost {
  id: string;
  titulo: string;
  cuerpo: string;
  autor: string;
}


export interface IUser {
  name: string;
  email: string;
  token: string;
  rol: string[];
}

export interface IComment {
  texto: string;
  author: string;
}

export interface IContext {
  db: Database;
  user: IUser;
}

