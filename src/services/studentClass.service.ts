import { apiRequest } from "./apiRequest.service";

export function getStudentClasses(userId: string,token: string) {
  return apiRequest(`/userClass/${userId}`, "GET", undefined, token);
}
