import { apiRequest } from "./apiRequest.service";

export async function getStudentClasses(userId: string, token: string) {
  const res = await apiRequest(`/userClass/${userId}`, "GET", undefined, token);
  return res;
}

export function addStudentToClass(
  userId: string,
  classId: string,
  token: string,
) {
  return apiRequest(
    `/userClass/${classId}/${userId}`,
    "POST",
    undefined,
    token,
  );
}

export function removeStudentToClass(
  userId: string,
  classId: string,
  token: string,
) {
  return apiRequest(
    `/userClass/${classId}/${userId}`,
    "DELETE",
    undefined,
    token,
  );
}
