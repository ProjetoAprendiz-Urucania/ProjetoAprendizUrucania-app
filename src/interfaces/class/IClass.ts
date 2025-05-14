import { ILesson } from "../lesson/ILesson";

export interface IClass {
  id: string;
  name: string;
  teachers: string;
  coverImage: string;
  lessons: ILesson[]
}

export interface ICreateClass {
  name: string;
  teachers: string;
  coverImage?: string;
}

export interface IUpdateClass{
  name?: string;
  teacherInfo?: string;
  teachers?: string;
  coverImage?: string;
}
