'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardBody } from '@nextui-org/react';

interface DailyResponse {
  date: string; // Formato: dd/mm/yyyy
  overallMood: 'Ótimo' | 'Bom' | 'Neutro' | 'Ruim' | 'Horrível';
}

interface MoodData {
  date: string;
  moodScore: number;
  originalDate: string; // Data original para ordenação
}

// Função para converter `overallMood` em emoji
const categorizeMoodIcon = (
  overallMood: 'Ótimo' | 'Bom' | 'Neutro' | 'Ruim' | 'Horrível',
): string => {
  switch (overallMood) {
    case 'Ótimo':
      return '😊';
    case 'Bom':
      return '🙂';
    case 'Neutro':
      return '😐';
    case 'Ruim':
      return '😟';
    case 'Horrível':
      return '😢';
    default:
      return '';
  }
};

// Função para mapear `overallMood` para um valor numérico de humor
const moodToScore = (
  overallMood: 'Ótimo' | 'Bom' | 'Neutro' | 'Ruim' | 'Horrível',
): number => {
  switch (overallMood) {
    case 'Ótimo':
      return 4;
    case 'Bom':
      return 3;
    case 'Neutro':
      return 2;
    case 'Ruim':
      return 1;
    case 'Horrível':
      return 0;
    default:
      return -1;
  }
};

// Função para formatar a data para `dd/mm/yyyy`, mas exibir apenas `dd/mm` em telas pequenas
const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-'); // Ajuste se necessário

  // Verifica a largura da tela e formata a data de acordo
  const isSmallScreen = window.innerWidth <= 500;

  return isSmallScreen
    ? `${day}/${month}` // Apenas dia e mês
    : `${day}/${month}/${year}`; // Dia, mês e ano
};

// // Função para converter a data para objeto Date para ordenação
// const convertToDateObject = (dateString: string) => {
//   const [day, month, year] = dateString.split('/');
//   return new Date(Number(year), Number(month) - 1, Number(day));
// };

const Statistic: React.FC = () => {
  const [data, setData] = useState<MoodData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<DailyResponse[]>(
          '/api/get-daily-responses',
        );
        const formattedData = response.data.map((entry) => ({
          date: formatDate(entry.date),
          moodScore: moodToScore(entry.overallMood), // Converte para valor numérico
          originalDate: entry.date, // Mantém a data original para ordenação
        }));

        // Ordenação manual da data antes de armazenar no estado
        const sortedData = formattedData.sort((a, b) => {
          // Comparar as datas originais (yyyy-mm-dd) para ordenação
          const dateA = new Date(a.originalDate);
          const dateB = new Date(b.originalDate);
          return dateA.getTime() - dateB.getTime();
        });

        // Verifica se as datas estão sendo corretamente ordenadas
        console.log(sortedData); // Debug

        setData(sortedData);
      } catch (error) {
        console.error('Error fetching mood data:', error);
      }
    };

    fetchData();
  }, []);

  const moodCategories: ('Horrível' | 'Ruim' | 'Neutro' | 'Bom' | 'Ótimo')[] = [
    'Horrível',
    'Ruim',
    'Neutro',
    'Bom',
    'Ótimo',
  ];

  return (
    <div className="flex justify-center min-h-screen mx-container">
      <Card className="w-full h-max mt-5">
        <CardBody>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00DBAD" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00DBAD" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval="preserveEnd"
              />
              <YAxis
                tickFormatter={(value) =>
                  categorizeMoodIcon(moodCategories[value])
                }
                ticks={[0, 1, 2, 3, 4]} // Emojis para cada nível de humor
                domain={[0, 4]}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Area
                type="monotone"
                dataKey="moodScore" // Definido para o valor numérico
                stroke="#00DBAD"
                fillOpacity={1}
                fill="url(#colorMood)"
                name="Avaliação do Humor"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  );
};

export default Statistic;
