import { createContext, useContext, useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import api from '../utils/axiosInstance'
import { useAuth } from './AuthContext';
// Types
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isApproved?: boolean;
  description?: string;
  category?: string;
  galleryImages?: string[];
  services?: Service[];
}

interface Service {
  _id: string;
  title: string;
  category: string;
  // Add other service properties as needed
}

interface Offer {
  _id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  validFrom: Date;
  validTill: Date;
  isActive: boolean;
  bannerImage: string;
  service: Service | string;
  vendor: User | string;
  // Add other offer properties as needed
}

interface VendorContextType {
  // Vendor Data
  currentVendor: User | null;
  loadingVendor: boolean;
  errorVendor: string | null;
  getVendor: (id: string) => Promise<void>;
  updateVendor: (id: string, data: Partial<User>) => Promise<User>;

  // Gallery Images
  uploadingImages: boolean;
  uploadGalleryImages: (id: string, files: File[]) => Promise<string[]>;

  // Offers
  offers: Offer[];
  loadingOffers: boolean;
  errorOffers: string | null;
  currentOffer: Offer | null;
  getMyOffers: () => Promise<void>;
  createOffer: (offerData: FormData) => Promise<Offer>;
  updateOffer: (id: string, offerData: FormData) => Promise<Offer>;
  deleteOffer: (id: string) => Promise<void>;
  toggleOfferStatus: (id: string) => Promise<Offer>;

  // Add this line 👇
  vendorId: string | undefined;

}

// Create context
const VendorContext = createContext<VendorContextType | undefined>(undefined);

// Provider component
export const VendorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const vendorId = user?._id;

  const [currentVendor, setCurrentVendor] = useState<User | null>(null);
  const [loadingVendor, setLoadingVendor] = useState(false);
  const [errorVendor, setErrorVendor] = useState<string | null>(null);

  const [uploadingImages, setUploadingImages] = useState(false);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [errorOffers, setErrorOffers] = useState<string | null>(null);

  // Axios instance with auth header
  //   const api = axios.create({
  //     baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/vendors`,
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
  const getVendor = async (id?: string) => {
  const vendorId = id || user?._id;

  if (!vendorId) {
    setErrorVendor('Vendor ID not available');
    throw new Error('Vendor ID not available');
  }

  try {
    setLoadingVendor(true);
    setErrorVendor(null);
    const response = await api.get(`/api/vendors/${vendorId}`);
    setCurrentVendor(response.data.data);
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    setErrorVendor(err.response?.data?.message || 'Failed to fetch vendor');
    throw err;
  } finally {
    setLoadingVendor(false);
  }
};

  const updateVendor = async (id: string, data: Partial<User>) => {
    try {
      setLoadingVendor(true);
      const response = await api.put(`/api/vendors/${id}`, data);
      setCurrentVendor(response.data.data);
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      throw new Error(err.response?.data?.message || 'Failed to update vendor');
    } finally {
      setLoadingVendor(false);
    }
  };

  // Gallery functions
  const uploadGalleryImages = async (id: string, files: File[]) => {
    try {
      setUploadingImages(true);
      const formData = new FormData();
      files.forEach(file => {
        formData.append('galleryImages', file);
      });

      const response = await api.post(`/api/vendors/${id}/gallery`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update current vendor's gallery images
      if (currentVendor) {
        setCurrentVendor({
          ...currentVendor,
          galleryImages: response.data.data
        });
      }

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      throw new Error(err.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const deleteGalleryImage = async (id: string, imageUrl: string) => {
  try {
    setUploadingImages(true);
    const response = await api.delete(`/api/vendors/${id}/gallery/delete`, {
      data: { imageUrl } // Send image URL in request body
    });

    // Update current vendor's gallery images by removing the deleted image
    if (currentVendor) {
      setCurrentVendor({
        ...currentVendor,
        galleryImages: currentVendor.galleryImages?.filter(img => img !== imageUrl)
      });
    }

    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    throw new Error(err.response?.data?.message || 'Failed to delete image');
  } finally {
    setUploadingImages(false);
  }
};

  // Offer functions
  const getMyOffers = async () => {
    try {
      setLoadingOffers(true);
      setErrorOffers(null);
      const response = await api.get('/api/offer/my-offers');
      setOffers(response.data.data);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setErrorOffers(err.response?.data?.message || 'Failed to fetch offers');
    } finally {
      setLoadingOffers(false);
    }
  };

  const createOffer = async (offerData: FormData) => {
    try {
      setLoadingOffers(true);
      const response = await api.post('/api/offer', offerData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setOffers([response.data.data, ...offers]);
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      throw new Error(err.response?.data?.message || 'Failed to create offer');
    } finally {
      setLoadingOffers(false);
    }
  };

  const updateOffer = async (id: string, offerData: FormData) => {
    try {
      setLoadingOffers(true);
      const response = await api.put(`/api/offer/${id}`, offerData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setOffers(offers.map(offer =>
        offer._id === id ? response.data.data : offer
      ));
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      throw new Error(err.response?.data?.message || 'Failed to update offer');
    } finally {
      setLoadingOffers(false);
    }
  };

  const deleteOffer = async (id: string) => {
    try {
      setLoadingOffers(true);
      await api.delete(`/api/offer/${id}`);
      setOffers(offers.filter(offer => offer._id !== id));
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      throw new Error(err.response?.data?.message || 'Failed to delete offer');
    } finally {
      setLoadingOffers(false);
    }
  };

  const toggleOfferStatus = async (id: string) => {
    try {
      setLoadingOffers(true);
      const response = await api.put(`/api/offer/${id}/toggle-status`);
      setOffers(offers.map(offer =>
        offer._id === id ? response.data.data : offer
      ));
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      throw new Error(err.response?.data?.message || 'Failed to toggle offer status');
    } finally {
      setLoadingOffers(false);
    }
  };

  const value: VendorContextType = {
    // Vendor Data
    currentVendor,
    loadingVendor,
    errorVendor,
    getVendor,
    updateVendor,

    // Gallery Images
    uploadingImages,
    uploadGalleryImages,
    deleteGalleryImage,

    // Offers
    offers,
    loadingOffers,
    errorOffers,
    currentOffer,
    getMyOffers,
    createOffer,
    updateOffer,
    deleteOffer,
    toggleOfferStatus,

     vendorId, // 👈 Add this
  };

  return <VendorContext.Provider value={value}>{children}</VendorContext.Provider>;
};

// Custom hook to use the vendor context
export const useVendor = () => {
  const context = useContext(VendorContext);
  if (context === undefined) {
    throw new Error('useVendor must be used within a VendorProvider');
  }
  return context;
};