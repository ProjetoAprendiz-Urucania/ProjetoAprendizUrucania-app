import { ILesson } from "../lesson/ILesson";
import { ITheoryMaterial } from "../TheoryMaterial/ITheoryMaterial";

export interface IClass {
  id: string;
  name: string;
  teachers: string;
  coverImage: string;
  lessons: ILesson[]
  theoryMaterials?: ITheoryMaterial[];
}

export interface ICreateClass {
  name: string;
  teachers: string;
  coverImage?: File;
}

export interface IUpdateClass{
  name?: string;
  teacherInfo?: string;
  teachers?: string;
  coverImage?: File;
}
