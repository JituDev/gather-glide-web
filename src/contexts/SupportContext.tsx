// supportContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SupportContext = createContext();

export const SupportProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTicket, setCurrentTicket] = useState(null);
  const token = localStorage.getItem('token')

  // Axios instance with auth header
  const api = axios.create({
      baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/support`,
      headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`,
    },
  });

  // Set auth token for requests
  const setAuthToken = (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  // Create new ticket
  const createTicket = async (ticketData) => {
    try {
      setLoading(true);
      const response = await api.post('/', ticketData);
      setTickets(prev => [response.data.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get all tickets (admin only)
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/');
      setTickets(response.data.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single ticket
  const fetchTicket = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/${id}`);
      setCurrentTicket(response.data.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update ticket status (admin only)
  const updateTicketStatus = async (id, status) => {
    try {
      setLoading(true);
      const response = await api.put(`/${id}/status`, { status });
      setTickets(prev =>
        prev.map(ticket =>
          ticket._id === id ? response.data.data : ticket
        )
      );
      if (currentTicket && currentTicket._id === id) {
        setCurrentTicket(response.data.data);
      }
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear errors
  const clearErrors = () => {
    setError(null);
  };

  useEffect(() => {
    // Initialize with auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return (
    <SupportContext.Provider
      value={{
        tickets,
        currentTicket,
        loading,
        error,
        createTicket,
        fetchTickets,
        fetchTicket,
        updateTicketStatus,
        setAuthToken,
        clearErrors,
        setCurrentTicket,
      }}
    >
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = () => {
  const context = useContext(SupportContext);
  if (context === undefined) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
};