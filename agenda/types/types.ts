
export interface TaskSchema {
  _id: { $oid: string };
  nombre: string;
  descripcion: string;
  enddate: string;
  state: string;
}

export interface ITask {
  nombre: string;
  descripcion: string;
  enddate: string;
  state: string;
}