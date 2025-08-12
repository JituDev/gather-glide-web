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
  // createCategory: (formData: FormData) => Promise<Category>;

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
    const [allBookings, setAllBookings] = useState<any[]>([]);
    // const [allVendors, setAllVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


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

   const getAllBookings = async (queryParams = "") => {
       try {
           setLoading(true);
           setError(null);

           // Convert URLSearchParams to object if needed
           const params = new URLSearchParams(queryParams);
           const queryObject = {};
           params.forEach((value, key) => {
               queryObject[key] = value;
           });

           const response = await api.get("/api/admin/bookings", {
               params: queryObject, // Axios will properly serialize this
           });

           setAllBookings(response.data.data);
       } catch (err: any) {
           setError(err.response?.data?.message || "Failed to fetch bookings");
           throw err;
       } finally {
           setLoading(false);
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


// Updated Category functions
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

  const createCategory = async (formData: {
    title: string;
    subCategories: string[] | string;
    config: object | string;
    image: File;
  }) => {
    try {
      setLoadingCategories(true);
      
      // Prepare FormData for file upload
      const fd = new FormData();
      fd.append('title', formData.title);
      
      // Handle subCategories - can be array or string
      if (Array.isArray(formData.subCategories)) {
        fd.append('subCategories', JSON.stringify(formData.subCategories));
      } else {
        fd.append('subCategories', formData.subCategories);
      }
      
      // Handle config - can be object or JSON string
      if (typeof formData.config === 'object') {
        fd.append('config', JSON.stringify(formData.config));
      } else {
        fd.append('config', formData.config);
      }
      
      fd.append('categoryImage', formData.image);

      const response = await api.post('/api/admin/categories', fd, {
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

  const updateCategory = async (id: string, formData: {
    title?: string;
    subCategories?: string[] | string;
    config?: object | string;
    image?: File;
  }) => {
    try {
      setLoadingCategories(true);
      
      const fd = new FormData();
      
      if (formData.title) fd.append('title', formData.title);
      
      if (formData.subCategories) {
        if (Array.isArray(formData.subCategories)) {
          fd.append('subCategories', JSON.stringify(formData.subCategories));
        } else {
          fd.append('subCategories', formData.subCategories);
        }
      }
      
      if (formData.config) {
        if (typeof formData.config === 'object') {
          fd.append('config', JSON.stringify(formData.config));
        } else {
          fd.append('config', formData.config);
        }
      }
      
      if (formData.image) fd.append('categoryImage', formData.image);

      const response = await api.put(`/api/admin/categories/${id}`, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setCategories(categories.map(cat => 
        cat._id === id ? response.data.data : cat
      ));
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      throw new Error(err.response?.data?.message || 'Failed to update category');
    } finally {
      setLoadingCategories(false);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setLoadingCategories(true);
      await api.delete(`/api/admin/categories/${id}`);
      setCategories(categories.filter(cat => cat._id !== id));
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      throw new Error(err.response?.data?.message || 'Failed to delete category');
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
      updateCategory,
      deleteCategory,

      // Offers
      offers,
      loadingOffers,
      errorOffers,
      currentOffer,
      getOffers,
      getOffer,


      allBookings,
      getAllBookings,
      loading,
      error,
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