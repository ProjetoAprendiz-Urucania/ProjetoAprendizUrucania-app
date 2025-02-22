
const API_URL = import.meta.env.VITE_API_URL as string;

async function handleResponse(response: Response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.error || `Erro: ${response.status} - ${response.statusText}`;
      throw new Error(errorMessage);
    }
  
    return response.json(); 
}

export async function getMaterial(classId: string,lessonId: string){
    try {
        const response = await fetch(`${API_URL}/classes/${classId}/${lessonId}/theoryMaterials`);
        const material = await handleResponse(response)
        return material;
    } catch (error) {
        console.error("Erro ao obter material:", error);
        throw error;
    }
}