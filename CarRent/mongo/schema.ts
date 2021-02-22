export interface CocheSchema {
  _id: { $oid: string };
  matricula: string;
  tipo: string;
  conductor: string;
  disponibilidad: string;
}

export interface UserSchema {
  _id: { $oid: string };
  email: string;
  password: string;
  token: string;
  rol: string;
}

export interface ViajeSchema {
  _id: { $oid: string };
  conductor: string;
  cliente: string;
  coche: string;  
}
