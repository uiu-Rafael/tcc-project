'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  format,
  startOfMonth,
  startOfDay,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  getDay,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Card,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';

interface MoodData {
  date: string;
  overallMood: 'Ótimo' | 'Bom' | 'Neutro' | 'Ruim' | 'Horrível'; // Modificado para usar 'overallMood'
}

// Função que categoriza o humor com base em `overallMood`
const categorizeMood = (
  overallMood: 'Ótimo' | 'Bom' | 'Neutro' | 'Ruim' | 'Horrível',
) => {
  switch (overallMood) {
    case 'Ótimo':
      return { mood: 'Ótimo', color: 'bg-teal-100 text-teal-500', icon: '😊' };
    case 'Bom':
      return { mood: 'Bom', color: 'bg-blue-100 text-blue-500', icon: '🙂' };
    case 'Neutro':
      return {
        mood: 'Neutro',
        color: 'bg-yellow-100 text-yellow-500',
        icon: '😐',
      };
    case 'Ruim':
      return { mood: 'Ruim', color: 'bg-red-100 text-red-500', icon: '😟' };
    case 'Horrível':
      return { mood: 'Horrível', color: 'bg-red-200 text-red-600', icon: '😢' };
    default:
      return { mood: '', color: 'bg-gray-100', icon: '' };
  }
};

const Calendar: React.FC = () => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);

  useEffect(() => {
    const fetchMoodDataForMonth = async () => {
      try {
        const monthStart = format(startOfMonth(selectedMonth), 'yyyy-MM-dd');
        const monthEnd = format(endOfMonth(selectedMonth), 'yyyy-MM-dd');

        const response = await axios.get<MoodData[]>(
          '/api/get-daily-responses',
          {
            params: { startDate: monthStart, endDate: monthEnd },
          },
        );

        // Validar os dados de humor recebidos
        const validatedData = response.data.map((entry) => ({
          ...entry,
          overallMood: entry.overallMood, // Garantir que o overallMood seja o valor correto
        }));

        setMoodData(validatedData);
        console.log('Dados de humor:', validatedData);
      } catch (error) {
        console.error('Erro ao buscar dados de humor:', error);
      }
    };

    fetchMoodDataForMonth();
  }, [selectedMonth]); // Chama a função toda vez que selectedMonth mudar

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth),
  });

  // Lógica para pegar o mood e exibir o ícone e cor baseados no overallMood
  const getMoodForDate = (date: Date) => {
    const dateString = format(startOfDay(date), 'yyyy-MM-dd');
    const moodEntry = moodData.find((entry) => entry.date === dateString);

    // Se não houver overallMood, retornar um valor default
    if (!moodEntry) return { mood: '', color: 'bg-gray-100', icon: '' };
    console.log(moodEntry.overallMood);

    const { mood, color, icon } = categorizeMood(moodEntry.overallMood);

    return { mood, color, icon };
  };

  const handlePreviousMonth = () => {
    setSelectedMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => addMonths(prev, 1));
  };

  const openMonthModal = () => setIsMonthModalOpen(true);
  const closeMonthModal = () => setIsMonthModalOpen(false);

  const handleSelectMonth = (monthOffset: number) => {
    setSelectedMonth(addMonths(new Date(), monthOffset));
    closeMonthModal();
  };

  const firstDayOfWeek = getDay(startOfMonth(selectedMonth));

  return (
    <div className="min-h-screen mx-container pt-6">
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Button
            onClick={handlePreviousMonth}
            className="text-lg font-semibold bg-white"
          >
            Anterior
          </Button>
          <Button
            onClick={openMonthModal}
            className="text-lg font-semibold cursor-pointer bg-white"
          >
            {format(selectedMonth, 'MMMM yyyy', { locale: ptBR }).replace(
              /^\w/,
              (c) => c.toUpperCase(),
            )}
          </Button>
          <Button
            onClick={handleNextMonth}
            className="text-lg font-semibold bg-white"
          >
            Próximo
          </Button>
        </div>

        <div className="grid grid-cols-7 text-center text-gray-500 font-semibold mb-2">
          {['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'].map(
            (day) => (
              <div key={day}>{day}</div>
            ),
          )}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="w-10 h-10"></div>
          ))}
          {daysInMonth.map((day) => {
            const { color, icon } = getMoodForDate(day);

            return (
              <div
                key={day.toString()}
                className={`w-10 h-10 rounded-full flex flex-col items-center justify-center ${color}`}
              >
                <span className="text-xs">{format(day, 'd')}</span>
                <span>{icon}</span>
              </div>
            );
          })}
        </div>

        <Modal
          isOpen={isMonthModalOpen}
          onClose={closeMonthModal}
          placement="center"
        >
          <ModalContent>
            <ModalHeader>Selecionar Mês</ModalHeader>
            <ModalBody className="grid grid-cols-3 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Button
                  key={i}
                  onClick={() => handleSelectMonth(i - 6)}
                  className="p-2 border rounded-md text-center text-white font-semibold hover:bg-gray-200"
                  color="secondary"
                >
                  {format(addMonths(new Date(), i - 6), 'MMMM yyyy', {
                    locale: ptBR,
                  }).replace(/^\w/, (c) => c.toUpperCase())}
                </Button>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={closeMonthModal}
                className="text-white font-semibold"
                color="primary"
              >
                Fechar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>
    </div>
  );
};

export default Calendar;
