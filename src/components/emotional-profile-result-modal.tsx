// components/EmotionalProfileResultModal.tsx
import React from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Progress,
} from '@nextui-org/react';

interface EmotionalProfileResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileScore: number;
  moodCategory: string;
}

const EmotionalProfileResultModal: React.FC<
  EmotionalProfileResultModalProps
> = ({ isOpen, onClose, profileScore, moodCategory }) => {
  const progressColor =
    moodCategory === 'Ótimo'
      ? 'from-teal-500'
      : moodCategory === 'Bom'
      ? 'from-blue-500'
      : moodCategory === 'Neutro'
      ? 'from-yellow-500'
      : moodCategory === 'Ruim'
      ? 'from-red-500'
      : 'from-red-600';

  return (
    <Modal placement="center" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h2>Resultado do Perfil Emocional</h2>
        </ModalHeader>
        <ModalBody>
          <Progress
            size="lg"
            value={profileScore}
            showValueLabel
            classNames={{
              track: 'bg-gray-200 border border-gray-300',
              indicator: `bg-gradient-to-r ${progressColor} to-transparent`,
              label: 'text-default-600',
              value: 'text-foreground/60',
            }}
            label={`Perfil Emocional: ${moodCategory}`}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EmotionalProfileResultModal;
