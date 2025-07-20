import { Country, State, DocumentType } from './types';

export const COUNTRIES: Country[] = [
  { id: 1, name: 'Italy', iso2: 'IT' },
  { id: 2, name: 'United States', iso2: 'US' },
  { id: 3, name: 'Germany', iso2: 'DE' },
];

export const STATES: State[] = [
  { id: 1, name: 'Lombardy', iso2: 'LM' },
  { id: 2, name: 'California', iso2: 'CA' },
  { id: 3, name: 'Bavaria', iso2: 'BY' },
];

export const DOCUMENT_TYPES: DocumentType[] = [
  "Carta d'Identità",
  "Passaporto",
  "Patente di Guida",
  "Altro",
];

export const ROOMS = [
  { id: 1, name: 'Room 1', capacity: 3 },
  { id: 2, name: 'Room 2', capacity: 3 },
  { id: 3, name: 'Room 3', capacity: 4 },
  { id: 4, name: 'Room 4', capacity: 2 },
  { id: 5, name: 'Room 5', capacity: 4 },
  { id: 6, name: 'Room 6', capacity: 3 },
];

export const CUSTOMER_TYPES = [
  'Privato',
  'Booking.com',
];

export const TOURIST_TAX_STATUSES = [
  'Normale',
  'Esenzione',
];
