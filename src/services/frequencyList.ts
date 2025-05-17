import { apiRequest } from './apiRequest.service';

export function confirmPresence(
  classId: string,
  lessonId: string,
  userId: string
) {
  if (!userId || !lessonId || !classId) {
    return Promise.reject('Nenhum usuário ou classe ou aula recebido.');
  }

  const token = localStorage.getItem('token');

  return apiRequest(
    `frequencyList/${classId}/${lessonId}/${userId}`,
    'POST',
    undefined,
    token || undefined
  );
}
