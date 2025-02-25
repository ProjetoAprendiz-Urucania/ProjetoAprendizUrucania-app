import handleResponse from "./responseHandler.service";

const API_URL = import.meta.env.VITE_API_URL as string;


export async function getMaterial(classId: string,lessonId: string,token:string){
    try {
        const response = await fetch(`${API_URL}/classes/${classId}/${lessonId}/theoryMaterials`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const material = await handleResponse(response)
        return material;
    } catch (error) {

      console.error("Erro ao obter material:", error);
      throw error;
    }
}