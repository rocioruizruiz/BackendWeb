export interface PostSchema{
  _id: { $oid: string },
  id: string,
  titulo: string,
  cuerpo: string,
  author: string,
  comments: IComment[];
}

export interface UserSchema{
  _id: { $oid: string },
  name: string,
  email: string,
  password: string,
  token: string,
  rol: string[],
}

interface IComment {
  author: string;
  texto: string;
}