import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Define types
type BlockDetails = {
  blockedAt?: Date;
  blockedBy?: string;
  unblockedAt?: Date;
  unblockedBy?: string;
  reason?: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'vendor' | 'admin';
  isApproved?: boolean;
  isBlocked?: boolean;
  blockDetails?: BlockDetails;
  category?: string;
  profilePhoto?: string;
  businessName?: string;
  address?: string;
  phoneNumber?: string;
  createdAt?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (data: RegisterData, profilePhoto?: File) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  updateProfile: (updatedData: Partial<User>) => Promise<void>;
  isAuthenticated: () => boolean;
  hasRole: (role: User['role']) => boolean;
  isVendorApproved: () => boolean;
  setError: (error: string | null) => void;
  // Admin functions
  getUsers: (queryParams?: GetUsersQueryParams) => Promise<PaginatedUsersResponse>;
  getUser: (id: string) => Promise<User>;
  blockUser: (id: string, reason: string) => Promise<User>;
  unblockUser: (id: string) => Promise<User>;
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: 'user' | 'vendor' | 'admin';
  category?: string;
  businessName?: string;
};

type LoginData = {
  email: string;
  password: string;
};

type ResetPasswordData = {
  email: string;
  otp: string;
  newPassword: string;
};

// Types for admin user management
type GetUsersQueryParams = {
  role?: 'user' | 'vendor' | 'admin';
  isApproved?: boolean;
  isBlocked?: boolean;
  page?: number;
  limit?: number;
};

type PaginatedUsersResponse = {
  success: boolean;
  count: number;
  total: number;
  pagination: {
    page: number;
    limit: number;
    pages: number;
  };
  data: User[];
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ReactNode | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || null;

  // Initialize axios with base URL from .env
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/api/auth/me');
          setUser(response.data.data);
        }
      } catch (err) {
        console.error('Authentication initialization error:', err);
        logout(); // Clear invalid token
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Register user
  const register = async (data: RegisterData, profilePhoto?: File) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append("phoneNumber", String(data.phoneNumber));

      formData.append('role', data.role);
      if (data.role === 'vendor' && data.category && data.businessName) {
        formData.append('category', data.category);
        formData.append('businessName', data.businessName);
      }
      if (profilePhoto) formData.append('profilePhoto', profilePhoto);

      const response = await api.post('/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(response.data.data);

      // Redirect based on role
      if (data.role === 'vendor') {
        navigate('/');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
  setLoading(true);
  setError(null);
  try {
    const response = await api.post('/api/auth/login', data);
    const { token } = response.data;
    console.log("token", token);
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    const userData = response.data.data.user;
    
    if (userData.isBlocked) {
      localStorage.removeItem('token');
      setError(
        <span>
          Your account has been blocked by admin. 
          <a 
            href="/help" 
            onClick={(e) => {
              e.preventDefault();
              navigate('/help');
            }}
            style={{ color: '#1890ff', textDecoration: 'underline', marginLeft: '5px' }}
          >
            Click here
          </a> for support.
        </span>
      );
      setLoading(false);
      return;
    }
    
    setUser(userData);

    if (userData.role === 'admin') {
      navigate('/adminprofile');
    } else if (userData.role === 'vendor') {
      navigate('/vendorprofile');
    } else {
      navigate('/');
    }
  } catch (err: any) {
    setError(err.response?.data?.error || 'Login failed');
    console.log("err", err);
    throw err;
  } finally {
    setLoading(false);
  }
};

  // Logout user
  const logout = async () => {
    try {
      await api.get('/api/auth/logout');
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Even if logout API fails, clear client-side auth
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      navigate('/login');
    }
  };

  // Forgot password - send OTP
  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/api/auth/forgot-password', { email });
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password with OTP
  const resetPassword = async (data: ResetPasswordData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put('/api/auth/reset-password', data);
      
      const { token } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(response.data.data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updatedData: Partial<User>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(
        '/api/auth/update-profile',
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Get all users with pagination
  const getUsers = async (queryParams: GetUsersQueryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { page = 1, limit = 10, role, isApproved } = queryParams;
      
      const params = new URLSearchParams();
      if (role) params.append('role', role);
      if (isApproved !== undefined) params.append('isApproved', String(isApproved));
      params.append('page', String(page));
      params.append('limit', String(limit));

      const response = await api.get(`/api/auth/users?${params.toString()}`,{
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Get single user
  const getUser = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/auth/users/${id}`,{
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Block a user
  const blockUser = async (id: string, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/api/admin/users/${id}/block`, { reason },{
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to block user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Unblock a user
  const unblockUser = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/api/admin/users/${id}/unblock`,{},{
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to unblock user');
      throw err;
    } finally {
      setLoading(false);
    }
  };


  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !user.isBlocked  && !!localStorage.getItem('token');
  };

  // Check user role
  const hasRole = (role: User['role']) => {
    return user?.role === role;
  };

  // Check if vendor is approved
  const isVendorApproved = () => {
    return user?.role === 'vendor' && user?.isApproved;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        isAuthenticated,
        hasRole,
        isVendorApproved,
        setError,
        // Admin functions
        getUsers,
        getUser,
        blockUser,
        unblockUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};