/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useForm } from 'react-hook-form';
import axios from 'axios';
import FormPage from '@/components/form-page';
import { formPagesData } from '@/data/form-pages-data';
import { useProfile } from '@/context/profile-context';
import EmotionalScoreDisplay from './emotional-score-display';

const EmotionalProfileModal: React.FC<{ isOpen?: boolean }> = () => {
  const { setProfileSubmitted, setOpenProfileModal } = useProfile();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [emotionalScore, setEmotionalScore] = useState<number | null>(null);
  const { setEmotionalProfileScore, setMoodCategory } = useProfile();
  const totalPages = formPagesData.length;

  const { register, setValue, watch, handleSubmit } = useForm({
    defaultValues: formPagesData.reduce((acc, page) => {
      page.questions.forEach((q) => {
        acc[q.label] = 0; // Valor padrão para todos os sliders
      });
      return acc;
    }, {} as Record<string, number>),
  });

  const formData = watch();

  const calculateScore = (): number => {
    let totalScore = 0;
    const maxScore = formPagesData.reduce(
      (acc, page) => acc + page.questions.length,
      0,
    );

    Object.values(formData).forEach((value) => {
      totalScore += value;
    });

    const normalizedScore = (totalScore / maxScore) * 10;
    setEmotionalScore(normalizedScore);
    determineMoodCategory(normalizedScore);
    return normalizedScore;
  };

  const determineMoodCategory = (score: number) => {
    const category =
      score >= 8
        ? 'Ótimo'
        : score >= 6
        ? 'Bom'
        : score >= 4
        ? 'Neutro'
        : score >= 2
        ? 'Ruim'
        : 'Horrível';

    setMoodCategory(category);
    setEmotionalProfileScore(score);
  };

  const goNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const onSubmit = async () => {
    const calculatedScore = calculateScore();
    try {
      await axios.post('/api/save-profile', {
        formData,
        score: calculatedScore,
      });
      setProfileSubmitted(true);
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
  };

  const handleClose = () => {
    setOpenProfileModal(false);
    setEmotionalScore(null);
  };

  return (
    <>
      {emotionalScore === null ? (
        <Modal isOpen={true} onClose={handleClose} placement="center">
          <ModalContent>
            <ModalBody>
              <FormPage
                {...formPagesData[currentPage]}
                onChange={(question, value) => setValue(question, value)}
                currentValues={formData}
              />
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
                  onClick={handleSubmit(onSubmit)}
                  className="p-2 bg-blue-500 text-white rounded-lg"
                >
                  Enviar
                </Button>
              ) : (
                <button
                  onClick={goNext}
                  className="p-2 text-lg rounded-full animate-bounce"
                >
                  <GrLinkNext />
                </button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : (
        <EmotionalScoreDisplay score={emotionalScore} onClose={handleClose} />
      )}
    </>
  );
};

export default EmotionalProfileModal;
