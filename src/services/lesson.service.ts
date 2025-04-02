import { ILesson } from "../interfaces/lesson/ILesson";
import { apiRequest } from "./apiRequest.service";

export function getLessonsByClassId(classId: string, token: string) {
  return apiRequest(`classes/${classId}/lessons`, "GET", undefined, token);
}

export function getLesson(classId: string, lessonId: string, token: string) {
  return apiRequest(`classes/${classId}/${lessonId}`, "GET", undefined, token);
}

export function createLesson(
  classId: string,
  classData: ILesson,
  token: string
) {
  return apiRequest(`classes/${classId}/lesson`, "POST", classData, token);
}

export async function deleteLesson(classId: string, lessonId: string, token: string) {
  console.log("Enviando requisição DELETE para:", `classes/${classId}/${lessonId}`);
  try {
    const res = await apiRequest(`classes/${classId}/${lessonId}`, "DELETE", undefined, token);
    return console.log("Resposta da API:", res);
  } catch (err) {
    return console.error("Erro ao deletar:", err);
  }
}


export function uploadLessonPhoto(
  classId: string,
  lessonId: string,
  coverImage: File,
  token: string
) {
  const formData = new FormData();
  formData.append("coverImage", coverImage);

  return apiRequest(
    `/classes/${classId}/${lessonId}/uploadPhoto`,
    "POST",
    formData,
    token || undefined
  );
}

export function updateLesson(
  classId: string,
  lessonId: string,
  classData: ILesson,
  token?: string
) {
  return apiRequest(`classes/${classId}/${lessonId}`, "PUT", classData, token);
}
