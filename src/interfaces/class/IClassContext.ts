import { ILesson } from "../lesson/ILesson";
import { ITheoryMaterial } from "../TheoryMaterial/ITheoryMaterial";
import { IClass, ICreateClass, IUpdateClass } from "./IClass";

export interface IClassContext {
  selectedClass: IClass | null;
  setSelectedClass: (selectedClass: IClass | null) => void;
  classes: IClass[];
  setClasses: (classes: IClass[]) => void;
  addClass: (data: ICreateClass) => void;
  updateClass: (data: Partial<IUpdateClass>) => void;
  removeClass: (id: string) => void;
  // addLesson: (data: ILesson) => void;
  // updateLesson: (data: ILesson) => void;
  // removeLesson: (id: number) => void;
  handleSelectedClass: (classIndex: number) => void;
  loadSelectedClassFromStorage: () => void;
  getClassLessons: () => ILesson[] | undefined;
  getClassMaterials: () => ITheoryMaterial[] | undefined;
}
