import { useCallback } from "react";

import { useClass } from "./useClass";
import {
  deleteMaterial,
  uploadMaterialService,
} from "../services/theoryMaterials.service";

export const useMaterialActions = () => {
  const { selectedClass, fetchMaterials, tk } = useClass();

  const uploadMaterial = useCallback(
    async (file: File, lessonId: string) => {
      if (!tk || !selectedClass) return;
      await uploadMaterialService(selectedClass.id, lessonId, file, tk);

      fetchMaterials();
    },
    [tk, selectedClass,fetchMaterials]
  );

  const removeMaterial = useCallback(
    async (lessonId: string, materialId: string) => {
      if (!tk || !selectedClass) return;
      await deleteMaterial(selectedClass.id, lessonId, materialId);
      fetchMaterials();
    },
    [tk, selectedClass,fetchMaterials]
  );

  return { uploadMaterial, removeMaterial };
};
