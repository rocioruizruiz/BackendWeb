import { gql } from "../config/deps.ts"


const types = gql`
  scalar ObjectID
  scalar Date
  type Task {
    _id: ObjectID
    nombre: String
    descripcion: String
    enddate: String
    state: String
  }

  input TaskInput {
    nombre: String!
    descripcion: String
    enddate: String
    state: String!
  }

  type ResolveType {
    done: Boolean
  }

  type Query {
    getTask(_id: ObjectID): Task
    getTaskByState(state: String): [Task!]
    getTasks: [Task!]
    getTaskByDate(enddate: Date): [Task!]
  }

  type Mutation {
    addTask(input: TaskInput!): ResolveType!
    removeTask(_id: ObjectID): ResolveType!
    completeTask(_id: ObjectID): ResolveType!
    updateTask(_id:ObjectID, input: TaskInput!): ResolveType!
    startTask(_id: ObjectID): ResolveType!
  }
`;

export {types}
