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
  date: string; // Format: dd/mm/yyyy
  moodScore: number; // Mood score ranging from 0 to 4
}

interface MoodData {
  date: string;
  moodScore: number;
}

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
          moodScore: entry.moodScore,
        }));
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching mood data:', error);
      }
    };

    fetchData();
  }, []);

  // Map mood scores to emojis
  const moodScoreToEmoji = (score: number) => {
    switch (score) {
      case 4:
        return '😄'; // Ótimo
      case 3:
        return '🙂'; // Bom
      case 2:
        return '😐'; // Neutro
      case 1:
        return '😟'; // Ruim
      case 0:
        return '😩'; // Horrível
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: window.innerWidth > 600 ? 'numeric' : undefined,
    });
  };

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
                tickFormatter={moodScoreToEmoji} // Custom tick formatter for emojis
                domain={[0, 4]} // Set domain to match mood score range
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Area
                type="monotone"
                dataKey="moodScore"
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
