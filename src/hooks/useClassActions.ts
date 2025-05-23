import { useCallback } from "react";
import {
  createClass,
  deleteClass,
  updateClassService,
  uploadClassPhoto,
} from "../services/class.service";
import { useClass } from "./useClass";
import { ICreateClass, IUpdateClass } from "../interfaces/class/IClass";
import { useApp } from "../context/AppContext";

export const useClassActions = () => {
  const { fetchStudentClasses, tk } = useClass();
  const { handleMessage } = useApp();

  const addClass = useCallback(
    async (newClass: ICreateClass) => {
      if (!tk) return;
        const response = await createClass(newClass, tk);
        try {
          if(newClass.coverImage)
          await uploadClassPhoto(response.id, tk, newClass.coverImage);
          handleMessage("Turma criada com sucesso!", "success", {
            vertical: "bottom",
            horizontal: "left",
          });
        } catch (error: unknown) {
          handleMessage("Erro no upload da foto da turma", "error", {
            vertical: "bottom",
            horizontal: "left",
          });
          console.error("Erro no upload da foto da turma:", error);
        }
    
      fetchStudentClasses();
    },
    [tk, fetchStudentClasses, handleMessage]
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
