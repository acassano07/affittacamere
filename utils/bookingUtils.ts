import * as dateFns from 'date-fns';
import { Booking, Settings, Closure, Room, AssignedRoom } from '../types';
import { ROOMS } from '../constants';

export const calculateNights = (checkIn: string, checkOut: string): number => {
  if (!checkIn || !checkOut) return 0;
  return dateFns.differenceInDays(dateFns.parseISO(checkOut), dateFns.parseISO(checkIn));
};

export const calculatePrice = (guestsAdults: number, guestsChildren: number, nights: number, settings: Settings): number => {
  if (guestsAdults + guestsChildren <= 0 || nights <= 0) return 0;

  let adultPrice = 0;
  if (guestsAdults === 1) {
    adultPrice = settings.priceSingleRoom;
  } else if (guestsAdults === 2) {
    adultPrice = settings.basePriceDoubleRoom;
  } else if (guestsAdults === 3) {
    adultPrice = settings.basePriceDoubleRoom + settings.priceThirdAdult;
  } else if (guestsAdults >= 4) {
    adultPrice = settings.basePriceDoubleRoom + settings.priceThirdAdult + (settings.priceFourthAdult * (guestsAdults - 2));
  }

  const childrenPrice = guestsChildren * settings.priceChild;

  return (adultPrice + childrenPrice) * nights;
};

export const calculateTouristTax = (guestsAdults: number, nights: number, checkIn: string): number => {
  if (guestsAdults <= 0 || nights <= 0) return 0;
  
  const month = dateFns.getMonth(dateFns.parseISO(checkIn)); // 0-11
  const rate = month >= 4 && month <= 9 ? 2 : 1.5; // May-Oct: 2€, Nov-Apr: 1.5€
  
  return rate * guestsAdults * nights;
};

const isRoomAvailable = (roomId: number, start: string, end: string, bookings: Booking[], closures: Closure[], currentBookingId?: string): boolean => {
  const checkInDate = dateFns.parseISO(start);
  const checkOutDate = dateFns.parseISO(end);

  const filteredBookings = currentBookingId ? bookings.filter(b => b.id !== currentBookingId) : bookings;

  const conflictingBooking = filteredBookings.find(b => 
    b.assignedRooms.some(ar => ar.roomId === roomId) &&
    dateFns.areIntervalsOverlapping(
      { start: dateFns.parseISO(b.checkInDate), end: dateFns.parseISO(b.checkOutDate) },
      { start: checkInDate, end: checkOutDate }
    )
  );

  if (conflictingBooking) return false;

  const conflictingClosure = closures.find(c => {
    if (c.roomId !== 'all' && c.roomId !== roomId) return false;
    return dateFns.areIntervalsOverlapping(
      { start: dateFns.parseISO(c.startDate), end: dateFns.parseISO(c.endDate) },
      { start: checkInDate, end: checkOutDate }
    );
  });
  
  if (conflictingClosure) return false;

  return true;
};

export const findBestRoomsForDistribution = (
  guestsPerRoom: { guestsAdults: number, guestsChildren: number }[],
  checkIn: string,
  checkOut: string,
  bookings: Booking[],
  closures: Closure[],
  currentBookingId?: string
): AssignedRoom[] | null => {
  let availableRooms = ROOMS.filter(room =>
    isRoomAvailable(room.id, checkIn, checkOut, bookings, closures, currentBookingId)
  );

  const assignedRooms: AssignedRoom[] = [];

  // Sort guest requests from largest total guests to smallest
  const sortedGuestsPerRoom = [...guestsPerRoom].sort((a, b) => (b.guestsAdults + b.guestsChildren) - (a.guestsAdults + a.guestsChildren));

  for (const guestGroup of sortedGuestsPerRoom) {
    const totalGuestsInGroup = guestGroup.guestsAdults + guestGroup.guestsChildren;
    if (totalGuestsInGroup <= 0) continue;

    // Find the smallest available room that can fit the total guests in the group
    const suitableRoom = availableRooms
      .filter(r => r.capacity >= totalGuestsInGroup)
      .sort((a, b) => a.capacity - b.capacity)[0];

    if (suitableRoom) {
      assignedRooms.push({ roomId: suitableRoom.id, ...guestGroup });
      // Remove the assigned room from the available pool for the next iteration
      availableRooms = availableRooms.filter(r => r.id !== suitableRoom.id);
    } else {
      // If any guest group can't be placed, the entire distribution fails
      return null;
    }
  }

  return assignedRooms;
};