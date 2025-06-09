import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Building, Calendar, Star, Users, Camera, Utensils, Lightbulb } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    businessName: '',
    serviceType: '',
    gstNumber: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', { ...formData, userType, isLogin });
  };

  const getUserTypeIcon = (type) => {
    return type === 'user' ? <User className="w-4 h-4" /> : <Building className="w-4 h-4" />;
  };

  const getUserTypeColor = (type) => {
    if (type === 'user') {
      return userType === type ? 'bg-purple-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-purple-50';
    } else {
      return userType === type ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50';
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel - Image/Branding Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-700 to-blue-500 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-white rounded-full"></div>
          <div className="absolute bottom-40 right-10 w-24 h-24 bg-white rounded-full"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 w-full flex flex-col justify-center items-center text-white p-12 text-center">
          <div className="mb-8">
            <Calendar className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">EventWala</h1>
            <p className="text-xl opacity-90">Your Dream Events, Our Expertise</p>
          </div>
          
          <div className="space-y-6 max-w-md">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Why Choose EventWala?</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>Top Vendors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Expert Team</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Camera className="w-4 h-4" />
                  <span>Photography</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Utensils className="w-4 h-4" />
                  <span>Catering</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="opacity-90">Events</div>
                </div>
                <div className="w-px h-8 bg-white opacity-30"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold">200+</div>
                  <div className="opacity-90">Vendors</div>
                </div>
                <div className="w-px h-8 bg-white opacity-30"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50+</div>
                  <div className="opacity-90">Cities</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating Icons */}
          <div className="absolute top-20 left-1/4">
            <Lightbulb className="w-8 h-8 opacity-30 animate-pulse" />
          </div>
          <div className="absolute bottom-20 right-1/4">
            <Camera className="w-6 h-6 opacity-40 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          {/* Mobile Header */}
          <div className="text-center lg:hidden mb-8">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-purple-700 mr-2" />
              <h1 className="text-3xl font-bold text-purple-700">EventWala</h1>
            </div>
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isLogin ? 'Welcome Back!' : 'Join EventWala'}
            </h2>
            <p className="text-gray-600">
              {isLogin 
                ? 'Sign in to manage your events and bookings' 
                : 'Create your account and start planning amazing events'
              }
            </p>
          </div>

          {/* User Type Selection */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-700 text-center">
              {isLogin ? 'Login as:' : 'Register as:'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {['user', 'vendor'].map((type) => (
                <button
                  key={type}
                  onClick={() => setUserType(type)}
                  className={`flex items-center justify-center space-x-2 py-4 px-4 rounded-xl font-medium text-sm transition-all duration-200 border-2 ${getUserTypeColor(type)} ${
                    userType === type 
                      ? (type === 'user' ? 'border-purple-700' : 'border-blue-500') 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {getUserTypeIcon(type)}
                  <span className="capitalize font-semibold">
                    {type === 'user' ? 'User' : 'Service Provider'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Full Name - Only for signup */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {userType === 'vendor' ? 'Contact Person Name' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Business Name - Only for vendor signup */}
              {!isLogin && userType === 'vendor' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your business name"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Service Type - Only for vendor signup */}
              {!isLogin && userType === 'vendor' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Category
                  </label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                  >
                    <option value="">Select your service category</option>
                    <option value="tent">Tent & Decoration</option>
                    <option value="catering">Catering Services</option>
                    <option value="photography">Photography & Videography</option>
                    <option value="lighting">Lighting & Sound Systems</option>
                    <option value="flowers">Floral Arrangements</option>
                    <option value="transport">Transportation Services</option>
                    <option value="entertainment">Entertainment & DJ</option>
                    <option value="venue">Venue Management</option>
                    <option value="other">Other Services</option>
                  </select>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              {/* Phone - Only for signup */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              )}

              {/* GST Number - Only for vendor signup */}
              {!isLogin && userType === 'vendor' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Number <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter GST number"
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password - Only for signup */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Forgot Password - Only for login */}
            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className={`w-full py-4 px-4 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl ${
                userType === 'vendor' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-200' 
                  : 'bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 focus:ring-4 focus:ring-purple-200'
              }`}
            >
              {isLogin ? 'Sign In to EventWala' : 'Create My Account'}
            </button>

            {/* Terms - Only for signup */}
            {!isLogin && (
              <p className="text-xs text-gray-600 text-center leading-relaxed">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-purple-600 hover:text-purple-700 font-medium underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-purple-600 hover:text-purple-700 font-medium underline">
                  Privacy Policy
                </a>
              </p>
            )}
          </div>

          {/* Toggle Login/Signup */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              {isLogin ? "New to EventWala?" : "Already have an account?"}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200"
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;