import { IClass } from "../interfaces/class/IClass";
import { apiRequest } from "./apiRequest.service";

export function createClass(classData: IClass) {
  return apiRequest("classes", "POST", classData);
}

export function deleteClass(id: string) {
  return apiRequest(`classes/${id}`, "DELETE");
}

export function getClasses(token: string) {
  return apiRequest("classes", "GET", undefined, token);
}

export function getClassById(id: string, token?: string) {
  return apiRequest(`classes/${id}`, "GET", undefined, token);
}

export function updateClass(id: string, classData: IClass, token?: string) {
  return apiRequest(`classes/${id}`, "PUT", classData, token);
}
