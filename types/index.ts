export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Route {
  id: string;
  name: string;
  startLocation: string;
  endLocation: string;
  estimatedTime: number; // in minutes
  startCoordinates: Coordinates;
  endCoordinates: Coordinates;
}

export interface Van {
  id: string;
  name: string;
  capacity: number;
  occupiedSeats: number;
  status: 'available' | 'unavailable';
  licensePlate: string;
  coordinates: Coordinates;
  route: Route | null;
}

export interface Booking {
  id: string;
  vanId: string;
  seatNumber: number;
  passengerName: string;
  passengerContact: string;
  bookingDate: string; // ISO string
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Passenger {
  id: string;
  name: string;
  contact: string;
  bookings: string[]; // booking ids
}