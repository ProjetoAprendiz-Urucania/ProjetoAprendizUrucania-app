import { apiRequest } from "./apiRequest.service";

export function confirmPresence(
  classId: string,
  lessonId: string,
  userId: string,
) {
  if (!userId || !lessonId || !classId) {
    return Promise.reject("Nenhum usuário ou classe ou aula recebido.");
  }

  const token = localStorage.getItem("token");

  return apiRequest(
    `frequencyList/${classId}/${lessonId}/${userId}`,
    "POST",
    undefined,
    token || undefined,
  );
}

export function getFrequencyList(
  classId: string,
  lessonId: string,
) {
  if (!lessonId || !classId) {
    return Promise.reject("Nenhuma turma ou aula recebida.");
  }

  const token = localStorage.getItem("token");

  return apiRequest(
    `frequencyList/${classId}/${lessonId}/getFrequencyList`,
    "GET",
    undefined,
    token || undefined,
  );
}

