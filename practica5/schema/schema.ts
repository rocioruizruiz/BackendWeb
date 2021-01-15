import { gql } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

// interface IRol = {
//   rol: "ADMIN" || "AUTHOR" || "EDITOR" || "USER"
// }

const Schema = gql`
  type Post {
    id: String!
    titulo: String!
    cuerpo: String!
    author: User!
    comments: [String!]!
  }

  type User {
    name: String!
    email: String!
    token: String
    rol: [String!]!
  }

  

  input PostInput {
    id: String!
    titulo: String!
    cuerpo: String!
  }

  input CommentInput {
    id: String!
    texto: String!
  }

  type Query {
    getPosts: [Post!]!
    getUsers: [User!]!
  }

  type Mutation {
    addUser(name: String!, email: String!): Boolean!
    createPost(post: PostInput!): Boolean!
    deletePost(id: String!): Boolean!
    addComment(id: String!, texto: String!): Boolean!
    deleteComment(id: String! author: String): Boolean!
    # startTask(id: String!): Boolean!
    createUser(
      email: String!
      name: String
      password: String!
      rol: [String!]!
    ): Boolean!
    login(email: String!, password: String!): String!
    logout: Boolean!
    deleteUser(email: String!, rol: [String!]!): Boolean!
  }
`;

export { Schema };
