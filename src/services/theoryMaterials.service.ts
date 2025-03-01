import { apiRequest } from "./apiRequest.service";

export async function getMaterialsByLesson(classId: string,lessonId: string,token:string){
  return apiRequest(`classes/${classId}/${lessonId}/theoryMaterials`,"GET", undefined,token);
}

export async function getAllMaterials(classId: string,token:string){
  return apiRequest(`classes/${classId}/theoryMaterials`,"GET", undefined,token);
}