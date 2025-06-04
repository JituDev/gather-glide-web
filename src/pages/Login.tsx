
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '../contexts/EventContext';
import { User, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { login } = useEvent();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, isVendor ? 'vendor' : 'customer');
    navigate('/venues');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=800&fit=crop"
          alt="Event Setup"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              GROW YOUR BUSINESS WITH EVENT WALA
            </h1>
            <p className="text-gray-600">
              {isSignUp ? 'Create your account' : 'Sign in to access your Dashboard'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="ENTER YOUR NAME"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 py-4 text-center bg-white border-gray-200"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                placeholder={isSignUp ? "ENTER YOUR EMAIL" : "bhagyashreekhuntia41@gmail.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 py-4 text-center bg-white border-gray-200"
                required
              />
            </div>

            <div className="relative">
              <div className="flex justify-center mb-4">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full bg-gray-300 mx-1"
                  ></div>
                ))}
              </div>
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full py-4 bg-teal-800 hover:bg-teal-900 text-white font-semibold"
            >
              CONTINUE
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-gray-600 hover:text-teal-600"
              >
                {isSignUp ? 'Already have an account? Sign In' : 'Register as a vendor ? Sign Up'}
              </button>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <span className="text-gray-600">Are you a customer ?</span>
              <Button
                type="button"
                variant="outline"
                className="bg-teal-800 text-white hover:bg-teal-900"
                onClick={() => setIsVendor(!isVendor)}
              >
                {isVendor ? 'Vendor Sign In' : 'Customer Sign In'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
