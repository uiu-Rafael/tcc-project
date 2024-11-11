// src/components/EmotionalProfileModal.tsx

'use client';
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import { useState } from 'react';
import { GrLinkNext } from 'react-icons/gr';
import axios from 'axios';
import FormPage from '@/components/form-page';
import { formPagesData } from '@/data/form-pages-data';
import { useProfile } from '@/context/profile-context';

const EmotionalProfileModal: React.FC<{ isOpen?: boolean }> = () => {
  const { setProfileSubmitted, setOpenProfileModal } = useProfile();
  const [formData, setFormData] = useState<Record<string, number>>({});
  const [currentPage, setCurrentPage] = useState<number>(0);
  const totalPages = formPagesData.length;

  const handleChange = (question: string, value: number) => {
    setFormData((prev) => ({ ...prev, [question]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/api/save-profile', formData);
      setProfileSubmitted(true);
      setOpenProfileModal(false);
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
  };

  const goNext = () =>
    currentPage < totalPages - 1 && setCurrentPage((prev) => prev + 1);
  const goBack = () => currentPage > 0 && setCurrentPage((prev) => prev - 1);

  return (
    <Modal
      isOpen={true}
      onClose={() => setOpenProfileModal(false)}
      placement="bottom-center"
    >
      <ModalContent>
        <ModalBody>
          <FormPage {...formPagesData[currentPage]} onChange={handleChange} />
        </ModalBody>
        <ModalFooter className="flex justify-between items-center w-full mt-4">
          <button
            onClick={goBack}
            disabled={currentPage === 0}
            className={`p-2 text-lg rounded-full ${
              currentPage === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'animate-bounce'
            }`}
          >
            <GrLinkNext className="rotate-180" />
          </button>

          <div className="flex space-x-2">
            {[...Array(totalPages)].map((_, idx) => (
              <div
                key={idx}
                className={`h-3 w-3 rounded-full ${
                  idx === currentPage ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentPage === totalPages - 1 ? (
            <Button
              onClick={handleSubmit}
              className="p-2 bg-blue-500 text-white rounded-lg animate-bounce"
            >
              Enviar
            </Button>
          ) : (
            <button
              onClick={goNext}
              className={`p-2 text-lg rounded-full ${
                currentPage === totalPages - 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'animate-bounce'
              }`}
            >
              <GrLinkNext />
            </button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EmotionalProfileModal;
