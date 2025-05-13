import { ILesson } from "../lesson/ILesson";
import { IClass } from "./IClass";

export interface IClassContext {
  selectedClass: number | undefined;
  setSelectedClass: (classIndex: number) => void;
  classes: IClass[];
  setClasses: (classes: IClass[]) => void;
  addClassToList: (data: IClass) => void;
  updateClassInList: (data: IClass) => void;
  removeClassToList: (id: number) => void;
  lessons: ILesson[];
  setLessons: (lessons: ILesson[]) => void;
  addLessonToList: (data: ILesson) => void;
  updateLessonInList: (data: ILesson) => void;
  removeLessonToList: (id: number) => void;
}
