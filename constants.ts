import { Room } from './types';

export const ROOMS: Room[] = [
  { id: 1, name: 'Camera 1', capacity: 3 },
  { id: 2, name: 'Camera 2', capacity: 3 },
  { id: 3, name: 'Camera 3', capacity: 4 },
  { id: 4, name: 'Camera 4', capacity: 2 },
  { id: 5, name: 'Camera 5', capacity: 4 },
  { id: 6, name: 'Camera 6', capacity: 3 },
];

// Ordine preferito per assegnazione camere
export const ROOM_PREFERENCES: { [key: number]: number[] } = {
  1: [2, 1, 4, 5, 6, 3], // Singola
  2: [1, 2, 4, 5, 6, 3], // Matrimoniale
  3: [3, 5, 6, 1, 2],    // Tripla
  4: [3, 5],             // Quadrupla
};

export const CUSTOMER_TYPES = ['Privato', 'Booking.com'];
export const TOURIST_TAX_STATUSES = ['Normale', 'Esenzione'];