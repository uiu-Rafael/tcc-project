import React from 'react';
import { Card } from '@nextui-org/react'; // Certifique-se de ter o Card importado
import Image from 'next/image';
import emotionalImg from '@/assets/emotional-profile.png';

interface EmotionalProfileProps {
  isPressable?: boolean;
  onPress?: () => void; // Adiciona a prop onPress para o evento de clique
}

const EmotionalProfile: React.FC<EmotionalProfileProps> = ({
  isPressable,
  onPress,
}) => {
  return (
    <Card isPressable={isPressable} onPress={onPress} className="p-4 mb-4">
      <h2 className="text-2xl font-bold mb-4 mx-auto">
        Faça o teste do seu perfil emocional!
      </h2>
      <div className=" mx-auto gap-6">
        <Image src={emotionalImg} alt="emotional profile" className="size-40" />
      </div>
    </Card>
  );
};

export default EmotionalProfile;
