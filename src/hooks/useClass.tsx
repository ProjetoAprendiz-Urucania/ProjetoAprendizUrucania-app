import { useContext } from 'react';
import { IClassContext } from '../interfaces/class/IClassContext';
import { ClassContext } from '../context/ClassContext';

export const useClass = (): IClassContext => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error(
      'useClassContext deve ser usado dentro de um ClassProvider'
    );
  }
  return context;
};
