// context/ProfileContext.tsx
'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

interface DailyResponse {
  createdAt: string;
  overallMood: string;
  familyInteraction: string;
  friendsInteraction: string;
  physicalExercise: string;
  sleepQuality: string;
  stressLevel: string;
  moodScore: number;
  date: string;
  time: string;
}

interface Registro {
  data: string;
  humor: string;
  hora: string;
  icone: React.ReactNode;
  categorias: (string | React.ReactNode)[];
  cor: string;
}

interface ProfileContextProps {
  isProfileSubmitted: boolean;
  setProfileSubmitted: (value: boolean) => void;
  openProfileModal: boolean;
  setOpenProfileModal: (value: boolean) => void;
  isDailySubmitted: boolean;
  setDailySubmitted: (value: boolean) => void;
  openDailyModal: boolean;
  setOpenDailyModal: (value: boolean) => void;
  registros: Registro[];
  addRegistro: (registro: Registro) => void;
  isLoading: boolean; // Estado de carregamento
  setIsLoading: (value: boolean) => void; // Função de atualização
}

const ProfileContext = createContext<ProfileContextProps | undefined>(
  undefined,
);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isProfileSubmitted, setProfileSubmitted] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [isDailySubmitted, setDailySubmitted] = useState(false);
  const [openDailyModal, setOpenDailyModal] = useState(false);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Inicializando o estado de carregamento

  const addRegistro = (registro: Registro) => {
    setRegistros((prev) => [...prev, registro]);
  };

  const getIcon = (mood: string) => {
    switch (mood) {
      case 'Ótimo':
        return '😄';
      case 'Bom':
        return '😊';
      case 'Neutro':
        return '😐';
      case 'Ruim':
        return '😟';
      case 'Horrível':
        return '😢';
      default:
        return '😊';
    }
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true); // Inicia o carregamento
      try {
        const response = await axios.get<DailyResponse[]>(
          '/api/get-daily-responses',
        );
        const dataFromDB = response.data.map((item) => {
          const localDate = dayjs(item.date).format('DD/MM/YYYY');
          const localTime = item.time;

          return {
            data: localDate,
            hora: localTime,
            humor: item.overallMood,
            icone: getIcon(item.overallMood),
            categorias: [
              `Família: ${item.familyInteraction}`,
              `Amigos: ${item.friendsInteraction}`,
              `Exercício: ${item.physicalExercise}`,
              `Sono: ${item.sleepQuality}`,
              `Estresse: ${item.stressLevel}`,
            ],
            cor:
              item.overallMood === 'Ótimo'
                ? 'bg-teal-100 border-teal-500'
                : item.overallMood === 'Bom'
                ? 'bg-blue-100 border-blue-500'
                : item.overallMood === 'Neutro'
                ? 'bg-yellow-100 border-yellow-500'
                : item.overallMood === 'Ruim'
                ? 'bg-red-100 border-red-500'
                : 'bg-red-200 border-red-600',
          };
        });
        setRegistros(dataFromDB);
      } catch (error) {
        console.error('Erro ao buscar registros do banco:', error);
      } finally {
        setIsLoading(false); // Termina o carregamento
      }
    }
    fetchData();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        isProfileSubmitted,
        setProfileSubmitted,
        openProfileModal,
        setOpenProfileModal,
        isDailySubmitted,
        setDailySubmitted,
        openDailyModal,
        setOpenDailyModal,
        registros,
        addRegistro,
        isLoading,
        setIsLoading, // Passando a função de atualização
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
