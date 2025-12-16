export interface HotelSummary {
  id: number;
  name: string;
  city: string;
  rating: number;
  roomCount: number;
}

export type RoomType = 'STANDARD' | 'DELUXE' | 'SUITE';

export interface AvailableRoom {
  hotelId: number;
  hotelName: string;
  hotelRating: number;
  roomId: number;
  roomNumber: string;
  roomType: RoomType;
  capacity: number;
  baseRate: number | null;
}

export interface AvailabilitySearch {
  city: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface BookingPayload {
  roomId: number;
  firstName: string;
  lastName: string;
  email: string;
  guests: number;
  checkIn: string;
  checkOut: string;
}

export interface BookingGuest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface BookingRoom {
  id: number;
  roomNumber: string;
  type: RoomType;
  capacity: number;
  baseRate: number;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface BookingResponse {
  id: number;
  status: BookingStatus;
  guest: BookingGuest;
  room: BookingRoom;
  checkIn: string;
  checkOut: string;
  guestCount: number;
}
