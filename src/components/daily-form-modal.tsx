/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useProfile } from '@/context/profile-context'; // Importa o contexto
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import dayjs from 'dayjs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DailyFormResponse {
  familyInteraction: string;
  friendsInteraction: string;
  physicalExercise: string;
  sleepQuality: string;
  stressLevel: string;
  overallMood: string;
  studyHabits: string; // Nova categoria
  studyAssimilation: string;
  studyTime: string;
  academicFeeling: string;
}

interface DailyFormModalProps {
  selectedDate: string | null;
  selectedTime: string;
}

interface ProfileData {
  [key: string]: number;
}

const DailyFormModal: React.FC<DailyFormModalProps> = ({
  selectedDate,
  selectedTime,
}) => {
  const { addRegistro, openDailyModal, setOpenDailyModal } = useProfile(); // Integração com contexto

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [formResponses, setFormResponses] = useState<DailyFormResponse>({
    familyInteraction: '',
    friendsInteraction: '',
    physicalExercise: '',
    sleepQuality: '',
    stressLevel: '',
    overallMood: '',
    studyHabits: '',
    studyAssimilation: '',
    studyTime: '',
    academicFeeling: '',
  });

  const [feedback, setFeedback] = useState<string | null>(null);

  // Busca dados do perfil
  useEffect(() => {
    async function fetchProfileData() {
      try {
        const response = await axios.get('/api/get-profile');
        console.log('Resposta da API:', response.data);
        setProfileData(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados do perfil:', error);
      }
    }
    fetchProfileData();
  }, []);

  // useEffect para calcular studyHabits
  useEffect(() => {
    const { studyAssimilation, studyTime, academicFeeling } = formResponses;

    // Verifica se todos os campos necessários estão preenchidos
    if (studyAssimilation && studyTime && academicFeeling) {
      const studyAnswers = [studyAssimilation, studyTime, academicFeeling];

      // Atualiza studyHabits com base nas respostas
      if (studyAnswers.every((answer) => answer === 'bom')) {
        setFormResponses((prev) => ({ ...prev, studyHabits: 'bom' }));
      } else if (studyAnswers.some((answer) => answer === 'ruim')) {
        setFormResponses((prev) => ({ ...prev, studyHabits: 'ruim' }));
      } else {
        setFormResponses((prev) => ({ ...prev, studyHabits: 'neutro' }));
      }
    }
  }, [
    formResponses.studyAssimilation,
    formResponses.studyTime,
    formResponses.academicFeeling,
  ]);

  const handleInputChange = (field: keyof DailyFormResponse, value: string) => {
    setFormResponses((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Verifica se todos os campos estão preenchidos
    if (Object.values(formResponses).some((value) => value === '')) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    if (!selectedDate) {
      toast.error('Por favor, selecione uma data antes de enviar.');
      return;
    }

    const moodScore = calculateMoodScore(formResponses); // Calcula o humor
    const moodCategory = categorizeMood(moodScore); // Categoriza o humor

    // Atualiza o humor geral nas respostas
    const updatedResponses = { ...formResponses, overallMood: moodCategory };

    // Gerencia a Promise com toast.promise
    await toast.promise(
      axios.post(
        '/api/save-daily',
        {
          ...updatedResponses,
          moodScore,
          date: selectedDate,
          time: selectedTime,
        },
        { headers: { 'Content-Type': 'application/json' } },
      ),
      {
        pending: 'Salvando suas respostas... ⏳',
        success: {
          render() {
            // Adiciona o registro e fecha o modal ao salvar com sucesso
            const newRegistro = createRegistro(moodCategory);
            addRegistro(newRegistro);

            // Aguarda 5 segundos antes de fechar o modal
            setTimeout(() => {
              setOpenDailyModal(false);
            }, 5000);

            return `Respostas salvas com sucesso! Seu humor hoje está: ${moodCategory} `;
          },
          icon: <span>✅</span>, // Ícone de sucesso customizado
        },
        error: {
          render({ data }) {
            console.error('Erro ao salvar respostas:', data);
            return 'Ocorreu um erro ao salvar as respostas. Tente novamente.';
          },
          icon: <span>❌</span>, // Ícone de erro customizado
        },
      },
    );
  };

  const calculateMoodScore = (responses: DailyFormResponse) => {
    let score = 0;

    // Check profile data conditions
    if (profileData) {
      // Ajustes baseados no perfil
      if (profileData['Pessimista'] < 0.5) {
        if (responses.overallMood === 'ruim') score -= 2;
      }
      if (profileData['Desmotivado'] < 0.5) {
        if (responses.physicalExercise === 'não') score -= 2;
      }
      if (profileData['Ansioso'] < 0.5) {
        if (responses.stressLevel === 'alto') score -= 2;
      }
      if (profileData['Lido mal com pressão'] < 0.5) {
        if (responses.stressLevel === 'alto') score -= 2;
      }
      if (profileData['Sou sensível a críticas'] < 0.5) {
        if (responses.stressLevel === 'alto') score -= 1;
      }
      if (profileData['Impaciente'] < 0.5) {
        if (responses.stressLevel === 'alto') score -= 1;
      }
      if (profileData['Encontro soluções com dificuldade'] < 0.5) {
        if (responses.overallMood === 'ruim') score -= 2;
      }

      // Aumentar a pontuação em caso de respostas positivas e características baixas
      if (profileData['Desmotivado'] >= 0.5) {
        if (responses.physicalExercise === 'sim') score += 2;
      }
      if (profileData['Pessimista'] >= 0.5) {
        if (
          responses.overallMood === 'bom' ||
          responses.overallMood === 'ótimo'
        )
          score += 2;
      }
    }

    // Add scores based on positive responses
    if (responses.familyInteraction === 'bom') score += 2; // More points for 'Bom'
    if (responses.friendsInteraction === 'bom') score += 2; // More points for 'Bom'
    if (responses.sleepQuality === 'bom') score += 2; // More points for 'Bom'
    if (responses.physicalExercise === 'sim') score += 2; // Add points for exercising

    // If any interaction is neutral, we don't deduct points
    if (responses.familyInteraction === 'ruim') score -= 1; // Deducting for negative family interaction
    if (responses.friendsInteraction === 'ruim') score -= 1; // Deducting for negative friends interaction
    if (responses.sleepQuality === 'ruim') score -= 1; // Deducting for negative sleep quality
    if (responses.studyHabits === 'bom') score += 2;
    if (responses.studyHabits === 'ruim') score -= 1;

    return score;
  };

  const categorizeMood = (score: number) => {
    if (score >= 6) return 'Ótimo'; // Changed to ensure that more positive scoring captures 'Ótimo'
    if (score >= 3) return 'Bom';
    if (score >= 1) return 'Neutro';
    if (score === -1) return 'Ruim';
    return 'Horrível';
  };

  const createRegistro = (
    moodCategory: 'Ótimo' | 'Bom' | 'Neutro' | 'Ruim' | 'Horrível',
  ) => {
    const date = selectedDate;
    const time = selectedTime;
    const localDate = dayjs(date).format('DD/MM/YYYY'); // Formato desejado
    const localTime = time; // Formato de horário desejado (24 horas)

    // Define os ícones para cada categoria de humor
    const iconeMap: {
      [key in 'Ótimo' | 'Bom' | 'Neutro' | 'Ruim' | 'Horrível']: string;
    } = {
      Ótimo: '😄',
      Bom: '😊',
      Neutro: '😐',
      Ruim: '😟',
      Horrível: '😢',
    };

    const icone = iconeMap[moodCategory]; // Acessa o ícone diretamente

    // Define a cor baseada no moodCategory
    const cor =
      moodCategory === 'Ótimo'
        ? 'bg-teal-100 border-teal-500' // Cor para "Ótimo"
        : moodCategory === 'Bom'
        ? 'bg-blue-100 border-blue-500' // Cor para "Bom"
        : moodCategory === 'Neutro'
        ? 'bg-yellow-100 border-yellow-500' // Cor para "Neutro"
        : moodCategory === 'Ruim'
        ? 'bg-red-100 border-red-500' // Cor para "Ruim"
        : 'bg-red-200 border-red-600'; // Cor para "Horrível"

    return {
      data: localDate,
      humor: moodCategory,
      hora: localTime,
      categorias: [
        `Família: ${formResponses.familyInteraction}`,
        `Amigos: ${formResponses.friendsInteraction}`,
        `Exercícios: ${formResponses.physicalExercise}`,
        `Sono: ${formResponses.sleepQuality}`,
        `Estresse: ${formResponses.stressLevel}`,
        `Estudo: ${formResponses.studyHabits}`,
      ],

      cor, // Usa a cor definida acima
      icone,
    };
  };

  return (
    <Modal
      isOpen={openDailyModal}
      onClose={() => setOpenDailyModal(false)}
      className="max-w-[95vw] max-h-[90vh] p-4"
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent className="p-6 bg-white rounded-lg shadow-md">
        <ModalHeader>
          <h2 className="text-xl font-bold">Como você está hoje?</h2>
        </ModalHeader>

        <ModalBody>
          {/* Campos do formulário */}
          <div className="mb-4">
            <label>
              Como você se sentiu ao interagir com sua família hoje?
            </label>
            <select
              value={formResponses.familyInteraction}
              onChange={(e) =>
                handleInputChange('familyInteraction', e.target.value)
              }
              className="w-full mt-2 p-2 border rounded"
            >
              <option value="">Selecione</option>
              <option value="bom">Bom</option>
              <option value="ruim">Ruim</option>
            </select>
          </div>

          <div className="mb-4">
            <label>
              Como você se sentiu ao conversar com seus amigos hoje?
            </label>
            <select
              value={formResponses.friendsInteraction}
              onChange={(e) =>
                handleInputChange('friendsInteraction', e.target.value)
              }
              className="w-full mt-2 p-2 border rounded"
            >
              <option value="">Selecione</option>
              <option value="bom">Bom</option>
              <option value="ruim">Ruim</option>
            </select>
          </div>

          <div className="mb-4">
            <label>Você fez exercícios físicos hoje?</label>
            <select
              value={formResponses.physicalExercise}
              onChange={(e) =>
                handleInputChange('physicalExercise', e.target.value)
              }
              className="w-full mt-2 p-2 border rounded"
            >
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="não">Não</option>
              <option value="parcial">Parcialmente</option>
            </select>
          </div>

          <div className="mb-4">
            <label>Como foi sua qualidade de sono hoje?</label>
            <select
              value={formResponses.sleepQuality}
              onChange={(e) =>
                handleInputChange('sleepQuality', e.target.value)
              }
              className="w-full mt-2 p-2 border rounded"
            >
              <option value="">Selecione</option>
              <option value="bom">Bom</option>
              <option value="ruim">Ruim</option>
            </select>
          </div>

          <div className="mb-4">
            <label>Qual foi seu nível de estresse hoje?</label>
            <select
              value={formResponses.stressLevel}
              onChange={(e) => handleInputChange('stressLevel', e.target.value)}
              className="w-full mt-2 p-2 border rounded"
            >
              <option value="">Selecione</option>
              <option value="baixo">Baixo</option>
              <option value="moderado">Moderado</option>
              <option value="alto">Alto</option>
            </select>
          </div>

          <div className="mb-4">
            <label>Como você avaliaria seu humor geral hoje?</label>
            <select
              value={formResponses.overallMood}
              onChange={(e) => handleInputChange('overallMood', e.target.value)}
              className="w-full mt-2 p-2 border rounded"
            >
              <option value="">Selecione</option>
              <option value="bom">Bom</option>
              <option value="ruim">Ruim</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="studyAssimilation" className="block text-sm">
              Você assimilou bem os conteúdos das aulas de hoje?
            </label>
            <select
              id="studyAssimilation"
              value={formResponses.studyAssimilation}
              onChange={(e) =>
                handleInputChange('studyAssimilation', e.target.value)
              }
              className="w-full p-2 mt-2 border rounded"
            >
              <option value="">Selecione</option>
              <option value="bom">Sim</option>
              <option value="neutro">Neutro</option>
              <option value="ruim">Não</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="studyTime" className="block text-sm">
              Você conseguiu estudar hoje?
            </label>
            <select
              id="studyTime"
              value={formResponses.studyTime}
              onChange={(e) => handleInputChange('studyTime', e.target.value)}
              className="w-full p-2 mt-2 border rounded"
            >
              <option value="">Selecione</option>
              <option value="bom">Sim</option>
              <option value="neutro">Neutro</option>
              <option value="ruim">Não</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="academicFeeling" className="block text-sm">
              Como você está se sentindo no seu meio acadêmico?
            </label>
            <select
              id="academicFeeling"
              value={formResponses.academicFeeling}
              onChange={(e) =>
                handleInputChange('academicFeeling', e.target.value)
              }
              className="w-full p-2 mt-2 border rounded"
            >
              <option value="">Selecione</option>
              <option value="bom">Bem</option>
              <option value="neutro">Neutro</option>
              <option value="ruim">Ruim</option>
            </select>
          </div>

          {feedback && <p className="mt-4 text-lg font-semibold">{feedback}</p>}
        </ModalBody>

        <ModalFooter>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Enviar
          </button>
          <button
            onClick={() => setOpenDailyModal(false)}
            className="ml-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Fechar
          </button>
        </ModalFooter>
      </ModalContent>
      <ToastContainer />
    </Modal>
  );
};

export default DailyFormModal;
