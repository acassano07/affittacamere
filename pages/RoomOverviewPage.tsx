import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { ROOMS } from '../constants';
import * as dateFns from 'date-fns';
import { BedDouble, User, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const RoomOverviewPage: React.FC = () => {
  const { bookings, closures } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigateDay = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentDate(dateFns.subDays(currentDate, 1));
    } else {
      setCurrentDate(dateFns.addDays(currentDate, 1));
    }
  };

  const getRoomStatus = (roomId: number) => {
    const assignedBooking = bookings.find(b => 
      b.assignedRooms.some(ar => ar.roomId === roomId) &&
      currentDate >= dateFns.parseISO(b.checkInDate) && currentDate < dateFns.parseISO(b.checkOutDate)
    );

    const closedStatus = closures.find(c => 
      (c.roomId === 'all' || c.roomId === roomId) &&
      currentDate >= dateFns.parseISO(c.startDate) && currentDate < dateFns.parseISO(c.endDate)
    );

    if (assignedBooking) {
      const assignedRoom = assignedBooking.assignedRooms.find(ar => ar.roomId === roomId);
      return {
        status: 'occupied',
        booking: assignedBooking,
        guestsAdults: assignedRoom?.guestsAdults || 0,
        guestsChildren: assignedRoom?.guestsChildren || 0,
      };
    } else if (closedStatus) {
      return { status: 'closed', closure: closedStatus };
    } else {
      return { status: 'available' };
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigateDay('prev')} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Panoramica Camere - {dateFns.format(currentDate, 'dd/MM/yyyy')}</h1>
        <button onClick={() => navigateDay('next')} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROOMS.sort((a, b) => a.id - b.id).map(room => {
          const status = getRoomStatus(room.id);
          
          let cardClass = 'bg-white';
          let statusText = 'Disponibile';
          let content = null;

          if (status.status === 'occupied') {
            cardClass = 'bg-red-100 border-red-400';
            statusText = 'Occupata';
            content = (
              <div className="text-sm text-gray-700 mt-2">
                <p className="font-semibold">{status.booking?.name}</p>
                <p className="flex items-center"><User size={14} className="mr-1" /> {status.guestsAdults} Adulti, {status.guestsChildren} Bambini</p>
                <p className="flex items-center"><Calendar size={14} className="mr-1" /> {dateFns.format(dateFns.parseISO(status.booking?.checkInDate || ''), 'dd/MM')} - {dateFns.format(dateFns.parseISO(status.booking?.checkOutDate || ''), 'dd/MM')}</p>
              </div>
            );
          } else if (status.status === 'closed') {
            cardClass = 'bg-gray-100 border-gray-400';
            statusText = 'Chiusa';
            content = (
              <p className="text-sm text-gray-700 mt-2">Motivo: {status.closure?.reason}</p>
            );
          }

          return (
            <div key={room.id} className={`p-4 rounded-lg shadow-md border-l-4 ${cardClass}`}>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <BedDouble className="mr-2" /> {room.name}
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.status === 'available' ? 'bg-green-200 text-green-800' : status.status === 'occupied' ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-800'}`}>
                  {statusText}
                </span>
              </div>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomOverviewPage;