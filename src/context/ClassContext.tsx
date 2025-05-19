/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, ReactNode, useEffect } from "react";
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
  uploadLessonPhoto,
} from "../services/lesson.service";
import {
  deleteMaterial,
  uploadMaterialService,
} from "../services/theoryMaterials.service";

export const ClassContext = createContext<IClassContext | undefined>(undefined);

interface ClassProviderProps {
  children: ReactNode;
}

export const ClassProvider = ({ children }: ClassProviderProps) => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<IClass[]>([]);
  const [lessons, setLessons] = useState<ILesson[]>([]);

  const [selectedClassIndex, setSelectedClassIndex] = useState(-1);
  const [selectedClass, setSelectedClass] = useState<IClass | null>(null);

  const [loading, setLoading] = useState(false);

  const tk = localStorage.getItem("token");

  const addClass = async (newClass: ICreateClass) => {
    if (!tk) return;
    try {
      setLoading(true);
      const response = await createClass(newClass, tk);
      if (response) {
        await uploadClassPhoto(response.id, tk, newClass.coverImage);
      }

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
    } catch (error) {
      console.error("Erro ao criar classe:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeClass = async (classId: string) => {
    if (!tk) return;
    try {
      setLoading(true);
      await deleteClass(classId, tk);
      const updatedClasses = classes.filter((item) => item.id !== classId);
      setClasses(updatedClasses);
    } catch (error) {
      console.error("Erro ao remover classe:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectedClass = (classIndex: number) => {
    const selected = {
      ...classes[classIndex],
      lessons: classes[classIndex].lessons || [],
    };
    setSelectedClassIndex(classIndex);
    setSelectedClass(selected);
    localStorage.setItem("selectedClassId", selected.id);
  };

  const loadSelectedClassFromStorage = async () => {
    if (!tk) return;

    const storedClassId = localStorage.getItem("selectedClassId");
    if (!storedClassId) {
      setSelectedClass(null);
      return;
    }

    try {
      setLoading(true);
      const recoverClassData: IClass = await getClassById(storedClassId, tk);
      setSelectedClass(recoverClassData);
    } catch (error) {
      console.error("Erro ao buscar classe por ID:", error);
      localStorage.removeItem("selectedClassId");
      setSelectedClass(null);
    } finally {
      setLoading(false);
    }
  };

  const updateClass = async (
    classId: string,
    updatedClass: Partial<IUpdateClass>
  ) => {
    if (!tk || !selectedClass) return;
    try {
      setLoading(true);
      const response = await updateClassService(
        selectedClass.id,
        updatedClass,
        tk
      );

      if (response && updatedClass.coverImage) {
        await uploadClassPhoto(
          selectedClass.id,
          tk,
          updatedClass.coverImage as File
        );
      }

      const updatedCoverImage = updatedClass.coverImage
        ? URL.createObjectURL(updatedClass.coverImage as File)
        : selectedClass.coverImage;

      const filteredUpdate = Object.fromEntries(
        Object.entries(updatedClass).filter(
          ([, value]) => value !== undefined && value !== ""
        )
      );

      updateClassInState({
        ...selectedClass,
        ...filteredUpdate,
        id: classId,
        coverImage: updatedCoverImage,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addLesson = async (newLesson: ICreateLesson) => {
    if (!tk || !selectedClass) return;
    try {
      setLoading(true);

      const response = await createLesson(selectedClass.id, newLesson, tk);

      if (response && newLesson.coverImage) {
        await uploadLessonPhoto(
          selectedClass.id,
          response.id,
          tk,
          newLesson.coverImage
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
    } catch (error) {
      console.error("Erro ao criar aula:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeLesson = async (lessonId: string) => {
    if (!tk || !selectedClass) return;
    try {
      setLoading(true);
      await deleteLesson(selectedClass.id, lessonId, tk);

      const updatedLessons = selectedClass?.lessons
        ? selectedClass.lessons.filter((item) => item.id !== lessonId)
        : [];

      updateClassInState({ id: selectedClass.id, lessons: updatedLessons });
    } catch (error) {
      console.error("Erro ao remover aula:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateLesson = async (
    lessonId: string,
    updatedLesson: Partial<IUpdateLesson>
  ) => {
    if (!tk || !selectedClass) return;
    setLoading(true);
    try {
      const response = await updateLessonService(
        selectedClass.id,
        lessonId,
        updatedLesson,
        tk
      );

      if (response && updatedLesson.coverImage) {
        await uploadLessonPhoto(
          selectedClass.id,
          lessonId,
          tk,
          updatedLesson.coverImage as File
        );
      }

      const updatedCoverImage = updatedLesson.coverImage
        ? URL.createObjectURL(updatedLesson.coverImage as File)
        : response.coverImage;

      const validUpdates = Object.fromEntries(
        Object.entries(updatedLesson).filter(
          ([, value]) => value !== undefined && value !== ""
        )
      );

      const updatedLessons = selectedClass.lessons.map((lesson) =>
        lesson.id === lessonId
          ? {
              ...lesson,
              ...validUpdates,
              coverImage: updatedCoverImage,
            }
          : lesson
      );

      updateClassInState({
        id: selectedClass.id,
        lessons: updatedLessons,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateClassInState = (
    updatedClassData: Partial<IClass> & { id: string }
  ) => {
    setClasses((prevClasses) =>
      prevClasses.map((c) =>
        c.id === updatedClassData.id
          ? {
              ...c,
              ...updatedClassData,
            }
          : c
      )
    );

    setSelectedClass((prev) => {
      if (!prev) return null;
      if (prev.id === updatedClassData.id) {
        return { ...prev, ...updatedClassData };
      }
      return prev;
    });
  };

  const uploadMaterial = async (selectedFile: File, selectedLesson: string) => {
    if (!selectedClass || !tk) return;
    try {
      setLoading(true);

      const updatedClassData = await uploadMaterialService(
        selectedClass.id,
        selectedLesson,
        selectedFile,
        tk
      );

      setSelectedClass((prev) => {
        if (!prev) return null;
        if (prev.id === selectedClass.id) {
          return { ...prev, ...updatedClassData };
        }
        return prev;
      });
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeMaterial = async (lessonId: string, materialId: string) => {
    if (!selectedClass || !tk) return;
    try {
      setLoading(true);
      const updatedClassData = await deleteMaterial(
        selectedClass.id,
        lessonId,
        materialId
      );

      setSelectedClass((prev) => {
        if (!prev) return null;
        if (prev.id === selectedClass.id) {
          return { ...prev, theoryMaterials: updatedClassData };
        }
        return prev;
      });
    } catch (error) {
      console.error("Failed to delete material:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentClasses = async () => {
    if (!tk || !user) {
      console.error("Erro: Token ou usuário inexistente.");
      return;
    }

    try {
      const role = user.role;
      const response =
        role === "admin"
          ? await getAdminClasses(tk)
          : await getStudentClasses(user.id, tk);

      if (!response) return;

      const fetchedClasses =
        role === "admin"
          ? Array.isArray(response)
            ? response
            : []
          : Array.isArray(response.classes)
          ? response.classes
          : [];

      setClasses(fetchedClasses);
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
    }
  };

  useEffect(() => {
    const fetchLessons = async () => {
      if (!tk || !selectedClass) return;
      setLessons([]);
      try {
        const fetchedLessons = await getLessonsByClassId(selectedClass.id, tk);
        setLessons(fetchedLessons || []);
      } catch (error) {
        console.error("Erro ao buscar aulas:", error);
      }
    };
    fetchLessons();
  }, [tk, selectedClass]);

  useEffect(() => {
    loadSelectedClassFromStorage();
  }, []);

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
        lessons,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};
