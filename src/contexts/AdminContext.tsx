import React, { createContext, useContext, useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import api from '../utils/axiosInstance'

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isApproved?: boolean;
  // Add other user properties as needed
}

interface Category {
  _id: string;
  title: string;
  subCategories: string[];
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Offer {
  _id: string;
  title: string;
  description: string;
  discount: number;
  validTill: Date;
  isActive: boolean;
  vendor: User;
  service: {
    _id: string;
    title: string;
    category: string;
    location: string;
  };
  // Add other offer properties as needed
}

interface PaginatedOffers {
  data: Offer[];
  count: number;
  total: number;
  currentPage: number;
  totalPages: number;
}

interface AdminContextType {
  // Vendors
  vendors: User[];
  loadingVendors: boolean;
  errorVendors: string | null;
  getVendors: () => Promise<void>;
  approveVendor: (id: string, isApproved: boolean) => Promise<void>;

  // Categories
  categories: Category[];
  loadingCategories: boolean;
  errorCategories: string | null;
  getCategories: () => Promise<void>;
  createCategory: (formData: FormData) => Promise<Category>;

  // Offers
  offers: Offer[];
  loadingOffers: boolean;
  errorOffers: string | null;
  currentOffer: Offer | null;
  getOffers: (page?: number, limit?: number, active?: boolean) => Promise<PaginatedOffers>;
  getOffer: (id: string) => Promise<Offer>;
}

// Create context
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Provider component
export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vendors, setVendors] = useState<User[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [errorVendors, setErrorVendors] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [errorOffers, setErrorOffers] = useState<string | null>(null);

  // Axios instance with auth header
//   const api = axios.create({
//     baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/admin`,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

  // Set auth token if available
  const setAuthToken = (token: string | null) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  // Initialize auth token (you might get this from your auth context)
  useEffect(() => {
    const token = localStorage.getItem('token'); // Adjust based on your auth setup
    setAuthToken(token);
  }, []);

  // Vendor functions
  const getVendors = async () => {
    try {
      setLoadingVendors(true);
      setErrorVendors(null);
      const response = await api.get('/api/admin/vendors');
      setVendors(response.data.data);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setErrorVendors(err.response?.data?.message || 'Failed to fetch vendors');
    } finally {
      setLoadingVendors(false);
    }
  };

  const approveVendor = async (id: string, isApproved: boolean) => {
  try {
    setLoadingVendors(true);

    const token = localStorage.getItem('token'); // 🔑 Fetch your token

    const response = await api.put(
      `/api/admin/vendors/${id}/approve`,
      { isApproved },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setVendors(vendors.map(vendor =>
      vendor._id === id ? { ...vendor, isApproved } : vendor
    ));
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    throw new Error(err.response?.data?.message || 'Failed to update vendor status');
  } finally {
    setLoadingVendors(false);
  }
};


  // Category functions
  const getCategories = async () => {
    try {
      setLoadingCategories(true);
      setErrorCategories(null);
      const response = await api.get('/api/admin/categories');
      setCategories(response.data.data);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setErrorCategories(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const createCategory = async (formData: FormData) => {
    try {
      setLoadingCategories(true);
      const response = await api.post('/api/admin/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCategories([...categories, response.data.data]);
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      throw new Error(err.response?.data?.message || 'Failed to create category');
    } finally {
      setLoadingCategories(false);
    }
  };

  // Offer functions
  const getOffers = async (page = 1, limit = 10, active?: boolean) => {
    try {
      setLoadingOffers(true);
      setErrorOffers(null);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (active !== undefined) {
        params.append('active', active.toString());
      }
      const response = await api.get(`/api/admin/offers?${params.toString()}`);
      setOffers(response.data.data);
      return {
        data: response.data.data,
        count: response.data.count,
        total: response.data.total,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setErrorOffers(err.response?.data?.message || 'Failed to fetch offers');
      throw err;
    } finally {
      setLoadingOffers(false);
    }
  };

  const getOffer = async (id: string) => {
    try {
      setLoadingOffers(true);
      const response = await api.get(`/api/offers/${id}`);
      setCurrentOffer(response.data.data);
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      throw new Error(err.response?.data?.message || 'Failed to fetch offer');
    } finally {
      setLoadingOffers(false);
    }
  };

  const value: AdminContextType = {
    // Vendors
    vendors,
    loadingVendors,
    errorVendors,
    getVendors,
    approveVendor,

    // Categories
    categories,
    loadingCategories,
    errorCategories,
    getCategories,
    createCategory,

    // Offers
    offers,
    loadingOffers,
    errorOffers,
    currentOffer,
    getOffers,
    getOffer,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

// Custom hook to use the admin context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};