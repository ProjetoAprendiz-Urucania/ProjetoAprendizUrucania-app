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

export const ClassContext = createContext<IClassContext | undefined>(undefined);

interface ClassProviderProps {
  children: ReactNode;
}

export const ClassProvider = ({ children }: ClassProviderProps) => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<IClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<IClass | null>(null);
  const [loading, setLoading] = useState(false);

  const tk = localStorage.getItem("token");

  const addClass = async (newClass: ICreateClass) => {
    if (!tk) return;
    setLoading(true);
    try {
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
    setLoading(true);

    try {
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

    setLoading(true);

    try {
      const recoverClassData: IClass = await getClassById(storedClassId, tk);
      console.log(recoverClassData);
      setSelectedClass(recoverClassData);
    } catch (error) {
      console.error("Erro ao buscar classe por ID:", error);
      localStorage.removeItem("selectedClassId");
      setSelectedClass(null);
    } finally {
      setLoading(false);
    }
  };

  const updateClass = async (updatedClass: Partial<IUpdateClass>) => {
    if (!tk || !selectedClass) return;
    setLoading(true);

    try {
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

      setClasses((prevClasses) =>
        prevClasses.map((c) =>
          c.id === selectedClass.id
            ? {
                ...c,
                ...updatedClass,
                coverImage: updatedClass.coverImage
                  ? URL.createObjectURL(updatedClass.coverImage as File)
                  : c.coverImage,
                lessons: selectedClass.lessons || [],
              }
            : c
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getClassLessons = () => {
    if (!selectedClass) return;
    return selectedClass.lessons;
  };

  const getClassMaterials = () => {
    if (!selectedClass) return;
    const lessons = selectedClass.lessons;
    const materials = lessons.flatMap((lesson) => lesson.TheoryMaterial);

    return materials;
  };

  useEffect(() => {
    const fetchStudentClasses = async () => {
      if (!tk || !user) {
        console.error("Erro: Token ou usuário inexistente.");
        return;
      }

      const role = user?.role;

      try {
        const response =
          role === "admin"
            ? await getAdminClasses(tk)
            : await getStudentClasses(user?.id, tk);

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

    fetchStudentClasses();
  }, [tk, user?.role, loading]);

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
        getClassLessons,
        getClassMaterials,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};
