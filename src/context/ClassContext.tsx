/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { IClassContext } from "../interfaces/class/IClassContext";
import { IClass, ICreateClass, IUpdateClass } from "../interfaces/class/IClass";
import {
  createClass,
  deleteClass,
  getAdminClasses,
  getClassById,
  updateClassService,
  uploadClassPhoto,
} from "../services/class.service";
import { useAuth } from "../hooks/useAuth";
import { getStudentClasses } from "../services/studentClass.service";
import {
  ICreateLesson,
  ILesson,
  IUpdateLesson,
} from "../interfaces/lesson/ILesson";
import {
  createLesson,
  deleteLesson,
  getLessonsByClassId,
  updateLessonService,
  uploadLessonPhotoService,
} from "../services/lesson.service";
import {
  deleteMaterial,
  getAllMaterials,
  uploadMaterialService,
} from "../services/theoryMaterials.service";
import { ITheoryMaterial } from "../interfaces/TheoryMaterial/ITheoryMaterial";

export const ClassContext = createContext<IClassContext | undefined>(undefined);

interface ClassProviderProps {
  children: ReactNode;
}

export const ClassProvider = ({ children }: ClassProviderProps) => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<IClass[]>([]);
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [materials, setMaterials] = useState<ITheoryMaterial[]>([]);
  const [selectedClassIndex, setSelectedClassIndex] = useState(-1);
  const [selectedClass, setSelectedClass] = useState<IClass | null>(null);
  const [loading, setLoading] = useState(false);

  const tk = localStorage.getItem("token");

  const handleApiCall = async (fn: () => Promise<void>) => {
    if (!tk) return;
    setLoading(true);
    try {
      await fn();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addClass = useCallback(
    async (newClass: ICreateClass) => {
      if (!tk) return;
      await handleApiCall(async () => {
        const response = await createClass(newClass, tk);
        if (response) {
          await uploadClassPhoto(response.id, tk, newClass.coverImage);
          setClasses((prev) => [
            ...prev,
            {
              ...newClass,
              id: response.id,
              lessons: [],
              coverImage: newClass.coverImage
                ? URL.createObjectURL(newClass.coverImage)
                : "",
            } as IClass,
          ]);
        }
      });
    },
    [tk],
  );

  const removeClass = useCallback(
    async (classId: string) => {
      if (!tk) return;
      await handleApiCall(async () => {
        await deleteClass(classId, tk);
        setClasses((prev) => prev.filter((item) => item.id !== classId));
      });
    },
    [tk],
  );

  const handleSelectedClass = (classIndex: number) => {
    if (classIndex < 0 || classIndex >= classes.length) {
      console.warn("Índice de classe inválido:", classIndex);
      return;
    }

    const selected = classes[classIndex];
    setSelectedClassIndex(classIndex);
    setSelectedClass(selected);
    setLessons([]);
    localStorage.setItem("selectedClassId", selected.id);
  };

  const loadSelectedClassFromStorage = useCallback(async () => {
    if (!tk) return;
    const storedClassId = localStorage.getItem("selectedClassId");
    if (!storedClassId) return;

    await handleApiCall(async () => {
      const classData = await getClassById(storedClassId, tk);
      setSelectedClass(classData);
    });
  }, [tk]);

  const updateClass = useCallback(
    async (updatedClass: Partial<IUpdateClass>) => {
      if (!tk || !selectedClass) return;
      await handleApiCall(async () => {
        const response = await updateClassService(
          selectedClass.id,
          updatedClass,
          tk,
        );
        if (response && updatedClass.coverImage) {
          await uploadClassPhoto(selectedClass.id, tk, updatedClass.coverImage);
        }
        const updatedCoverImage = updatedClass.coverImage
          ? URL.createObjectURL(updatedClass.coverImage as File)
          : selectedClass.coverImage;
        const filteredUpdate = Object.fromEntries(
          Object.entries(updatedClass).filter(
            ([, value]) => value !== undefined && value !== "",
          ),
        );
        updateClassInState({
          ...selectedClass,
          ...filteredUpdate,
          id: selectedClass.id,
          coverImage: updatedCoverImage,
        });
      });
    },
    [tk, selectedClass],
  );

  const addLesson = useCallback(
    async (newLesson: ICreateLesson) => {
      if (!tk || !selectedClass) return;
      await handleApiCall(async () => {
        const response = await createLesson(selectedClass.id, newLesson, tk);
        if (response && newLesson.coverImage) {
          await uploadLessonPhotoService(
            selectedClass.id,
            response.id,
            tk,
            newLesson.coverImage,
          );
        }
        const updatedLessons = [
          ...(selectedClass?.lessons || []),
          {
            ...response,
            coverImage: newLesson.coverImage
              ? URL.createObjectURL(newLesson.coverImage)
              : "",
          },
        ];
        updateClassInState({ id: selectedClass.id, lessons: updatedLessons });
      });
    },
    [tk, selectedClass],
  );

  const removeLesson = useCallback(
    async (lessonId: string) => {
      if (!tk || !selectedClass) return;
      await handleApiCall(async () => {
        await deleteLesson(selectedClass.id, lessonId, tk);
        const updatedLessons =
          selectedClass.lessons?.filter((l) => l.id !== lessonId) || [];
        updateClassInState({ id: selectedClass.id, lessons: updatedLessons });
      });
    },
    [tk, selectedClass],
  );

  const updateLesson = useCallback(
    async (lessonId: string, updatedLesson: Partial<IUpdateLesson>) => {
      if (!tk || !selectedClass) return;
      await handleApiCall(async () => {
        const response = await updateLessonService(
          selectedClass.id,
          lessonId,
          updatedLesson,
          tk,
        );

        if (response && updatedLesson.coverImage) {
          await uploadLessonPhotoService(
            selectedClass.id,
            lessonId,
            tk,
            updatedLesson.coverImage,
          );
        }
        const updatedCoverImage = updatedLesson.coverImage
          ? URL.createObjectURL(updatedLesson.coverImage as File)
          : response.coverImage;
        const validUpdates = Object.fromEntries(
          Object.entries(updatedLesson).filter(
            ([, value]) => value !== undefined && value !== "",
          ),
        );
        const updatedLessons = selectedClass.lessons.map((lesson) =>
          lesson.id === lessonId
            ? { ...lesson, ...validUpdates, coverImage: updatedCoverImage }
            : lesson,
        );
        updateClassInState({ id: selectedClass.id, lessons: updatedLessons });
      });
    },
    [tk, selectedClass],
  );

  const updateClassInState = (
    updatedClassData: Partial<IClass> & { id: string },
  ) => {
    setClasses((prevClasses) =>
      prevClasses.map((c) =>
        c.id === updatedClassData.id ? { ...c, ...updatedClassData } : c,
      ),
    );
    setSelectedClass((prev) =>
      prev?.id === updatedClassData.id
        ? { ...prev, ...updatedClassData }
        : prev,
    );
  };

  const uploadMaterial = useCallback(
    async (file: File, lessonId: string) => {
      if (!tk || !selectedClass) return;
      await handleApiCall(async () => {
        const updatedData = await uploadMaterialService(
          selectedClass.id,
          lessonId,
          file,
          tk,
        );
        setSelectedClass((prev) =>
          prev?.id === selectedClass.id ? { ...prev, ...updatedData } : prev,
        );
      });
    },
    [tk, selectedClass],
  );

  const removeMaterial = useCallback(
    async (lessonId: string, materialId: string) => {
      if (!tk || !selectedClass) return;
      await handleApiCall(async () => {
        const updatedData = await deleteMaterial(
          selectedClass.id,
          lessonId,
          materialId,
        );
        setSelectedClass((prev) =>
          prev?.id === selectedClass.id
            ? { ...prev, theoryMaterials: updatedData }
            : prev,
        );
      });
    },
    [tk, selectedClass],
  );

  const fetchMaterials = async () => {
    if (!tk || !selectedClass) return;
    try {
      const res = await getAllMaterials(selectedClass.id, tk);
      setMaterials(res || []);
    } catch (error) {
      console.error("Erro ao buscar materiais:", error);
    }
  };

  const fetchLessons = async () => {
    if (!tk || !selectedClass) return;
    try {
      const res = await getLessonsByClassId(selectedClass.id, tk);
      setLessons(res || []);
    } catch (error) {
      console.error("Erro ao buscar aulas:", error);
    }
  };

  const fetchStudentClasses = useCallback(async () => {
    if (!tk || !user) return;
    await handleApiCall(async () => {
      const role = user.role;
      const response =
        role === "admin"
          ? await getAdminClasses(tk)
          : await getStudentClasses(user.id, tk);
      const fetched =
        role === "admin"
          ? Array.isArray(response)
            ? response
            : []
          : Array.isArray(response.classes)
            ? response.classes
            : [];
      setClasses(fetched);
    });
  }, [tk, user]);

  useEffect(() => {
    loadSelectedClassFromStorage();
  }, [loadSelectedClassFromStorage]);

  return (
    <ClassContext.Provider
      value={{
        loading,
        selectedClass,
        setSelectedClass,
        classes,
        setClasses,
        addClass,
        updateClass,
        removeClass,
        handleSelectedClass,
        loadSelectedClassFromStorage,
        addLesson,
        selectedClassIndex,
        removeLesson,
        updateLesson,
        uploadMaterial,
        fetchStudentClasses,
        removeMaterial,
        fetchLessons,
        fetchMaterials,
        materials,
        lessons,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};
