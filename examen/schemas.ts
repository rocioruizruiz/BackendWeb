import type { Context } from "https://deno.land/x/oak@v6.3.1/context.ts";

export interface ClientSchema {
  _id: { $oid: string };
  cif: string;
  name: string;
  address: string;
  phone?: number;
  email?: string;
}

export interface IClient {
  cif: string;
  name: string;
  address: string;
  phone?: number;
  email?: string;
}

export interface ProductSchema {
  _id: { $oid: string };
  sku: string;
  name: string;
  price?: number;
}

export interface IProduct {
  sku: string;
  name: string;
  price: number;
}

export interface FactureSchema {
  _id: { $oid: string };
  clientCIF: string;
  products: Ireg[];
}

export interface IFacture {
  clientCIF: string;
  products: Ireg[];
}

interface Ireg {
  sku: string;
  amount: number;
}

export type IContext = Context<Record<string, any>>;
