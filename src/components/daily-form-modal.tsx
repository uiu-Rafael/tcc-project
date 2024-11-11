import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useProfile } from '@/context/profile-context'; // Importa o contexto
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ScrollShadow,
} from '@nextui-org/react';
import dayjs from 'dayjs';

interface DailyFormResponse {
  familyInteraction: string;
  friendsInteraction: string;
  physicalExercise: string;
  sleepQuality: string;
  stressLevel: string;
  overallMood: string;
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

  const handleInputChange = (field: keyof DailyFormResponse, value: string) => {
    setFormResponses((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (Object.values(formResponses).some((value) => value === '')) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (!selectedDate) {
      alert('Por favor, selecione uma data antes de enviar.');
      return;
    }

    const moodScore = calculateMoodScore();
    console.log('Calculated mood score:', moodScore); // Log the mood score
    const moodCategory = categorizeMood(moodScore); // Determine the mood category

    setFormResponses((prev) => ({
      ...prev,
      overallMood: moodCategory, // Ensure overallMood is set correctly
    }));

    // Set feedback for user display
    setFeedback(`Seu humor hoje está: ${moodCategory}`);

    try {
      const response = await axios.post(
        '/api/save-daily',
        {
          ...formResponses,
          moodScore,
          overallMood: moodCategory, // Aqui, certifique-se de que estamos passando o moodCategory corretamente
          date: selectedDate,
          time: selectedTime,
        },
        { headers: { 'Content-Type': 'application/json' } },
      );

      if (response.status === 201) {
        alert('Respostas salvas com sucesso!');
        const newRegistro = createRegistro(moodCategory);
        addRegistro(newRegistro);
        setOpenDailyModal(false);
      }
    } catch (error) {
      console.error('Erro ao salvar respostas:', error);
      alert('Ocorreu um erro ao salvar as respostas. Tente novamente.');
    }
  };

  const calculateMoodScore = () => {
    let score = 0;

    // Check profile data conditions
    if (profileData) {
      if (profileData['não pratiquei esportes nos últimos 6 meses'] > 0.5) {
        if (formResponses.physicalExercise === 'não') score -= 2; // Deducting if no exercise
      }
      if (profileData['tenho dificuldade em aceitar críticas'] > 0.5) {
        if (formResponses.stressLevel === 'alto') score -= 2; // Deducting for high stress
      }
      if (profileData['não organizo bem meu tempo'] > 0.5) {
        if (formResponses.overallMood === 'ruim') score -= 1; // Deducting for negative mood
      }
    }

    // Add scores based on positive responses
    if (formResponses.familyInteraction === 'bom') score += 2; // More points for 'Bom'
    if (formResponses.friendsInteraction === 'bom') score += 2; // More points for 'Bom'
    if (formResponses.sleepQuality === 'bom') score += 2; // More points for 'Bom'
    if (formResponses.physicalExercise === 'sim') score += 2; // Add points for exercising

    // If any interaction is neutral, we don't deduct points
    if (formResponses.familyInteraction === 'ruim') score -= 1; // Deducting for negative family interaction
    if (formResponses.friendsInteraction === 'ruim') score -= 1; // Deducting for negative friends interaction
    if (formResponses.sleepQuality === 'ruim') score -= 1; // Deducting for negative sleep quality

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
      ],
      cor, // Usa a cor definida acima
      icone,
    };
  };

  return (
    <ScrollShadow hideScrollBar className="w-[300px] h-[400px]">
      <Modal isOpen={openDailyModal} onClose={() => setOpenDailyModal(false)}>
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
                onChange={(e) =>
                  handleInputChange('stressLevel', e.target.value)
                }
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
                onChange={(e) =>
                  handleInputChange('overallMood', e.target.value)
                }
                className="w-full mt-2 p-2 border rounded"
              >
                <option value="">Selecione</option>
                <option value="bom">Bom</option>
                <option value="ruim">Ruim</option>
              </select>
            </div>

            {feedback && (
              <p className="mt-4 text-lg font-semibold">{feedback}</p>
            )}
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
      </Modal>
    </ScrollShadow>
  );
};

export default DailyFormModal;
