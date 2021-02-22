import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";

export interface IUser {
  email: string;
  password: string;
  token: string;
  rol: string;
}


export interface ICoche {
  matricula: string;
  tipo: string;
  conductor: string;
  disponibilidad: string;
}

export interface IViaje {
  conductor: string;
  cliente: string;
  coche: string;
}

export interface IContext {
  db: Database;
  user: IUser;
}

