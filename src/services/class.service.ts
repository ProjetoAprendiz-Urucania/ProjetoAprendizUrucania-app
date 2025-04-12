import { IClass } from "../interfaces/class/IClass";
import { apiRequest } from "./apiRequest.service";

export  function createClass(classData: IClass, token: string) {
  return apiRequest(`/classes`, "POST", classData, token || undefined);
}

export  function uploadClassPhoto(classId: string,coverImage: File ,token: string) {
  const formData = new FormData();
  formData.append('coverImage', coverImage);

  return apiRequest(`/classes/${classId}/uploadPhoto`, "POST", formData, token || undefined);
}

export async function getAdminClasses(token: string) {
  try {
    const res = await apiRequest("/classes", "GET", undefined, token);

    console.log(res); 
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

export function updateClass(id: string, classData: IClass, token?: string) {
  return apiRequest(`classes/${id}`, "PUT", classData, token);
}
