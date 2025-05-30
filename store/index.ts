import { create } from 'zustand';
import { generateId } from '@/utils/generateId';
import { Van, Route, Booking } from '@/types';

// Sample initial data
const initialVans: Van[] = [
  {
    id: 'van-001',
    name: 'Speedy',
    capacity: 12,
    occupiedSeats: 5,
    status: 'available',
    licensePlate: 'ABC-1234',
    coordinates: { latitude: 37.7749, longitude: -122.4194 },
    route: {
      id: 'route-001',
      name: 'Downtown Express',
      startLocation: 'City Center',
      endLocation: 'Airport Terminal',
      estimatedTime: 45,
      startCoordinates: { latitude: 37.7749, longitude: -122.4194 },
      endCoordinates: { latitude: 37.6213, longitude: -122.3790 }
    }
  },
  {
    id: 'van-002',
    name: 'Comfort',
    capacity: 8,
    occupiedSeats: 3,
    status: 'available',
    licensePlate: 'XYZ-5678',
    coordinates: { latitude: 37.7833, longitude: -122.4167 },
    route: {
      id: 'route-002',
      name: 'Beach Route',
      startLocation: 'Transit Center',
      endLocation: 'Ocean Beach',
      estimatedTime: 30,
      startCoordinates: { latitude: 37.7833, longitude: -122.4167 },
      endCoordinates: { latitude: 37.7691, longitude: -122.4830 }
    }
  },
  {
    id: 'van-003',
    name: 'Luxury',
    capacity: 6,
    occupiedSeats: 0,
    status: 'unavailable',
    licensePlate: 'LUX-9999',
    coordinates: { latitude: 37.7935, longitude: -122.3964 },
    route: null
  },
];

const initialRoutes: Route[] = [
  {
    id: 'route-001',
    name: 'Downtown Express',
    startLocation: 'City Center',
    endLocation: 'Airport Terminal',
    estimatedTime: 45,
    startCoordinates: { latitude: 37.7749, longitude: -122.4194 },
    endCoordinates: { latitude: 37.6213, longitude: -122.3790 }
  },
  {
    id: 'route-002',
    name: 'Beach Route',
    startLocation: 'Transit Center',
    endLocation: 'Ocean Beach',
    estimatedTime: 30,
    startCoordinates: { latitude: 37.7833, longitude: -122.4167 },
    endCoordinates: { latitude: 37.7691, longitude: -122.4830 }
  },
  {
    id: 'route-003',
    name: 'Mountain View',
    startLocation: 'Downtown',
    endLocation: 'Mountain Lodge',
    estimatedTime: 60,
    startCoordinates: { latitude: 37.7749, longitude: -122.4194 },
    endCoordinates: { latitude: 37.3861, longitude: -122.0839 }
  },
];

const initialBookings: Booking[] = [
  {
    id: 'booking-001',
    vanId: 'van-001',
    seatNumber: 1,
    passengerName: 'John Smith',
    passengerContact: 'john@example.com',
    bookingDate: new Date('2025-05-01').toISOString(),
    status: 'confirmed'
  },
  {
    id: 'booking-002',
    vanId: 'van-001',
    seatNumber: 2,
    passengerName: 'Sarah Johnson',
    passengerContact: 'sarah@example.com',
    bookingDate: new Date('2025-05-01').toISOString(),
    status: 'confirmed'
  },
  {
    id: 'booking-003',
    vanId: 'van-002',
    seatNumber: 3,
    passengerName: 'Michael Brown',
    passengerContact: 'michael@example.com',
    bookingDate: new Date('2025-05-02').toISOString(),
    status: 'pending'
  },
];

interface StoreState {
  vans: Van[];
  routes: Route[];
  bookings: Booking[];
  addVan: (van: Omit<Van, 'id'>) => void;
  updateVan: (id: string, updates: Partial<Van>) => void;
  deleteVan: (id: string) => void;
  addRoute: (route: Omit<Route, 'id'>) => void;
  updateRoute: (id: string, updates: Partial<Route>) => void;
  deleteRoute: (id: string) => void;
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  assignRouteToVan: (vanId: string, routeId: string | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  vans: initialVans,
  routes: initialRoutes,
  bookings: initialBookings,
  
  addVan: (van) => set((state) => ({
    vans: [...state.vans, { ...van, id: `van-${generateId()}` }]
  })),
  
  updateVan: (id, updates) => set((state) => ({
    vans: state.vans.map(van => 
      van.id === id ? { ...van, ...updates } : van
    )
  })),
  
  deleteVan: (id) => set((state) => ({
    vans: state.vans.filter(van => van.id !== id)
  })),
  
  addRoute: (route) => set((state) => ({
    routes: [...state.routes, { ...route, id: `route-${generateId()}` }]
  })),
  
  updateRoute: (id, updates) => set((state) => ({
    routes: state.routes.map(route => 
      route.id === id ? { ...route, ...updates } : route
    )
  })),
  
  deleteRoute: (id) => set((state) => ({
    routes: state.routes.filter(route => route.id !== id)
  })),
  
  addBooking: (booking) => set((state) => {
    const newBooking = { ...booking, id: `booking-${generateId()}` };
    
    // Update van's occupied seats
    const updatedVans = state.vans.map(van => {
      if (van.id === booking.vanId) {
        return {
          ...van,
          occupiedSeats: van.occupiedSeats + 1
        };
      }
      return van;
    });
    
    return {
      bookings: [...state.bookings, newBooking],
      vans: updatedVans
    };
  }),
  
  updateBooking: (id, updates) => set((state) => ({
    bookings: state.bookings.map(booking => 
      booking.id === id ? { ...booking, ...updates } : booking
    )
  })),
  
  deleteBooking: (id) => set((state) => {
    const bookingToDelete = state.bookings.find(booking => booking.id === id);
    
    if (!bookingToDelete) {
      return { bookings: state.bookings };
    }
    
    // Update van's occupied seats
    const updatedVans = state.vans.map(van => {
      if (van.id === bookingToDelete.vanId) {
        return {
          ...van,
          occupiedSeats: Math.max(0, van.occupiedSeats - 1)
        };
      }
      return van;
    });
    
    return {
      bookings: state.bookings.filter(booking => booking.id !== id),
      vans: updatedVans
    };
  }),
  
  assignRouteToVan: (vanId, routeId) => set((state) => {
    const route = routeId ? state.routes.find(r => r.id === routeId) : null;
    
    return {
      vans: state.vans.map(van => {
        if (van.id === vanId) {
          return {
            ...van,
            route
          };
        }
        return van;
      })
    };
  }),
}));