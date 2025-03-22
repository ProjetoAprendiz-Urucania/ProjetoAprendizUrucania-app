import { apiRequest } from "./apiRequest.service";

export function getStudentClasses(userId: string,token: string) {
  return apiRequest(`/userClass/${userId}`, "GET", undefined, token);
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

