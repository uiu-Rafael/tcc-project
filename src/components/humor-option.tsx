import React from 'react';
import { Card } from '@nextui-org/react';

const humorOptions = [
  { label: 'radical', emoji: '😄', color: 'text-teal-500' },
  { label: 'bem', emoji: '😊', color: 'text-green-500' },
  { label: 'mais ou menos', emoji: '😐', color: 'text-blue-400' },
  { label: 'mal', emoji: '☹️', color: 'text-orange-400' },
  { label: 'horrível', emoji: '😢', color: 'text-red-500' },
];

interface HumorSelectorProps {
  isPressable?: boolean;
  onPress?: () => void;
}

const HumorSelector: React.FC<HumorSelectorProps> = ({
  isPressable,
  onPress,
}) => {
  return (
    <Card isPressable={isPressable} onPress={onPress} className="p-4 mb-4">
      <h2 className="text-2xl font-bold mb-4 mx-auto">Como você está?</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {humorOptions.map((option, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-full ${option.color}`}
            >
              <span className="text-4xl">{option.emoji}</span>
            </div>
            <span className={`text-sm font-semibold ${option.color}`}>
              {option.label}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default HumorSelector;
