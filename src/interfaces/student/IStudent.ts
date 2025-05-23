import { IClass } from "../class/IClass";

export interface IStudent {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  church?: string;
  profilePicture?: string;
  classes?: IClass[];
}

