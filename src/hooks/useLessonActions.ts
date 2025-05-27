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

      let coverImageUrl = "";

      try {
        if (response && newLesson.coverImage) {
          const uploadResponse = await uploadLessonPhotoService(
            selectedClass.id,
            response.id,
            tk,
            newLesson.coverImage
          );

          const uploadedFile = uploadResponse.uploadedFiles?.[0];
          if (uploadedFile?.status === "success") {
            coverImageUrl = uploadedFile.fileUrl;
          }
        }
      } catch (error) {
        console.error("Erro ao enviar a imagem:", error);
      }

      setLessons((prevLessons) => [
        ...prevLessons,
        {
          ...response,
          coverImage: coverImageUrl || response.coverImage || "",
        },
      ]);
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

        let coverImageUrl: string | undefined;

        if (response && updatedLesson.coverImage instanceof File) {
          const uploadResponse = await uploadLessonPhotoService(
            selectedClass.id,
            lessonId,
            tk,
            updatedLesson.coverImage
          );

          const uploadedFile = uploadResponse.uploadedFiles?.[0];
          if (uploadedFile?.status === "success") {
            coverImageUrl = uploadedFile.fileUrl;
          }
        }

        setLessons((prevLessons) =>
          prevLessons.map((lesson) =>
            lesson.id === lessonId
              ? {
                  ...lesson,
                  ...updatedLesson,
                  coverImage: coverImageUrl || lesson.coverImage,
                }
              : lesson
          )
        );
      } catch (error) {
        console.error("Erro ao atualizar aula:", error);
      }
    },
    [tk, selectedClass]
  );

  return { addLesson, removeLesson, updateLesson };
};
