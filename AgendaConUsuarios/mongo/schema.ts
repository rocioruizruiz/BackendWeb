export interface TaskSchema {
  _id: { $oid: string };
  name: string;
  description?: string;
  enddate: string;
  status: string;
  reporter: string;
  assignee: string;
}

export interface UserSchema {
  _id: { $oid: string };
  email: string;
  password: string;
}

export interface SessionSchema {
  _id: { $oid: string };
  userid: string;
  token: string;
}
