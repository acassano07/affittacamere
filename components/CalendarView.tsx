import React, { useState, useMemo } from 'react';
import { Booking, Closure, CalendarViewMode } from '../types';
import { ROOMS } from '../constants';
import * as dateFns from 'date-fns';
import it from 'date-fns/locale/it';
import { ChevronLeft, ChevronRight, Edit2, Users, BedDouble, Tag, VenetianMask, Baby } from 'lucide-react';

interface CalendarViewProps {
  bookings: Booking[];
  closures: Closure[];
  onSelectBooking: (booking: Booking) => void;
  onSelectDate: (date: Date) => void;
}

const BookingCard: React.FC<{ booking: Booking; onSelect: () => void; }> = ({ booking, onSelect }) => {
    const isPrivate = booking.customerType === 'Privato';
    const bgColor = isPrivate ? 'bg-blue-100 border-blue-400' : 'bg-green-100 border-green-400';
    const textColor = isPrivate ? 'text-blue-800' : 'text-green-800';
    const roomNames = booking.assignedRooms.map(r => {
      const room = ROOMS.find(room => room.id === r.roomId);
      return `${room?.name} (${r.guestsAdults}A, ${r.guestsChildren}C)`;
    }).join(', ');

    return (
        <div onClick={(e) => { e.stopPropagation(); onSelect(); }} className={`p-1.5 rounded-lg border-l-4 text-xs mb-1 cursor-pointer hover:shadow-md transition-shadow ${bgColor} ${textColor}`}>
            <div className="flex justify-between items-start">
                <div className="font-bold truncate pr-1">{booking.name}</div>
                <div className="flex items-center flex-shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); onSelect(); }} className="text-gray-500 hover:text-blue-600 p-0.5"><Edit2 size={12} /></button>
                </div>
            </div>
            <div className="flex items-center mt-1 opacity-80 flex-wrap">
                <span className="flex items-center mr-2"><Users size={12} className="mr-1" /> {booking.guestsAdults}</span>
                {booking.guestsChildren > 0 && <span className="flex items-center"><Baby size={12} className="mr-1" /> {booking.guestsChildren}</span>}
            </div>
             <div className="flex items-center mt-1 opacity-80" title={roomNames}>
                <BedDouble size={12} className="mr-1 flex-shrink-0" /> <span className="truncate">{roomNames || 'N/D'}</span>
            </div>
             <div className="flex items-center mt-1 opacity-80">
                {isPrivate ? <Tag size={12} className="mr-1"/> : <VenetianMask size={12} className="mr-1"/>} {booking.customerType}
            </div>
        </div>
    );
};

const CalendarView: React.FC<CalendarViewProps> = ({ bookings, closures, onSelectBooking, onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('monthly');

  const headerText = useMemo(() => {
    switch (viewMode) {
      case 'daily':
        return dateFns.format(currentDate, 'EEEE, dd MMMM yyyy', { locale: it });
      case 'weekly':
        const startOfWeek = dateFns.startOfWeek(currentDate, { locale: it });
        const endOfWeek = dateFns.endOfWeek(currentDate, { locale: it });
        return `${dateFns.format(startOfWeek, 'dd MMM', { locale: it })} - ${dateFns.format(endOfWeek, 'dd MMM yyyy', { locale: it })}`;
      case 'monthly':
      default:
        return dateFns.format(currentDate, 'MMMM yyyy', { locale: it });
    }
  }, [currentDate, viewMode]);

  const daysToDisplay = useMemo(() => {
    switch (viewMode) {
      case 'daily':
        return [currentDate];
      case 'weekly':
        return dateFns.eachDayOfInterval({
          start: dateFns.startOfWeek(currentDate, { locale: it }),
          end: dateFns.endOfWeek(currentDate, { locale: it }),
        });
      case 'monthly':
      default:
        const monthStart = dateFns.startOfMonth(currentDate);
        const monthEnd = dateFns.endOfMonth(currentDate);
        const startDate = dateFns.startOfWeek(monthStart, { locale: it });
        const endDate = dateFns.endOfWeek(monthEnd, { locale: it });
        return dateFns.eachDayOfInterval({ start: startDate, end: endDate });
    }
  }, [currentDate, viewMode]);

  const navigate = (direction: 'prev' | 'next') => {
    let newDate = currentDate;
    if (direction === 'prev') {
      switch (viewMode) {
        case 'daily': newDate = dateFns.subDays(currentDate, 1); break;
        case 'weekly': newDate = dateFns.subWeeks(currentDate, 1); break;
        case 'monthly': newDate = dateFns.subMonths(currentDate, 1); break;
      }
    } else {
      switch (viewMode) {
        case 'daily': newDate = dateFns.addDays(currentDate, 1); break;
        case 'weekly': newDate = dateFns.addWeeks(currentDate, 1); break;
        case 'monthly': newDate = dateFns.addMonths(currentDate, 1); break;
      }
    }
    setCurrentDate(newDate);
  };

  const today = new Date();

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 capitalize">
          {headerText}
        </h2>
        <div className="flex items-center space-x-2">
          <button onClick={() => navigate('prev')} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())} 
            className="text-sm font-semibold text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors"
          >
            Oggi
          </button>
          <button onClick={() => navigate('next')} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex justify-center mb-4 space-x-2">
        <button 
          onClick={() => setViewMode('daily')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${viewMode === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
        >
          Giorno
        </button>
        <button 
          onClick={() => setViewMode('weekly')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${viewMode === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
        >
          Settimana
        </button>
        <button 
          onClick={() => setViewMode('monthly')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${viewMode === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
        >
          Mese
        </button>
      </div>
      
      {viewMode !== 'daily' && (
        <div className="grid grid-cols-7 text-center font-semibold text-gray-500 text-sm pb-2 border-b">
          {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
            <div key={day} className="py-2">{day}</div>
          ))}
        </div>
      )}

      <div className={`grid ${viewMode === 'daily' ? 'grid-cols-1' : 'grid-cols-7'} ${viewMode === 'monthly' ? 'grid-rows-6' : ''} flex-grow -mx-px`}>
        {daysToDisplay.map(day => {
          const dayBookings = bookings.filter(b => {
            const checkIn = dateFns.parseISO(b.checkInDate);
            const checkOut = dateFns.parseISO(b.checkOutDate);
            return day >= checkIn && day < checkOut;
          });

          const dayClosures = closures.filter(c => {
            const start = dateFns.parseISO(c.startDate);
            const end = dateFns.parseISO(c.endDate);
            return day >= start && day < end;
          });

          const isDayInCurrentMonth = dateFns.isSameMonth(day, currentDate);
          const isToday = dateFns.isSameDay(day, today);

          return (
            <div
              key={day.toString()}
              onClick={() => onSelectDate(day)}
              className={`border border-gray-200 p-1.5 flex flex-col relative ${viewMode === 'daily' ? 'min-h-[600px]' : 'min-h-[120px]'} cursor-pointer transition-colors hover:bg-blue-50 ${viewMode === 'monthly' && !isDayInCurrentMonth ? 'bg-gray-50' : 'bg-white'}`}
            >
              <span className={`text-xs sm:text-sm font-medium mb-1 self-start ${
                  isToday ? 'bg-blue-600 text-white rounded-full h-6 w-6 flex items-center justify-center' : 'text-gray-700'
              }`}>
                {dateFns.format(day, 'd')}
              </span>
              <div className="flex-grow overflow-y-auto space-y-1">
                {dayBookings.sort((a,b) => (a.assignedRooms[0]?.roomId || 0) - (b.assignedRooms[0]?.roomId || 0)).map(booking => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    onSelect={() => onSelectBooking(booking)}
                  />
                ))}
                {dayClosures.map(closure => (
                  <div key={closure.id} className="bg-gray-200 text-gray-600 p-1.5 rounded-lg text-xs border-l-4 border-gray-400">
                    <div className="font-bold">Chiuso</div>
                    <div className="truncate">{closure.roomId === 'all' ? 'Tutta la struttura' : ROOMS.find(r => r.id === closure.roomId)?.name}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;