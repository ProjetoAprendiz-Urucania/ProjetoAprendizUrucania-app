import { ICreateClass, IUpdateClass } from "../interfaces/class/IClass";
import { apiRequest } from "./apiRequest.service";

export  function createClass(classData: ICreateClass, token: string) {
  return apiRequest(`/classes`, "POST", classData, token || undefined);
}

export  function uploadClassPhoto(classId: string,token: string,coverImage?: File ) {
  const formData = new FormData();

  if(coverImage)
  formData.append('coverImage', coverImage);

  return apiRequest(`/classes/${classId}/uploadPhoto`, "POST", formData, token || undefined);
}

export async function getAdminClasses(token: string) {
  try {
    const res = await apiRequest("/classes", "GET", undefined, token);
    return res;
  } catch (error) {
    console.error("Erro ao buscar classes:", error);
    throw error;
  }
}

export function deleteClass(id: string, token: string) {
  return apiRequest(`classes/${id}`, "DELETE", undefined, token || undefined);
}

export function getClasses(token: string) {
  return apiRequest("classes", "GET", undefined, token);
}

export function getClassById(id: string, token?: string) {
  return apiRequest(`classes/${id}`, "GET", undefined, token);
}

export function updateClassService(id: string, classData: Partial<IUpdateClass>, token?: string) {
  return apiRequest(`classes/${id}`, "PUT", classData, token);
}
