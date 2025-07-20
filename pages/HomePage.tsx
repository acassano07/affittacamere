import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import CalendarView from '../components/CalendarView';
import BookingModal from '../components/BookingModal';
import { PlusCircle } from 'lucide-react';
import { Booking } from '../types';

const HomePage: React.FC = () => {
  const { bookings, closures } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [defaultDate, setDefaultDate] = useState<Date | null>(null);

  const handleOpenModal = (booking: Booking | null = null) => {
    setSelectedBooking(booking);
    setDefaultDate(null); // Reset default date when editing or using FAB
    setIsModalOpen(true);
  };
  
  const handleSelectDate = (date: Date) => {
    setSelectedBooking(null);
    setDefaultDate(date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
    setDefaultDate(null);
    setIsModalOpen(false);
  };
  
  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
      <div className="flex-grow">
          <CalendarView 
              bookings={bookings} 
              closures={closures}
              onSelectBooking={handleOpenModal}
              onSelectDate={handleSelectDate}
          />
      </div>
      <button
        onClick={() => handleOpenModal()}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105 z-20"
        aria-label="Nuova Prenotazione"
      >
        <PlusCircle size={28} />
      </button>
      <BookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        booking={selectedBooking}
        defaultDate={defaultDate}
      />
    </div>
  );
};

export default HomePage;