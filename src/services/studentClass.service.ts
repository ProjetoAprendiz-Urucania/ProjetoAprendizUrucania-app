import { apiRequest } from "./apiRequest.service";

export function getStudentClasses(userId: string,token: string) {
  return apiRequest(`/userClass/${userId}`, "GET", undefined, token);
}

export function addStudentToClass(userId: string,classId: string,token: string) {
  return apiRequest(`/userClass/${classId}/${userId}`, "POST", undefined, token);
}

