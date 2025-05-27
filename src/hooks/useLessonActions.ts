import { useCallback } from "react";
import { ICreateLesson, IUpdateLesson } from "../interfaces/lesson/ILesson";
import {
  createLesson,
  uploadLessonPhotoService,
  deleteLesson,
  updateLessonService,
} from "../services/lesson.service";
import { useClass } from "./useClass";
import { useApp } from "../context/AppContext";

export const useLessonActions = () => {
  const { handleMessage } = useApp();
  const {
    selectedClass,
    fetchLessons,
    tk,
    fetchMaterials,
    fetchStudentClasses,
  } = useClass();

  const addLesson = useCallback(
    async (newLesson: ICreateLesson) => {
      if (!tk || !selectedClass) return;
      const response = await createLesson(selectedClass.id, newLesson, tk);

      try {
        if (newLesson.coverImage)
          await uploadLessonPhotoService(
            selectedClass.id,
            response.id,
            tk,
            newLesson.coverImage
          );
        handleMessage("Aula criada com sucesso!", "success", {
          vertical: "top",
          horizontal: "right",
        });
      } catch (error: unknown) {
        handleMessage("Erro no upload da foto da aula", "error", {
          vertical: "top",
          horizontal: "right",
        });
        console.error("Erro no upload da foto da aula:", error);
      }
      
      fetchStudentClasses();
      fetchLessons();
    },
    [tk, selectedClass, handleMessage]
  );

  const removeLesson = useCallback(
    async (lessonId: string) => {
      if (!tk || !selectedClass) return;
      try {
        await deleteLesson(selectedClass.id, lessonId, tk);
        fetchLessons();
        fetchMaterials();
      } catch (error) {
        console.error("Erro ao deletar aula:", error);
      }
    },
    [tk, selectedClass]
  );

  const updateLesson = useCallback(
    async (lessonId: string, updatedLesson: Partial<IUpdateLesson>) => {
      if (!tk || !selectedClass) return;
      const response = await updateLessonService(
        selectedClass.id,
        lessonId,
        updatedLesson,
        tk
      );

      if (response && updatedLesson.coverImage) {
        await uploadLessonPhotoService(
          selectedClass.id,
          lessonId,
          tk,
          updatedLesson.coverImage
        );
      }

      fetchLessons();
    },
    [tk, selectedClass]
  );
  return { addLesson, removeLesson, updateLesson };
};
