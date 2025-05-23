import {  ILesson } from "../lesson/ILesson";
import { ITheoryMaterial } from "../TheoryMaterial/ITheoryMaterial";
import { IClass } from "./IClass";

export interface IClassContext {
  selectedClass: IClass | null;
  setSelectedClass: (selectedClass: IClass | null) => void;
  classes: IClass[];
  setClasses: React.Dispatch<React.SetStateAction<IClass[]>>;
  handleSelectedClass: (classIndex: number) => void;
  loadSelectedClassFromStorage: () => void;
  selectedClassIndex: number;
  fetchStudentClasses: () => void;
  fetchLessons: () => void;
  lessons: ILesson[];
  setLessons: React.Dispatch<React.SetStateAction<ILesson[]>>;
  fetchMaterials: () => void;
  materials: ITheoryMaterial[];
  tk: string | null;
}
