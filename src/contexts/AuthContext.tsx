import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Define types
type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'vendor' | 'admin';
  isApproved?: boolean;
  category?: string;
  profilePhoto?: string;
  businessName? : string;
  address? :string;
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
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
  phoneNumber : string;
  role: 'user' | 'vendor' | 'admin';
  category?: string;
  businessName?:string;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || null ;

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

  // Login user
  const login = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/auth/login', data);
      const { token } = response.data;
      console.log("token",token)
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(response.data.data);

      // Redirect based on role
      if (response.data.data.role === 'admin') {
        navigate('/adminprofile');
      } else if (response.data.data.role === 'vendor') {
        navigate('/vendorprofile');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
      console.log("err",err)
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

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
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
        setError
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