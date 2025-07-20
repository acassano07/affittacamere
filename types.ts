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

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  customerType: CustomerType;
  checkInDate: string; // ISO string
  checkOutDate: string; // ISO string
  guestsAdults: number;
  guestsChildren: number;
  assignedRooms: AssignedRoom[];
  price: number;
  touristTax: number;
  touristTaxStatus: TouristTaxStatus;
  status: 'Confirmed' | 'CheckedIn';
}

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