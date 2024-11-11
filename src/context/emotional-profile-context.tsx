'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Create the context
interface ProfileContextProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const EmotionalProfileContext = createContext<ProfileContextProps | undefined>(
  undefined,
);

// Hook to use the context
export const useEmotionalProfile = () => {
  const context = useContext(EmotionalProfileContext);
  if (!context)
    throw new Error('useEmotionalProfile must be used within a Provider');
  return context;
};

// Provider component
export const EmotionalProfileProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <EmotionalProfileContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </EmotionalProfileContext.Provider>
  );
};
