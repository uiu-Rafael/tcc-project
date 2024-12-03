// src/components/EmotionalScoreDisplay.tsx

'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgress } from '@nextui-org/react';

const EmotionalScoreDisplay: React.FC<{
  score: number;
  onClose: () => void;
}> = ({ score, onClose }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
        onClick={onClose}
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.5, transition: { duration: 0.2 } }}
      >
        <motion.div
          layout
          className="w-[240px] h-[240px] flex flex-col justify-center items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-md"
          onClick={(e) => e.stopPropagation()} // Prevent click event from propagating to parent div
        >
          <div className="text-white/90 text-large font-bold">
            Nota do Perfil Emocional:
          </div>
          <CircularProgress
            classNames={{
              svg: 'w-36 h-36 drop-shadow-md',
              indicator: 'stroke-white',
              track: 'stroke-white/10',
              value: 'text-3xl font-semibold text-white',
            }}
            maxValue={10}
            formatOptions={{ style: 'decimal', maximumFractionDigits: 1 }}
            value={score}
            strokeWidth={4}
            showValueLabel={true}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmotionalScoreDisplay;
