import React from 'react';
import { useData } from '../hooks/useData';
import { Booking } from '../types';
import { ROOMS } from '../constants';
import * as dateFns from 'date-fns';
import { BedDouble, User, Phone, Calendar, ArrowRight } from 'lucide-react';

const BookingInfoCard: React.FC<{ booking: Booking }> = ({ booking }) => {
  const roomDetails = booking.assignedRooms.map(r => {
    const room = ROOMS.find(room => room.id === r.roomId);
    return `${room?.name} (${r.guestsAdults}A, ${r.guestsChildren}C)`
  }).join(', ');

  return (
    <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-gray-800">{booking.name}</h3>
        <span className={`text-sm font-semibold px-2 py-1 rounded-full ${booking.customerType === 'Booking.com' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
          {booking.customerType}
        </span>
      </div>
      <div className="text-gray-600 space-y-1">
        <p className="flex items-center"><Phone size={14} className="mr-2" /> {booking.phone || 'N/D'}</p>
        <p className="flex items-center"><BedDouble size={14} className="mr-2" /> {roomDetails}</p>
        <div className="flex items-center font-semibold">
            <Calendar size={14} className="mr-2" />
            <span>{dateFns.format(dateFns.parseISO(booking.checkInDate), 'dd/MM/yyyy')}</span>
            <ArrowRight size={14} className="mx-2" />
            <span>{dateFns.format(dateFns.parseISO(booking.checkOutDate), 'dd/MM/yyyy')}</span>
        </div>
      </div>
    </div>
  );
};

const TodayTomorrowPage: React.FC = () => {
  const { bookings } = useData();
  const today = dateFns.startOfToday();
  const tomorrow = dateFns.addDays(today, 1);

  const todayBookings = bookings.filter(b => dateFns.isSameDay(dateFns.parseISO(b.checkInDate), today));
  const tomorrowBookings = bookings.filter(b => dateFns.isSameDay(dateFns.parseISO(b.checkInDate), tomorrow));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Arrivi di Oggi</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {todayBookings.length > 0 ? (
            todayBookings.map(b => <BookingInfoCard key={b.id} booking={b} />)
          ) : (
            <p className="text-gray-500">Nessun arrivo previsto per oggi.</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Arrivi di Domani</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tomorrowBookings.length > 0 ? (
            tomorrowBookings.map(b => <BookingInfoTmrwCard key={b.id} booking={b} />)
          ) : (
            <p className="text-gray-500">Nessun arrivo previsto per domani.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const BookingInfoTmrwCard: React.FC<{ booking: Booking }> = ({ booking }) => {
    const roomDetails = booking.assignedRooms.map(r => {
      const room = ROOMS.find(room => room.id === r.roomId);
      return `${room?.name} (${r.guestsAdults}A, ${r.guestsChildren}C)`
    }).join(', ');
  
    return (
      <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-yellow-500">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-800">{booking.name}</h3>
          <span className={`text-sm font-semibold px-2 py-1 rounded-full ${booking.customerType === 'Booking.com' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {booking.customerType}
          </span>
        </div>
        <div className="text-gray-600 space-y-1">
          <p className="flex items-center"><Phone size={14} className="mr-2" /> {booking.phone || 'N/D'}</p>
          <p className="flex items-center"><BedDouble size={14} className="mr-2" /> {roomDetails}</p>
          <div className="flex items-center font-semibold">
              <Calendar size={14} className="mr-2" />
              <span>{dateFns.format(dateFns.parseISO(booking.checkInDate), 'dd/MM/yyyy')}</span>
              <ArrowRight size={14} className="mx-2" />
              <span>{dateFns.format(dateFns.parseISO(booking.checkOutDate), 'dd/MM/yyyy')}</span>
          </div>
        </div>
      </div>
    );
  };

export default TodayTomorrowPage;