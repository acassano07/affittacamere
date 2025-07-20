import React, { useState, useEffect, useCallback } from 'react';
import { Booking, AssignedRoom } from '../types';
import { useData } from '../hooks/useData';
import { calculatePrice, calculateTouristTax, calculateNights } from '../utils/bookingUtils';
import { X, User, Phone, Mail, Users, Euro, Calendar as CalendarIcon, Baby, Trash2, Plus, Minus } from 'lucide-react';
import { CUSTOMER_TYPES, TOURIST_TAX_STATUSES } from '../constants';
import * as dateFns from 'date-fns';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: Booking | null;
  defaultDate?: Date | null;
}

export default function BookingModal({ isOpen, onClose, booking, defaultDate }: BookingModalProps) {
  const { addBooking, updateBooking, settings, deleteBooking } = useData();
  
  const getInitialState = useCallback(() => {
    const checkIn = defaultDate ? defaultDate : (booking ? dateFns.parseISO(booking.checkInDate) : new Date());
    const checkOut = defaultDate ? dateFns.addDays(defaultDate, 1) : (booking ? dateFns.parseISO(booking.checkOutDate) : dateFns.addDays(new Date(), 1));

    return {
      name: booking?.name || '',
      phone: booking?.phone || '',
      email: booking?.email || '',
      notes: booking?.notes || '',
      customerType: booking?.customerType || 'Privato',
      checkInDate: dateFns.format(checkIn, 'yyyy-MM-dd'),
      checkOutDate: dateFns.format(checkOut, 'yyyy-MM-dd'),
      touristTaxStatus: booking?.touristTaxStatus || 'Normale',
      status: booking?.status || 'Confirmed',
    };
  }, [booking, defaultDate]);

  const [formData, setFormData] = useState(getInitialState());
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [calculatedTax, setCalculatedTax] = useState(0);
  const [roomDistribution, setRoomDistribution] = useState<Omit<AssignedRoom, 'roomId'>[]>([]);

  useEffect(() => {
    setFormData(getInitialState());
    if (booking && booking.assignedRooms) {
      setRoomDistribution(booking.assignedRooms.map(r => ({ guestsAdults: r.guestsAdults, guestsChildren: r.guestsChildren })));
    } else {
      setRoomDistribution([{ guestsAdults: 2, guestsChildren: 0 }]);
    }
  }, [booking, isOpen, getInitialState]);

  useEffect(() => {
    const totalAdults = roomDistribution.reduce((sum, room) => sum + room.guestsAdults, 0);
    const totalChildren = roomDistribution.reduce((sum, room) => sum + room.guestsChildren, 0);
    const { checkInDate, checkOutDate, customerType, touristTaxStatus } = formData;

    if (checkInDate && checkOutDate) {
      const nights = calculateNights(checkInDate, checkOutDate);
      if (nights > 0) {
        if (customerType === 'Privato') {
          setCalculatedPrice(calculatePrice(totalAdults, totalChildren, nights, settings));
        } else {
          setCalculatedPrice(0);
        }
        const taxPayingAdults = touristTaxStatus === 'Normale' ? totalAdults : 0;
        setCalculatedTax(calculateTouristTax(taxPayingAdults, nights, checkInDate));
      } else {
        setCalculatedPrice(0);
        setCalculatedTax(0);
      }
    }
  }, [formData, settings, roomDistribution]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoomDistChange = (index: number, field: 'guestsAdults' | 'guestsChildren', value: string) => {
    const newDistribution = [...roomDistribution];
    newDistribution[index] = { ...newDistribution[index], [field]: parseInt(value, 10) || 0 };
    setRoomDistribution(newDistribution);
  };

  const addRoom = () => setRoomDistribution([...roomDistribution, { guestsAdults: 1, guestsChildren: 0 }]);
  const removeRoom = (index: number) => {
    if (roomDistribution.length > 1) {
      const newDistribution = [...roomDistribution];
      newDistribution.splice(index, 1);
      setRoomDistribution(newDistribution);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isBookingCustomer = formData.customerType === 'Booking.com';
    if (formData.name && (formData.phone || isBookingCustomer)) {
        const totalGuests = roomDistribution.reduce((sum, room) => sum + room.guestsAdults + room.guestsChildren, 0);
        if(totalGuests <= 0){
            alert('Il numero di ospiti non può essere zero.');
            return;
        }

        const bookingData = {
            ...formData,
            checkInDate: dateFns.parseISO(formData.checkInDate).toISOString(),
            checkOutDate: dateFns.parseISO(formData.checkOutDate).toISOString(),
            guestsPerRoom: roomDistribution,
            assignedRooms: [], // This will be populated by the backend logic
        };

        let result;
        if(booking){
            result = updateBooking({ ...bookingData, id: booking.id });
        } else {
            result = addBooking(bookingData);
        }
        
        if (result.success) {
            alert(result.message);
            onClose();
        } else {
            alert(result.message);
        }
    } else {
        alert('Nome e Telefono sono campi obbligatori.');
    }
  };

  const handleDelete = () => {
    if (booking) {
      if (window.confirm('Sei sicuro di voler eliminare questa prenotazione? L\'azione è irreversibile.')) {
        deleteBooking(booking.id);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{booking ? 'Modifica Prenotazione' : 'Nuova Prenotazione'}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nome Cliente</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" placeholder="Mario Rossi" required/>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Telefono {formData.customerType === 'Booking.com' && '(Opzionale)'}</label>
                     <div className="mt-1 relative rounded-md shadow-sm">
                         <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" placeholder="3331234567" required={formData.customerType !== 'Booking.com'}/>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Email (Opzionale)</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                         <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" placeholder="mario.rossi@email.com"/>
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Check-in</label>
                    <input type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Check-out</label>
                    <input type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo Cliente</label>
                    <select name="customerType" value={formData.customerType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
                        {CUSTOMER_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tassa Soggiorno</label>
                    <select name="touristTaxStatus" value={formData.touristTaxStatus} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
                         {TOURIST_TAX_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
                <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-gray-700">Note (Opzionale)</label>
                     <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"></textarea>
                </div>
            </div>

            {/* Room Distribution */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg text-gray-800">Distribuzione Ospiti</h3>
              {roomDistribution.map((room, index) => (
                <div key={index} className="p-2 border border-gray-200 rounded-md">
                  <div className="flex items-center justify-between">
                     <p className="font-semibold text-gray-700">Camera {index + 1}</p>
                     <button type="button" onClick={() => removeRoom(index)} className="text-red-500 hover:text-red-700">
                        <Minus size={16} />
                      </button>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Adulti</label>
                      <input 
                        type="number" 
                        value={room.guestsAdults}
                        onChange={(e) => handleRoomDistChange(index, 'guestsAdults', e.target.value)}
                        min="0"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Bambini (&lt;12)</label>
                      <input 
                        type="number" 
                        value={room.guestsChildren}
                        onChange={(e) => handleRoomDistChange(index, 'guestsChildren', e.target.value)}
                        min="0"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addRoom} className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-semibold">
                <Plus size={16} className="mr-1" /> Aggiungi Camera
              </button>
              <p className="text-sm font-bold text-gray-800 mt-2">Ospiti totali: {roomDistribution.reduce((sum, room) => sum + room.guestsAdults + room.guestsChildren, 0)}</p>
            </div>

            {/* Price Preview */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold text-lg text-gray-800">Preventivo</h3>
                <div className="flex justify-between items-center text-gray-600">
                    <span className="flex items-center"><Euro className="w-4 h-4 mr-2"/>Prezzo Soggiorno</span>
                    <span className="font-bold text-gray-800">{formData.customerType === 'Privato' ? `${calculatedPrice.toFixed(2)} €` : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                    <span className="flex items-center"><CalendarIcon className="w-4 h-4 mr-2"/>Tassa di Soggiorno</span>
                    <span className="font-bold text-gray-800">{calculatedTax.toFixed(2)} €</span>
                </div>
                 <p className="text-xs text-gray-500">La tassa di soggiorno si applica solo agli adulti. I bambini sotto i 12 anni sono esenti.</p>
                <div className="border-t pt-2 mt-2 flex justify-between items-center text-lg font-bold text-blue-600">
                    <span>Totale</span>
                    <span>{ (formData.customerType === 'Privato' ? calculatedPrice + calculatedTax : calculatedTax).toFixed(2) } €</span>
                </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t mt-4">
              <div>
                {booking && (
                  <button 
                    type="button" 
                    onClick={handleDelete} 
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center transition-colors"
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Cancella Prenotazione
                  </button>
                )}
              </div>
              <div className="flex space-x-2">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Annulla</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">{booking ? 'Salva Modifiche' : 'Crea Prenotazione'}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
