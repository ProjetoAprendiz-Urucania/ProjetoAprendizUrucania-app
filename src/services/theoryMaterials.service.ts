import { apiRequest } from "./apiRequest.service";

export async function getMaterial(classId: string,lessonId: string,token:string){
  return apiRequest(`classes/${classId}/${lessonId}/theoryMaterials`,"GET", undefined,token);
}