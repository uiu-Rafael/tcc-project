'use client';
import { Slider } from '@nextui-org/react';

interface FormPageProps {
  title: string;
  questions: { label: string; opposite: string }[];
  onChange: (question: string, value: number) => void;
}

const FormPage: React.FC<FormPageProps> = ({ title, questions, onChange }) => (
  <div className="items-center">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <div className="grid gap-4">
      {questions.map((q, idx) => (
        <div key={idx} className="w-full">
          <div className="flex justify-between mb-2 text-sm text-gray-700">
            <span>{q.label}</span>
            <span>{q.opposite}</span>
          </div>
          <Slider
            size="lg"
            step={0.1}
            maxValue={1}
            minValue={0}
            defaultValue={0}
            onChange={(value) => onChange(q.label, value as number)}
            className="max-w-md"
          />
        </div>
      ))}
    </div>
  </div>
);

export default FormPage;
