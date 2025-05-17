// import { IClass } from "../class/IClass";
import { ITheoryMaterial } from "../TheoryMaterial/ITheoryMaterial";
export interface ILesson {
  id: string;
  name: string;
  teacher: string;
  coverImage: string;
  lessonLink: string;
  TheoryMaterial: ITheoryMaterial[];
}

export interface ICreateLesson {
  name: string;
  teacher: string;
  coverImage?: File;
  lessonLink: string;
}

export interface IUpdateLesson {
  name: string;
  teacher: string;
  coverImage: File;
  lessonLink: string;
}
