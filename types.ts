export interface Room {
  id: number;
  name: string;
  capacity: number;
}

export type CustomerType = 'Privato' | 'Booking.com';
export type TouristTaxStatus = 'Normale' | 'Esenzione';

export interface AssignedRoom {
  roomId: number;
  guestsAdults: number;
  guestsChildren: number;
}

export interface Guest {
  id: string; // Unique ID for the guest
  firstName: string;
  lastName: string;
  isMainGuest: boolean; // To distinguish main guest from others
  guestType?: string; // e.g., "Adult", "Child"
  dateOfBirth?: string; // ISO string or 'dd/MM/yyyy'
  gender?: string; // e.g., "M", "F"
  nationality?: string;
  placeOfBirthType?: 'Comune' | 'Stato';
  placeOfBirth?: string;
  residenceType?: 'Comune' | 'Stato';
  residence?: string;
  documentType?: DocumentType;
  documentNumber?: string;
  documentIssueType?: 'Comune' | 'Nazione';
  documentIssuePlace?: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  email?: string;
  phone?: string;
  notes?: string;
  countryOfBirth?: Country;
  stateOfBirth?: State;
  countryOfResidence?: Country;
  stateOfResidence?: State;
}

export interface Booking {
  id: string;
  guestName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface Country {
  id: number;
  name: string;
  iso2: string;
}

export interface State {
  id: number;
  name: string;
  iso2: string;
}

export type DocumentType = 'Carta d'Identità' | 'Passaporto' | 'Patente di Guida' | 'Altro';


export interface Settings {
  basePriceDoubleRoom: number;
  priceThirdAdult: number;
  priceFourthAdult: number;
  priceSingleRoom: number;
  priceChild: number;
}

export interface Closure {
  id: string;
  roomId: number | 'all';
  startDate: string; // ISO string
  endDate: string; // ISO string
  reason: string;
}

export type CalendarViewMode = 'daily' | 'weekly' | 'monthly';