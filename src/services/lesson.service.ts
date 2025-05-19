import { ICreateLesson, IUpdateLesson } from "../interfaces/lesson/ILesson";
import { apiRequest } from "./apiRequest.service";

export function getLessonsByClassId(classId: string, token: string) {
  return apiRequest(`classes/${classId}/lessons`, "GET", undefined, token);
}

export function getLesson(classId: string, lessonId: string, token: string) {
  return apiRequest(`classes/${classId}/${lessonId}`, "GET", undefined, token);
}

export function createLesson(
  classId: string,
  lessonData: ICreateLesson,
  token: string
) {
  return apiRequest(`classes/${classId}/lesson`, "POST", lessonData, token);
}

export async function deleteLesson(classId: string, lessonId: string, token: string) {
  try {
    return await apiRequest(`classes/${classId}/${lessonId}`, "DELETE", undefined, token);
  } catch (err) {
    console.error("Erro ao deletar aula:", err);
    throw new Error("Erro ao deletar aula. Tente novamente mais tarde.");
  }
}


export function uploadLessonPhoto(
  classId: string,
  lessonId: string,
  token: string,
  coverImage?: File,
) {
 const formData = new FormData();

  if(coverImage)
  formData.append('coverImage', coverImage);

  return apiRequest(
    `/classes/${classId}/${lessonId}/uploadPhoto`,
    "POST",
    formData,
    token || undefined
  );
}

export function updateLessonService(
  classId: string,
  lessonId: string,
  classData: Partial<IUpdateLesson>,
  token?: string
) {
  return apiRequest(`classes/${classId}/${lessonId}`, "PUT", classData, token);
}
