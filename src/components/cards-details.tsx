import { useProfile } from '@/context/profile-context';
import { CircularProgress } from '@nextui-org/react';

const CardsDetails: React.FC = () => {
  const { registros, isLoading } = useProfile(); // Supondo que isLoading seja também parte do contexto
  const noData = registros.length === 0; // Verifica se não há dados após o carregamento

  return (
    <div className="relative">
      {/* Exibe o CircularProgress enquanto os dados estão sendo carregados */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <CircularProgress
            size="lg"
            color="secondary"
            aria-label="Carregando..."
          />
        </div>
      )}

      {/* Se não houver dados, exibe uma mensagem */}
      {!isLoading && noData && (
        <div className="text-center text-color4 font-bold mt-24">
          <h1>Não há registros disponíveis.</h1>
        </div>
      )}

      {/* Exibe os registros quando disponíveis */}
      {!isLoading && !noData && (
        <div className="space-y-8">
          {registros.map((registro, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl shadow-md border-2 ${registro.cor}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{registro.icone}</div>
                <div>
                  <h2 className="text-xl font-semibold">{registro.humor}</h2>
                  <p className="text-gray-600">
                    {registro.data} • {registro.hora}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {registro.categorias.map((categoria, i) => (
                  <span key={i} className="text-gray-700">
                    • {categoria}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardsDetails;
