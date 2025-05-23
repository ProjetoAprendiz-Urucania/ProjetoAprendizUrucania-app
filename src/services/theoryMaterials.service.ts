import { apiRequest } from "./apiRequest.service";

export async function getMaterialsByLesson(
  classId: string,
  lessonId: string,
  token: string,
) {
  const res = await apiRequest(
    `classes/${classId}/${lessonId}/theoryMaterials`,
    "GET",
    undefined,
    token,
  );
  console.log("res", res);
  return res;
}

export async function getAllMaterials(classId: string, token: string) {
  const res = await apiRequest(
    `classes/${classId}/theoryMaterials`,
    "GET",
    undefined,
    token,
  );
  return res;
}

export async function uploadMaterialService(
  classId: string,
  lessonId: string,
  file: File,
  token: string,
) {
  const formData = new FormData();
  formData.append("TheoryMaterial", file);
  return apiRequest(
    `classes/${classId}/${lessonId}/theoryMaterials`,
    "POST",
    formData,
    token,
  );
}

export async function deleteMaterial(
  classId: string,
  lessonId: string,
  theoryMaterialId: string,
) {
  const token = localStorage.getItem("token") || undefined;
  return apiRequest(
    `classes/${classId}/${lessonId}/theoryMaterials/${theoryMaterialId}`,
    "DELETE",
    undefined,
    token,
  );
}
