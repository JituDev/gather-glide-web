// contexts/BookingContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface Booking {
  _id: string;
  user: string;
  userName: string;
  userEmail: string;
  vendor: string;
  service: string;
  message?: string;
  date: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

interface PaymentDetails {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

interface BookingContextType {
  bookings: Booking[];
  vendorBookings: Booking[];
  loading: boolean;
  error: string | null;
  createBooking: (
    vendorId: string, 
    serviceId: string, 
    date: string, 
    message?: string
  ) => Promise<{ booking: Booking; payment: PaymentDetails }>;
  getVendorBookings: (vendorId: string) => Promise<Booking[]>;
  getUserBookings: (userId: string) => Promise<Booking[]>;
  updateBookingStatus: (bookingId: string, status: string) => Promise<Booking>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vendorBookings, setVendorBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/bookings`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Set auth token if user is logged in
  // api.interceptors.request.use((config) => {
  //   if (user?.token) {
  //     config.headers.Authorization = `Bearer ${user.token}`;
  //   }
  //   return config;
  // });
  const setAuthToken = (token: string | null) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token'); // Adjust based on your auth setup
    setAuthToken(token);
  }, []);

  const createBooking = async (
    vendorId: string,
    serviceId: string,
    date: string,
    message?: string
  ): Promise<{ booking: Booking; payment: PaymentDetails }> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/', {
        vendorId,
        serviceId,
        date,
        message
      });

      // Add to user's bookings
      setBookings(prev => [...prev, response.data.data.booking]);

      return {
        booking: response.data.data.booking,
        payment: response.data.data.payment
      };
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getVendorBookings = async (vendorId: string): Promise<Booking[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/vendor/${vendorId}`);
      setVendorBookings(response.data.data);
      return response.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch vendor bookings');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserBookings = async (userId: string): Promise<Booking[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/user/${userId}`);
      setBookings(response.data.data);
      return response.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user bookings');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (
    bookingId: string,
    status: string
  ): Promise<Booking> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/${bookingId}/status`, { status });

      // Update in vendor bookings
      setVendorBookings(prev =>
        prev.map(booking =>
          booking._id === bookingId ? response.data.data : booking
        )
      );

      // Update in user bookings if exists
      setBookings(prev =>
        prev.map(booking =>
          booking._id === bookingId ? response.data.data : booking
        )
      );

      return response.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update booking status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load user bookings on mount if user is logged in
  useEffect(() => {
    if (user?._id && user?.role === 'user') {
      getUserBookings(user._id);
    } else if (user?._id && user?.role === 'vendor') {
      getVendorBookings(user._id);
    }
  }, [user?._id, user?.role]);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        vendorBookings,
        loading,
        error,
        createBooking,
        getVendorBookings,
        getUserBookings,
        updateBookingStatus,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};