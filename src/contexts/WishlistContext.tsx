import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
// import {  toast } from 'react-// toastify';

interface Service {
  _id: string;
  // Add other service properties as needed
}

interface WishlistContextType {
    wishlist: Service[]; // Changed from string[] to Service[]
    loading: boolean;
    error: string | null;
    getWishlist: () => Promise<void>;
    addToWishlist: (serviceId: string) => Promise<void>;
    removeFromWishlist: (serviceId: string) => Promise<void>;
    isInWishlist: (serviceId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<Service[]>([]); // Changed from string[] to Service[]
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const api = axios.create({
        baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/wishlist`,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }, [user]);

    const getWishlist = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!user) {
                setWishlist([]);
                return;
            }

            const response = await api.get('/');
            setWishlist(response.data.data); // Now storing full service objects
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch wishlist');
            console.error('Error fetching wishlist:', err);
            if (err.response?.status === 401) {
                setWishlist([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (serviceId: string) => {
        try {
            setLoading(true);

            if (!user) {
                throw new Error('Please login to add to wishlist');
            }

            // First add to backend
            await api.post(`/${serviceId}`);
            
            // Then fetch updated wishlist from server
            await getWishlist();
            
            // toast.success('Added to wishlist');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message ||
                err.message ||
                'Failed to add to wishlist';
            setError(errorMessage);
            console.error('Error adding to wishlist:', err);
            // toast.error(errorMessage);

            if (err.response?.status === 401) {
                // toast.error('Session expired. Please login again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (serviceId: string) => {
        try {
            setLoading(true);

            if (!user) {
                throw new Error('Please login to modify wishlist');
            }

            // First remove from backend
            await api.delete(`/${serviceId}`);
            
            // Then fetch updated wishlist from server
            await getWishlist();
            
            // toast.success('Removed from wishlist');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message ||
                err.message ||
                'Failed to remove from wishlist';
            setError(errorMessage);
            console.error('Error removing from wishlist:', err);
            // toast.error(errorMessage);

            if (err.response?.status === 401) {
                // toast.error('Session expired. Please login again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const isInWishlist = (serviceId: string) => {
        // Check if any service in wishlist has this ID
        return wishlist.some(service => service._id === serviceId);
    };

    useEffect(() => {
        getWishlist();
    }, [user]);

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                loading,
                error,
                getWishlist,
                addToWishlist,
                removeFromWishlist,
                isInWishlist
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = (): WishlistContextType => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};