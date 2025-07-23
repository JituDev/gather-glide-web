import { createContext, useContext, useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useVendor } from './VendorContext';

// Types
interface Service {
  _id: string;
  vendor: string | {
    _id: string;
    name: string;
    profilePhoto?: string;
  };
  title: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  category: string | {
    _id: string;
    title: string;
  };
  subCategory: string;
  tags: string[];
  images: string[];
  location: string;
  phone?: string;
  website?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface ServiceContextType {
  // Service Management
  services: Service[];
  currentService: Service | null;
  loadingServices: boolean;
  errorServices: string | null;

  // Vendor Services
  vendorServices: Service[];
  loadingVendorServices: boolean;
  errorVendorServices: string | null;

  // Category Services
  categoryServices: Service[];
  loadingCategoryServices: boolean;
  errorCategoryServices: string | null;

  // Search Results
  searchResults: Service[];
  loadingSearch: boolean;
  errorSearch: string | null;

  // CRUD Operations
  createService: (formData: FormData) => Promise<Service>;
  getVendorServices: (vendorId: string) => Promise<Service[]>;
  updateService: (id: string, formData: FormData) => Promise<Service>;
  deleteService: (id: string) => Promise<void>;
  getService: (id: string) => Promise<Service>;

  // Public Queries
  getServicesByCategory: (category: string, location?: string, search?: string) => Promise<Service[]>;
  searchServices: (query: string, location?: string, category?: string) => Promise<Service[]>;
  getAllServices: () => Promise<Service[]>;
}

export interface Variant {
    name: string;
    unit: string;
    price: number;
    minQty?: number;
    maxQty?: number;
}


// Create context
const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

// Provider component
export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { vendorId } = useVendor();
  const [services, setServices] = useState<Service[]>([]);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [loadingServices, setLoadingServices] = useState(false);
  const [errorServices, setErrorServices] = useState<string | null>(null);
  const token = localStorage.getItem('token'); // Or use useAuth() if preferred

  const [vendorServices, setVendorServices] = useState<Service[]>([]);
  const [loadingVendorServices, setLoadingVendorServices] = useState(false);
  const [errorVendorServices, setErrorVendorServices] = useState<string | null>(null);

  const [categoryServices, setCategoryServices] = useState<Service[]>([]);
  const [loadingCategoryServices, setLoadingCategoryServices] = useState(false);
  const [errorCategoryServices, setErrorCategoryServices] = useState<string | null>(null);

  const [searchResults, setSearchResults] = useState<Service[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [errorSearch, setErrorSearch] = useState<string | null>(null);

  // Axios instance with auth header
  const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/services`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

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

  const createService = async (formData: FormData, variants?: Variant[]) => {
      try {
          setLoadingServices(true);
          if (!token) throw new Error("User not authenticated");
          setErrorServices(null);

          // 🆕 Append variants if provided
          if (variants && Array.isArray(variants)) {
              formData.append("variants", JSON.stringify(variants));
          }

          const response = await api.post("/", formData, {
              headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
              },
          });

          setServices([...services, response.data.data]);
          return response.data.data;
      } catch (error) {
          const err = error as AxiosError<{ message?: string }>;
          setErrorServices(err.response?.data?.message || "Failed to create service");
          throw err;
      } finally {
          setLoadingServices(false);
      }
  };


  const getVendorServices = async (vendorId: string) => {
    try {
      setLoadingVendorServices(true);
      setErrorVendorServices(null);
      const response = await api.get(`/vendor/${vendorId}`);
      setVendorServices(response.data.data);
      console.log('getVendorServices', response.data.data)
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setErrorVendorServices(err.response?.data?.message || 'Failed to fetch vendor services');
      throw err;
    } finally {
      setLoadingVendorServices(false);
    }
  };

  const updateService = async (
      id: string,
      formData: {
          title?: string;
          description?: string;
          minPrice?: number;
          maxPrice?: number;
          category?: string;
          subCategory?: string;
          tags?: string[] | string;
          location?: string;
          phone?: string;
          website?: string;
          socialLinks?: string[];
          details?: object | string;
          faqs?: Array<{ question: string; answer: string }> | string;
          images?: File[];
          variants?: Variant[];
          removeImages?: string[]; // URLs of images to remove
      }
  ) => {
      try {
          setLoadingServices(true);
          if (!token) throw new Error("User not authenticated");

          // Prepare FormData for file upload
          const fd = new FormData();

          // Append all basic fields if they exist
          if (formData.title) fd.append("title", formData.title);
          if (formData.description) fd.append("description", formData.description);
          if (formData.minPrice) fd.append("minPrice", formData.minPrice.toString());
          if (formData.maxPrice) fd.append("maxPrice", formData.maxPrice.toString());
          if (formData.category) fd.append("category", formData.category);
          if (formData.subCategory) fd.append("subCategory", formData.subCategory);
          if (formData.location) fd.append("location", formData.location);
          if (formData.phone) fd.append("phone", formData.phone);
          if (formData.website) fd.append("website", formData.website);
          if (formData.variants && Array.isArray(formData.variants)) {
              fd.append("variants", JSON.stringify(formData.variants));
          }

          // Handle tags - can be array or string
          if (formData.tags) {
              if (Array.isArray(formData.tags)) {
                  fd.append("tags", JSON.stringify(formData.tags));
              } else {
                  fd.append("tags", formData.tags);
              }
          }

          // Handle socialLinks
          if (formData.socialLinks) {
              fd.append("socialLinks", JSON.stringify(formData.socialLinks));
          }

          // Handle details - can be object or JSON string
          if (formData.details) {
              if (typeof formData.details === "object") {
                  fd.append("details", JSON.stringify(formData.details));
              } else {
                  fd.append("details", formData.details);
              }
          }

          // Handle FAQs - can be array or JSON string
          if (formData.faqs) {
              if (Array.isArray(formData.faqs)) {
                  fd.append("faqs", JSON.stringify(formData.faqs));
              } else {
                  fd.append("faqs", formData.faqs);
              }
          }

          // Handle images to remove
          if (formData.removeImages && formData.removeImages.length > 0) {
              fd.append("removeImages", JSON.stringify(formData.removeImages));
          }

          // Handle new images
          if (formData.images) {
              formData.images.forEach((image) => {
                  fd.append("images", image);
              });
          }

          const response = await api.put(`/${id}`, fd, {
              headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
              },
          });

          setServices(
              services.map((service) => (service._id === id ? response.data.data : service))
          );

          if (currentService?._id === id) {
              setCurrentService(response.data.data);
          }

          return response.data.data;
      } catch (error) {
          const err = error as AxiosError<{ message?: string }>;
          throw new Error(err.response?.data?.message || "Failed to update service");
      } finally {
          setLoadingServices(false);
      }
  };


  const deleteService = async (id: string) => {
    try {
      setLoadingServices(true);
      if (!token) throw new Error('User not authenticated');
      await api.delete(`/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Include Bearer token
        },
      });
      setServices(services.filter(service => service._id !== id));
      if (currentService?._id === id) {
        setCurrentService(null);
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      throw new Error(err.response?.data?.message || 'Failed to delete service');
    } finally {
      setLoadingServices(false);
    }
  };

  const getService = async (id: string) => {
    try {
      setLoadingServices(true);
      setErrorServices(null);
      const response = await api.get(`/${id}`);
      setCurrentService(response.data.data);
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setErrorServices(err.response?.data?.message || 'Failed to fetch service');
      throw err;
    } finally {
      setLoadingServices(false);
    }
  };

  // Public Service Queries
  const getServicesByCategory = async (category: string, location?: string, search?: string) => {
    try {
      setLoadingCategoryServices(true);
      setErrorCategoryServices(null);
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (search) params.append('search', search);

      const response = await api.get(`/category/${category}?${params.toString()}`);
      setCategoryServices(response.data.data);
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setErrorCategoryServices(err.response?.data?.message || 'Failed to fetch category services');
      throw err;
    } finally {
      setLoadingCategoryServices(false);
    }
  };

  const searchServices = async (query: string, location?: string, category?: string) => {
  try {
    setLoadingSearch(true);
    setErrorSearch(null);
    const params = new URLSearchParams({ q: query });
    if (location) params.append('location', location);
    if (category) params.append('category', category);

    const response = await api.get(`/search?${params.toString()}`);
    // Ensure we don't set null or undefined
    const data = response.data.data || [];
    console.log("data",data);
    setServices(data);
    setSearchResults(data);
    return data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    setErrorSearch(err.response?.data?.message || 'Failed to search services');
    // Return empty array instead of throwing if you want to handle it gracefully
    return [];
  } finally {
    setLoadingSearch(false);
  }
};

  const getAllServices = async () => {
    try {
      setLoadingServices(true);
      setErrorServices(null);
      const response = await api.get('/all');
      setServices(response.data.data);
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setErrorServices(err.response?.data?.message || 'Failed to fetch all services');
      throw err;
    } finally {
      setLoadingServices(false);
    }
  };

  const value: ServiceContextType = {
    // Service Management
    setServices,
    services,
    currentService,
    loadingServices,
    errorServices,

    // Vendor Services
    vendorServices,
    loadingVendorServices,
    errorVendorServices,

    // Category Services
    categoryServices,
    loadingCategoryServices,
    errorCategoryServices,

    // Search Results
    searchResults,
    loadingSearch,
    errorSearch,

    // CRUD Operations
    createService,
    getVendorServices,
    updateService,
    deleteService,
    getService,

    // Public Queries
    getServicesByCategory,
    searchServices,
    getAllServices
  };

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
};

// Custom hook to use the service context
export const useService = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
};