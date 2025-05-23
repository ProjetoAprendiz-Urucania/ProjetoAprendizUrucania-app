import { useCallback } from "react";
import {
  createClass,
  deleteClass,
  updateClassService,
  uploadClassPhoto,
} from "../services/class.service";
import { useClass } from "./useClass";
import { ICreateClass, IUpdateClass } from "../interfaces/class/IClass";

export const useClassActions = () => {
  const { fetchStudentClasses, tk } = useClass();

  const addClass = useCallback(
    async (newClass: ICreateClass) => {
      if (!tk) return;
      const response = await createClass(newClass, tk);
      if (response) {
        try {
          await uploadClassPhoto(response.id, tk, newClass.coverImage);
        } catch (error) {
          console.error("Erro no upload da foto da turma:", error);
        }
      }
      fetchStudentClasses();
    },
    [tk, fetchStudentClasses]
  );

  const removeClass = useCallback(
    async (classId: string) => {
      if (!tk) return;
      await deleteClass(classId, tk);
      fetchStudentClasses();
    },
    [tk, fetchStudentClasses]
  );

  const updateClass = useCallback(
    async (classId: string, updatedClass: Partial<IUpdateClass>) => {
      if (!tk) return;
      const response = await updateClassService(classId, updatedClass, tk);
      if (response && updatedClass.coverImage) {
        try {
          await uploadClassPhoto(classId, tk, updatedClass.coverImage);
        } catch (error) {
          console.error("Erro no update da foto da turma:", error);
        }
      }
      fetchStudentClasses();
    },
    [tk, fetchStudentClasses]
  );

  return { addClass, removeClass, updateClass };
};
