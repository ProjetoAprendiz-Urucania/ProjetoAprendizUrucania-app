import { useCallback } from "react";
import { ICreateLesson, IUpdateLesson } from "../interfaces/lesson/ILesson";
import {
  createLesson,
  uploadLessonPhotoService,
  deleteLesson,
  updateLessonService,
} from "../services/lesson.service";
import { useClass } from "./useClass";

export const useLessonActions = () => {
  const { selectedClass, fetchLessons, tk, fetchMaterials, setLessons } =
    useClass();

  const addLesson = useCallback(
    async (newLesson: ICreateLesson) => {
      if (!tk || !selectedClass) return;

      try {
        const response = await createLesson(selectedClass.id, newLesson, tk);

        if (response && newLesson.coverImage) {
          const uploadResponse = await uploadLessonPhotoService(
            selectedClass.id,
            response.id,
            tk,
            newLesson.coverImage
          );

          const uploadedFile = uploadResponse.uploadedFiles?.[0];
          if (uploadedFile?.status !== "success") {
            console.warn("Upload falhou ou não retornou corretamente");
          }
        }

        fetchLessons();
      } catch (error) {
        console.error("Erro ao adicionar aula:", error);
      }
    },
    [tk, selectedClass?.id, fetchLessons]
  );

  const removeLesson = useCallback(
    async (lessonId: string) => {
      if (!tk || !selectedClass) return;

      try {
        await deleteLesson(selectedClass.id, lessonId, tk);
      } catch (error) {
        console.error("Erro ao deletar aula:", error);
      }

      setLessons((prevLessons) =>
        prevLessons.filter((lesson) => lesson.id !== lessonId)
      );

      fetchLessons();
      fetchMaterials();
    },
    [tk, selectedClass, fetchLessons, fetchMaterials]
  );

  const updateLesson = useCallback(
    async (lessonId: string, updatedLesson: Partial<IUpdateLesson>) => {
      if (!tk || !selectedClass) return;

      try {
        await updateLessonService(
          selectedClass.id,
          lessonId,
          updatedLesson,
          tk
        );

        if (updatedLesson.coverImage) {
          await uploadLessonPhotoService(
            selectedClass.id,
            lessonId,
            tk,
            updatedLesson.coverImage
          );
        }

        fetchLessons();
      } catch (error) {
        console.error("Erro ao atualizar aula:", error);
      }
    },
    [tk, selectedClass]
  );

  return { addLesson, removeLesson, updateLesson };
};
