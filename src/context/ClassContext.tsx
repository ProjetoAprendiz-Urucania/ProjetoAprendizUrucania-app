/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, ReactNode, useEffect } from "react";
import { IClassContext } from "../interfaces/class/IClassContext";
import { IClass, ICreateClass, IUpdateClass } from "../interfaces/class/IClass";
import {
  createClass,
  deleteClass,
  updateClassService,
  uploadClassPhoto,
} from "../services/class.service";

export const ClassContext = createContext<IClassContext | undefined>(undefined);

interface ClassProviderProps {
  children: ReactNode;
}

export const ClassProvider = ({ children }: ClassProviderProps) => {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<IClass | null>(null);
  const [tk] = useState<string | null>(localStorage.getItem("token"));

  const addClass = async (newClass: ICreateClass) => {
    if (!tk) return;
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
    }
  };

  const removeClass = async (classId: string) => {
    if (!tk) return;
    try {
      await deleteClass(classId, tk);

      const updatedClasses = classes.filter((item) => item.id !== classId);
      setClasses(updatedClasses);
    } catch (error) {
      console.error("Erro ao remover classe:", error);
    }
  };

  const handleSelectedClass = async (classIndex: number) => {
    const selected = {
      ...classes[classIndex],
      lessons: classes[classIndex].lessons || [],
    };
    setSelectedClass(selected);
    localStorage.setItem("selectedClass", JSON.stringify(selected));
  };

  const loadSelectedClassFromStorage = async () => {
    const storedClass = localStorage.getItem("selectedClass");
    if (!storedClass) {
      setSelectedClass(null);
      return;
    }

    try {
      const recoverClassData: IClass = JSON.parse(storedClass);
      console.log(recoverClassData);
      setSelectedClass(recoverClassData);
    } catch (error) {
      console.error("Erro ao fazer parse do selectedClass:", error);
      localStorage.removeItem("selectedClass");
      setSelectedClass(null);
    }
  };

  const updateClass = async (updatedClass: Partial<IUpdateClass>) => {
    if (!tk || !selectedClass) return;

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
  };

  const getClassLessons = () => {
    if (!selectedClass) return;
    return selectedClass.lessons;
  };

  const getClassMaterials = () => {
    if (!selectedClass) return;
    const lessons = selectedClass.lessons;
    const materials = lessons.flatMap((lesson) => lesson.TheoryMaterial);
    console.log("materials", materials);

    return materials;
  };

  useEffect(() => {
    loadSelectedClassFromStorage();
  }, []);

  return (
    <ClassContext.Provider
      value={{
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
