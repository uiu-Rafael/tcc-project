'use client';
import { Button } from '@nextui-org/react';
import { useRouter, usePathname } from 'next/navigation';
import { PiAddressBook } from 'react-icons/pi';
import { VscGraph } from 'react-icons/vsc';
import { IoCalendarOutline } from 'react-icons/io5';

export default function Navigation() {
  const router = useRouter(); // Obtém o objeto de roteamento
  const pathname = usePathname(); // Obtém o pathname atual

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 flex justify-between items-center shadow-top-only">
      <Button
        color="primary"
        variant="light"
        className={`relative flex flex-col items-center size-max p-6 ${
          pathname === '/' ? 'text-teal-500 font-bold' : 'text-gray-500'
        }`}
        onClick={() => router.push('/')}
      >
        <PiAddressBook className="absolute top-1/4 transform -translate-y-1/2 w-10 h-10" />
        <span className="mt-8 text-sm">Registros</span>
      </Button>

      <Button
        color="primary"
        variant="light"
        className={`relative flex flex-col items-center p-6 ${
          pathname === '/statistic'
            ? 'text-teal-500 font-bold'
            : 'text-gray-500'
        }`}
        onClick={() => router.push('/statistic')}
      >
        <VscGraph className="absolute top-1/4 transform -translate-y-1/2 w-10 h-10" />
        <span className="mt-8 text-sm">Estatística</span>
      </Button>

      <Button
        color="primary"
        variant="light"
        className={`relative flex flex-col items-center p-6 ${
          pathname === '/calendar' ? 'text-teal-500 font-bold' : 'text-gray-500'
        }`}
        onClick={() => router.push('/calendar')}
      >
        <IoCalendarOutline className="absolute top-1/4 transform -translate-y-1/2 w-10 h-10" />
        <span className="mt-8 text-sm">Calendário</span>
      </Button>
    </div>
  );
}
