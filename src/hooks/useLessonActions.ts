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
      const response = await createLesson(selectedClass.id, newLesson, tk);
      try {
        if (response && newLesson.coverImage) {
          await uploadLessonPhotoService(
            selectedClass.id,
            response.id,
            tk,
            newLesson.coverImage
          );
        }
      } catch (error) {
        console.error("Erro ao adicionar aula:", error);
      }
      setLessons((prevLessons) => [...prevLessons, response]);
    },
    [tk, selectedClass?.id]
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

      try {
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

        setLessons((prevLessons) =>
          prevLessons.map((lesson) => {
            if (lesson.id !== lessonId) return lesson;
            const updatedCoverImage =
              updatedLesson.coverImage instanceof File
                ? lesson.coverImage
                : updatedLesson.coverImage !== undefined
                  ? updatedLesson.coverImage
                  : lesson.coverImage;
            return {
              ...lesson,
              ...updatedLesson,
              coverImage: updatedCoverImage,
            };
          })
        );
      } catch (error) {
        console.error("Erro ao atualizar aula:", error);
      }
    },
    [tk, selectedClass]
  );

  return { addLesson, removeLesson, updateLesson };
};
