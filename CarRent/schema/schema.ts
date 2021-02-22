import { gql } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";


const Schema = gql`
  type Coche {
    matricula: String!
    tipo: String!
    conductor: Conductor!
    disponibilidad: String!
    viajes: [Viaje!]
  }

  type Cliente {
    email: String!
    password: String!
    token: String
    rol: String!
    viajes: [Viaje!]
  }

  type Conductor {
    email: String!
    password: String!
    token: String
    rol: String!
    viajes: [Viaje!]
    coche: Coche!
  }

  type Viaje {
    conductor: Conductor!
    cliente: Cliente!
    coche: Coche!
  }


  type Query {
    getCoches: [Coche!]!
    getClientes: [Cliente!]!
    getConductores: [Conductor!]!
    getViajes: [Viaje!]!
  }

  type Mutation {
    registroUsuario(email: String!, password: String!, rol: String!): Boolean!
    login(email: String!, password: String!): String!
    logout: Boolean!

    registrarCoche(matricula: String!, tipo: String!, disponibilidad: String!): Boolean!
    solicitarCoche(tipo:String!): Viaje!
    cambiarDisponibilidadCoche(disponibilidad: String!): Boolean!

  }
`;

export { Schema };
