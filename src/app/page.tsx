'use client';
import React, { useState } from 'react';
import EmotionalProfileModal from '@/components/emotional-profile-modal';
import EmotionalProfile from '@/components/emotional-profile-card';
import HumorSelector from '@/components/humor-option';
import { useProfile } from '@/context/profile-context';
import CardsDetails from '@/components/cards-details';
import DailyFormModal from '@/components/daily-form-modal';
import DatePickerModal from '@/components/date-picker-modal';
import { Button } from '@nextui-org/react';

export default function Home() {
  const {
    isProfileSubmitted,
    openProfileModal,
    setOpenProfileModal,
    openDailyModal,
    setOpenDailyModal,
  } = useProfile();

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const openProfileFormModal = () => setOpenProfileModal(true);
  const openDailyFormModal = () => setOpenDailyModal(true);

  const handleDateSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setIsDatePickerOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 mb-14">
      <Button
        className="w-full mb-6 text-section2"
        color="secondary"
        onClick={() => setIsDatePickerOpen(true)}
      >
        <h1 className="text-center text-2xl font-bold">
          {selectedDate || 'Selecione uma data!'}
        </h1>
      </Button>

      {!isProfileSubmitted ? (
        <div onClick={openProfileFormModal}>
          <EmotionalProfile isPressable={true} onPress={openProfileFormModal} />
        </div>
      ) : (
        <div onClick={openDailyFormModal}>
          <HumorSelector isPressable={true} onPress={openDailyFormModal} />
        </div>
      )}

      {openProfileModal && <EmotionalProfileModal />}
      {openDailyModal && (
        <DailyFormModal
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />
      )}
      {isDatePickerOpen && (
        <DatePickerModal
          isOpen={isDatePickerOpen}
          onClose={() => setIsDatePickerOpen(false)}
          onDateSelect={handleDateSelect}
        />
      )}

      <CardsDetails />
    </div>
  );
}
