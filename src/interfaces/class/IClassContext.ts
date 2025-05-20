import { ICreateLesson,IUpdateLesson } from "../lesson/ILesson";
import { IClass, ICreateClass, IUpdateClass } from "./IClass";

export interface IClassContext {
  loading: boolean,
  selectedClass: IClass | null;
  setSelectedClass: (selectedClass: IClass | null) => void;
  classes: IClass[];
  setClasses: (classes: IClass[]) => void;
  addClass: (data: ICreateClass) => void;
  updateClass: (data: Partial<IUpdateClass>) => void;
  removeClass: (id: string) => void;
  addLesson: (data: ICreateLesson) => void;
  updateLesson: (id: string,data: Partial<IUpdateLesson>) => void;
  removeLesson: (id: string) => void;
  handleSelectedClass: (classIndex: number) => void;
  loadSelectedClassFromStorage: () => void;
  selectedClassIndex: number;
  uploadMaterial: (selectedFile: File, selectedLesson: string) => void
  fetchStudentClasses: () => void;
  removeMaterial: (lessonId: string,materialId: string) => void;
}
