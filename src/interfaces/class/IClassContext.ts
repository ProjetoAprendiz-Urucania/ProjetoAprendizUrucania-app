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
  uploadMaterial: (selectedFile: File, selectedLesson: string) => void;
  fetchStudentClasses: () => void;
  removeMaterial: (lessonId: string, materialId: string) => void;
  fetchLessons: () => void;
  lessons: ILesson[];
  setLessons: React.Dispatch<React.SetStateAction<ILesson[]>>;
  fetchMaterials: () => void;
  materials: ITheoryMaterial[];
  tk: string | null;
}
