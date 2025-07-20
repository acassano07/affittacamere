import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Booking, Settings, Closure } from '../types';
import { findBestRoomsForDistribution } from '../utils/bookingUtils';
import * as dateFns from 'date-fns';
import Papa from 'papaparse';

interface DataContextType {
  bookings: Booking[];
  settings: Settings;
  closures: Closure[];
  addBooking: (booking: Omit<Booking, 'id' | 'price' | 'touristTax' | 'assignedRooms'> & { guestsPerRoom: { guestsAdults: number, guestsChildren: number }[] }) => { success: boolean, message: string };
  updateBooking: (booking: Omit<Booking, 'price' | 'touristTax' | 'assignedRooms'> & { id: string, guestsPerRoom: { guestsAdults: number, guestsChildren: number }[] }) => { success: boolean, message: string };
  deleteBooking: (id: string) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  addClosure: (closure: Omit<Closure, 'id'>) => void;
  deleteClosure: (id: string) => void;
  getBookingById: (id: string) => Booking | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('settings');
    try {
        return savedSettings ? JSON.parse(savedSettings) : {
          basePriceDoubleRoom: 45,
          priceThirdAdult: 15,
          priceFourthAdult: 15,
          priceSingleRoom: 35,
          priceChild: 10,
        };
    } catch {
        return {
          basePriceDoubleRoom: 45,
          priceThirdAdult: 15,
          priceFourthAdult: 15,
          priceSingleRoom: 35,
          priceChild: 10,
        };
    }
  });
  const [closures, setClosures] = useState<Closure[]>(() => {
    const savedClosures = localStorage.getItem('closures');
    try {
        return savedClosures ? JSON.parse(savedClosures) : [];
    } catch {
        return [];
    }
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/bookings.csv');
        const text = await response.text();
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false,
          complete: (results) => {
            const parsedBookings = results.data.map((row: any) => ({
              ...row,
              guestsAdults: Number(row.guestsAdults) || 0,
              guestsChildren: Number(row.guestsChildren) || 0,
              price: Number(row.price) || 0,
              touristTax: Number(row.touristTax) || 0,
              assignedRooms: row.assignedRooms ? JSON.parse(row.assignedRooms) : [],
            })) as Booking[];
            setBookings(parsedBookings);
          }
        });
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('closures', JSON.stringify(closures));
  }, [closures]);

  const updateBookingsCSV = async (updatedBookings: Booking[]) => {
    try {
      const csv = Papa.unparse(updatedBookings.map(b => ({
        ...b,
        assignedRooms: JSON.stringify(b.assignedRooms)
      })));
      console.log("CSV data being sent:", csv); // Added for debugging
      await fetch('/bookings.csv', {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: csv,
      });
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Failed to update bookings:', error);
    }
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'price' | 'touristTax' | 'assignedRooms'> & { guestsPerRoom: { guestsAdults: number, guestsChildren: number }[] }) => {
    const assignedRooms = findBestRoomsForDistribution(bookingData.guestsPerRoom, bookingData.checkInDate, bookingData.checkOutDate, bookings, closures);
    
    if (!assignedRooms) {
      return { success: false, message: 'Nessuna camera o combinazione di camere disponibile per la distribuzione di ospiti richiesta.' };
    }

    const newBooking: Booking = {
      ...bookingData,
      id: `${new Date().toISOString()}-${Math.random()}`,
      assignedRooms,
      price: 0,
      touristTax: 0,
    };
    const updatedBookings = [...bookings, newBooking].sort((a,b) => dateFns.parseISO(a.checkInDate).getTime() - dateFns.parseISO(b.checkInDate).getTime());
    updateBookingsCSV(updatedBookings);
    return { success: true, message: 'Prenotazione aggiunta con successo!' };
  };

  const updateBooking = (bookingData: Omit<Booking, 'price' | 'touristTax' | 'assignedRooms'> & { id: string, guestsPerRoom: { guestsAdults: number, guestsChildren: number }[] }) => {
     const assignedRooms = findBestRoomsForDistribution(bookingData.guestsPerRoom, bookingData.checkInDate, bookingData.checkOutDate, bookings, closures, bookingData.id);
     
     if (!assignedRooms) {
      return { success: false, message: 'Nessuna camera o combinazione di camere disponibile per la nuova distribuzione di ospiti.' };
    }

    const updatedBookings = bookings.map(b => b.id === bookingData.id ? { ...b, ...bookingData, assignedRooms } : b).sort((a,b) => dateFns.parseISO(a.checkInDate).getTime() - dateFns.parseISO(b.checkInDate).getTime());
    updateBookingsCSV(updatedBookings);
    return { success: true, message: 'Prenotazione aggiornata!' };
  };

  const deleteBooking = (id: string) => {
    const updatedBookings = bookings.filter(b => b.id !== id);
    updateBookingsCSV(updatedBookings);
  };
  
  const getBookingById = (id: string) => {
    return bookings.find(b => b.id === id);
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addClosure = (closureData: Omit<Closure, 'id'>) => {
    const newClosure = { ...closureData, id: `${new Date().toISOString()}-${Math.random()}` };
    setClosures(prev => [...prev, newClosure]);
  };
  
  const deleteClosure = (id: string) => {
    setClosures(prev => prev.filter(c => c.id !== id));
  };

  const value = {
    bookings, 
    settings, 
    closures, 
    addBooking, 
    updateBooking, 
    deleteBooking, 
    updateSettings, 
    addClosure, 
    deleteClosure, 
    getBookingById
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};