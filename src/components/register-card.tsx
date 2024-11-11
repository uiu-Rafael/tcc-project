import React from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';

type Registro = {
  data: string;
  humor: string;
  hora: string;
  icone: React.ReactNode;
  categorias: (string | React.ReactNode)[];
  cor: string;
};

interface RegisterCardProps {
  registro: Registro;
  isPressable?: boolean;
}

const RegisterCard: React.FC<RegisterCardProps> = ({
  registro,
  isPressable,
}) => {
  return (
    <Card
      shadow="md"
      radius="lg"
      className={`p-6 ${registro.cor}`}
      isPressable={isPressable}
    >
      <CardHeader className="flex items-center gap-4 mb-4">
        {registro.icone}
        <div>
          <h2 className="text-xl font-semibold">{registro.humor}</h2>
          <p className="text-gray-600">
            {registro.data} • {registro.hora}
          </p>
        </div>
      </CardHeader>
      <CardBody className="flex flex-wrap gap-4">
        {registro.categorias.map((categoria, i) => (
          <span
            key={`categoria-${i}`}
            className="flex items-center gap-1 text-gray-700"
          >
            {typeof categoria === 'string' ? (
              <span>• {categoria}</span>
            ) : (
              categoria
            )}
          </span>
        ))}
      </CardBody>
    </Card>
  );
};

export default RegisterCard;
