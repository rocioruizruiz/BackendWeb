import { gql } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

const Schema = gql`
  type User {
    email: String!
    password: String!
    assignee: [Task!]
    reporter: [Task!]
  }

  type Task {
    _id: String!
    name: String!
    description: String
    enddate: String!
    status: String!
    assignee: User!
    reporter: User!
  }

  input TaskInput {
    _id: String
    name: String!
    description: String
    enddate: String!
    status: String!
    assignee: String!
    reporter: String
  }

  input UserInput {
    _id: String
    email: String!
    password: String!
  }

  type Query {
    getTask(_id: String!): Task
    getTasks: [Task!]!
    getTaskByStatus(status: String!): [Task!]!

    getMyTasks: [Task!]!
    getMyOpenTasks: [Task!]!
    getUsers: [User!]
  }

  type Mutation {
    signUp(user: UserInput!): Boolean!
    addTask(task: TaskInput!): Boolean!
    removeTask(_id: String!): Boolean!
    updateTask(_id: String!, task: TaskInput!): Boolean!
    completeTask(_id: String!): Boolean!
    startTask(_id: String!): Boolean!

    signIn(user: UserInput!): Boolean!
    logOut(email: String!): Boolean!
    deleteAccount(email: String!): Boolean!
  }
`;

export { Schema };
