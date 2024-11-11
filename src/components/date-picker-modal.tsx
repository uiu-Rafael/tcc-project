// components/DatePickerModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import { Calendar } from '@nextui-org/react';
import { DateValue } from '@internationalized/date';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: string, time: string) => void; // Atualizado para enviar data e hora
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  onClose,
  onDateSelect,
}) => {
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      // Formata a data e hora no padrão dd/mm/yyyy HH:mm
      const formattedDate = `${selectedDate.toString()}`; // Formato ISO para incluir a hora
      const formattedTime = `${selectedTime.toString()}`;
      onDateSelect(formattedDate, formattedTime);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className="p-6 bg-white rounded-lg shadow-md">
        <ModalHeader>
          <h2 className="text-xl font-bold">Escolha uma data e hora</h2>
        </ModalHeader>
        <ModalBody>
          <Calendar
            aria-label="Selecionar Data"
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showMonthAndYearPickers
          />
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Selecionar Hora
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            disabled={!selectedDate || !selectedTime} // Desabilita se a data ou hora não estiverem selecionadas
          >
            OK
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DatePickerModal;
