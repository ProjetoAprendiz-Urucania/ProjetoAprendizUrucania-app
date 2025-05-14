import { ILesson } from "../lesson/ILesson";
import { IClass, ICreateClass } from "./IClass";

export interface IClassContext {
  selectedClass: IClass | null;
  setSelectedClass: (selectedClass: IClass | null) => void;
  classes: IClass[];
  setClasses: (classes: IClass[]) => void;
  addClass: (data: ICreateClass,selectedPhoto: File) => void;
  updateClass: (data: IClass) => void;
  removeClass: (id: number) => void;
  // addLesson: (data: ILesson) => void;
  // updateLesson: (data: ILesson) => void;
  // removeLesson: (id: number) => void;
  handleSelectedClass: (classIndex: number) => void;
  handleSelectedLesson: (lessonIndex: number) => void;
  selectedLesson: ILesson | null;
  loadSelectedClassFromStorage: () => void;
}
