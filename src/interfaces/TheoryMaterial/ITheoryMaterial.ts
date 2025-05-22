import { ILesson } from "../lesson/ILesson";
export interface ITheoryMaterial {
  id: string;
  name: string;
  fileType: string;
  lessonId?: string;
  lesson?: ILesson;
  fileUrl: string;
}
