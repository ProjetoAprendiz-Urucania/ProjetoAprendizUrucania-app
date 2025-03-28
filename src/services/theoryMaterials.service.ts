import { apiRequest } from "./apiRequest.service";

export async function getMaterialsByLesson(classId: string,lessonId: string,token:string){
  return apiRequest(`classes/${classId}/${lessonId}/theoryMaterials`,"GET", undefined,token);
}

export async function getAllMaterials(classId: string,token:string){
  return apiRequest(`classes/${classId}/theoryMaterials`,"GET", undefined,token);
}

export async function uploadMaterial(classId: string,lessonId: string,material: File,token:string){
  const formData = new FormData();
  formData.append('TheoryMaterial', material);

  return apiRequest(`classes/${classId}/${lessonId}/theoryMaterials`,"POST", formData,token);
}