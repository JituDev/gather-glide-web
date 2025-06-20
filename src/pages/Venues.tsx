import React, { useState, useEffect } from 'react';
import {
  Search,
  List,
  Star,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Home,
  Filter,
  ChevronDown,
  Heart,
  Eye,
  ArrowRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { useService } from '@/contexts/ServiceContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface Service {
  _id: string;
  title: string;
  description: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  pricePerPlate?: number;
  rating?: number;
  reviews?: number;
  capacity?: string;
  type?: string;
  tags?: string[];
  category: {
    _id: string;
    title: string;
  };
  vendor: {
    _id: string;
    name: string;
    profilePhoto?: string;
  };
  images: string[];
  features?: string[];
  space?: string;
  createdAt: string;
}

interface Category {
  _id: string;
  title: string;
  count?: number;
  icon?: React.ComponentType<{ className?: string }>;
  image?: string;
}

const ServicesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [favorites, setFavorites] = useState(new Set<string>());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isInWishlist, addToWishlist, removeFromWishlist, loading: wishlistLoading } = useWishlist();

  const handleWishlistToggle = async (id: string) => {
    if (isInWishlist(id)) {
      await removeFromWishlist(id);
    } else {
      await addToWishlist(id);
    }
  };


  const { getCategories, categories } = useAdmin();
  const {
    getAllServices,
    getServicesByCategory,
    searchServices,
    services,
    setServices
  } = useService();

  // ✅ Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // 500ms delay

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch services based on filters

  // ✅ API call based on debounced search
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError('');

        let response;
        if (selectedCategory) {
          response = await getServicesByCategory(selectedCategory, locationFilter, debouncedSearchTerm);
        } else if (debouncedSearchTerm || locationFilter) {
          response = await searchServices(debouncedSearchTerm, locationFilter, selectedCategory);
        } else {
          response = await getAllServices();
        }

        setServices(response);
      } catch (err) {
        setError('Failed to fetch services. Please try again.');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedCategory, debouncedSearchTerm, locationFilter]); // ✅ Note: using `debouncedSearchTerm` only

  useEffect(() => {
    getCategories();
  }, []);

  const serviceTypes = ['Banquet Halls', 'Resort', 'Premium Properties', 'Luxury Properties'];
  const budgetRanges = [
    { name: 'Budget Friendly', range: '₹50K - ₹1L', color: 'bg-green-100 text-green-600' },
    { name: 'Value For Money', range: '₹1L - ₹3L', color: 'bg-blue-100 text-blue-600' },
    { name: 'Premium Properties', range: '₹3L - ₹5L', color: 'bg-purple-100 text-purple-600' },
    { name: 'Luxury Properties', range: '₹5L+', color: 'bg-pink-100 text-pink-600' }
  ];

  const toggleFavorite = (serviceId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(serviceId)) {
      newFavorites.delete(serviceId);
    } else {
      newFavorites.add(serviceId);
    }
    setFavorites(newFavorites);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setServiceType('');
    setLocationFilter('');
  };

  const filteredServices = services?.filter(service => {
    // Filter by category if selected
    if (selectedCategory && service.category._id !== selectedCategory) return false;

    // Filter by search term if entered
    if (searchTerm &&
      !service.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !service.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by location if selected
    if (locationFilter && !service.location.toLowerCase().includes(locationFilter.toLowerCase())) {
      return false;
    }

    // Filter by service type if selected
    if (serviceType && service.type !== serviceType) return false;

    return true;
  });

  if (loading && services?.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center">
          <div className="text-center text-red-500">
            <p>{error}</p>
            <button
              onClick={fetchServices}
              className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

        {/* Enhanced Filter Bar */}
        <div className="sticky top-0 z-40 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3 flex-wrap">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                </button>

                {filterOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white border-t shadow-xl py-4 animate-in slide-in-from-top-2">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <select
                          className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          value={locationFilter}
                          onChange={(e) => setLocationFilter(e.target.value)}
                        >
                          <option value="">Location</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Bhubaneswar">Bhubaneswar</option>
                          <option value="Goa">Goa</option>
                        </select>

                        <select
                          className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          value={serviceType}
                          onChange={(e) => setServiceType(e.target.value)}
                        >
                          <option value="">Service Type</option>
                          {serviceTypes?.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>

                        <select className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                          <option>No Of Guests</option>
                          <option>50-100</option>
                          <option>100-200</option>
                          <option>200+</option>
                        </select>

                        <select className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                          <option>Price Per Plate</option>
                          <option>₹500-₹1000</option>
                          <option>₹1000-₹2000</option>
                          <option>₹2000+</option>
                        </select>

                        <select className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                          <option>Space</option>
                          <option>Indoor</option>
                          <option>Outdoor</option>
                          <option>Both</option>
                        </select>

                        <button
                          onClick={clearFilters}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Enhanced Sidebar */}
            <div className="hidden lg:block w-80 space-y-8">
              {/* Category Filters */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Categories</h3>
                <div className="space-y-4">
                  {categories?.map(category => (
                    <div
                      key={category._id}
                      className={`flex items-center space-x-4 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${selectedCategory === category._id
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200'
                        : 'hover:bg-gray-50'
                        }`}
                      onClick={() => setSelectedCategory(selectedCategory === category._id ? '' : category._id)}
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Home className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${selectedCategory === category._id ? 'text-blue-600' : 'text-gray-700'}`}>
                          {category.title}
                        </h4>
                        {/* <p className="text-sm text-gray-500">
                          {category.count || services?.filter(s => s.category._id === category._id).length} services
                        </p> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services by Budget */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Budget Range</h3>
                <div className="grid grid-cols-1 gap-4">
                  {budgetRanges?.map(range => (
                    <div key={range.name} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-300 group">
                      <div className={`w-12 h-12 rounded-full ${range.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{range.name}</p>
                        <p className="text-sm text-gray-500">{range.range}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search and Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedCategory
                      ? categories.find(c => c._id === selectedCategory)?.title || 'Selected Services'
                      : 'All Services'}
                  </h2>
                  <p className="text-gray-600">Showing {filteredServices?.length} results matching your criteria</p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 w-full md:w-80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                    />
                  </div>
                  <button
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <List className="w-4 h-4" />
                    <span>{viewMode === 'grid' ? 'List' : 'Grid'}</span>
                  </button>
                </div>
              </div>

              {/* Service Cards - Grid View */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredServices?.map((service) => (
                    <div
                      key={service._id}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group h-full flex flex-col"
                    >
                      {/* Image Section */}
                      <div className="relative h-48 overflow-hidden">
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                            Featured
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 z-10">
                          <button
                            onClick={() => handleWishlistToggle(service._id)}
                            disabled={wishlistLoading}
                            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${isInWishlist(service._id)  // Changed from isInWishlist.has() to isInWishlist()
                              ? 'bg-red-500 text-white'
                              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                              }`}
                          >
                            <Heart className={`w-5 h-5 ${isInWishlist(service._id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        <img
                          src={service.images[0] || "https://via.placeholder.com/600x400?text=No+Image"}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {service.title}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                            <span className="text-sm">{service.location}</span>
                          </div>

                          {service.capacity && (
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1 text-purple-500" />
                                <span className="text-xs text-gray-600">{service.capacity}</span>
                              </div>
                              {service.space && (
                                <div className="flex items-center">
                                  <Home className="w-4 h-4 mr-1 text-green-500" />
                                  <span className="text-xs text-gray-600">{service.space}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {service.rating && (
                            <div className="flex items-center mb-3">
                              <div className="flex items-center mr-3">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(service.rating || 0)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                      }`}
                                  />
                                ))}
                                <span className="text-xs text-gray-600 ml-1">
                                  {service.rating} ({service.reviews || 0} reviews)
                                </span>
                              </div>
                            </div>
                          )}

                          {service.tags && service.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {service.tags?.map((feature, index) => (
                                <span
                                  key={index}
                                  className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-100"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-auto">
                          <div className="flex items-center justify-between">
                            <div className="text-right">
                              {service.offer ? (
                                <div className="space-y-1">
                                  <div className="text-sm line-through text-gray-400">
                                    {formatPrice(service.minPrice)} - {formatPrice(service.maxPrice)}
                                  </div>
                                  <div className="text-xl font-bold text-gray-900">
                                    {formatPrice(service.offer.discountedPrice)} - {formatPrice(service.maxPrice - (service.maxPrice * service.offer.discountPercentage / 100))}
                                  </div>
                                  <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full inline-block">
                                    {service.offer.discountPercentage}% OFF
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xl font-bold text-gray-900">
                                  {formatPrice(service.minPrice)} - {formatPrice(service.maxPrice)}
                                </div>
                              )}
                              {service.pricePerPlate && (
                                <div className="text-xs text-gray-600">
                                  per plate: {formatPrice(service.pricePerPlate)}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => navigate(`/services/${service._id}`)}
                              className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Service Cards - List View */
                <div className="space-y-6">
                  {filteredServices?.map((service) => (
                    <div
                      key={service._id}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group  h-[470px] lg:h-[200px]"
                    >
                      <div className="flex flex-col lg:flex-row">
                        {/* Image Section */}
                        <div className="lg:w-64 relative overflow-hidden h-48 lg:h-auto">
                          <div className="absolute top-4 left-4 z-10">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                              Featured
                            </span>
                          </div>
                          <div className="absolute top-4 right-4 z-10">
                            <button
                              onClick={() => handleWishlistToggle(service._id)}
                              disabled={wishlistLoading}
                              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${isInWishlist(service._id)  // Changed from isInWishlist.has() to isInWishlist()
                                ? 'bg-red-500 text-white'
                                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                                }`}
                            >
                              <Heart className={`w-5 h-5 ${isInWishlist(service._id) ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                          <img
                            src={service.images[0] || "https://via.placeholder.com/600x400?text=No+Image"}
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 p-6 flex flex-col">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {service.title}
                              </h3>
                              <div className="flex items-center text-gray-600 mb-2">
                                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                                <span className="text-sm">{service.location}</span>
                              </div>

                              {service.capacity && (
                                <div className="flex items-center space-x-3 mb-3">
                                  <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-1 text-purple-500" />
                                    <span className="text-xs text-gray-600">{service.capacity}</span>
                                  </div>
                                  {service.space && (
                                    <div className="flex items-center">
                                      <Home className="w-4 h-4 mr-1 text-green-500" />
                                      <span className="text-xs text-gray-600">{service.space}</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {service.rating && (
                                <div className="flex items-center mb-3">
                                  <div className="flex items-center mr-3">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.floor(service.rating || 0)
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                          }`}
                                      />
                                    ))}
                                    <span className="text-xs text-gray-600 ml-1">
                                      {service.rating} ({service.reviews || 0} reviews)
                                    </span>
                                  </div>
                                </div>
                              )}

                              {service.tags && service.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-4">
                                  {service.tags?.map((feature, index) => (
                                    <span
                                      key={index}
                                      className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-100"
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="text-right ml-4">
                              {service.offer ? (
                                <div className="space-y-1">
                                  <div className="text-sm line-through text-gray-400">
                                    {formatPrice(service.minPrice)} - {formatPrice(service.maxPrice)}
                                  </div>
                                  <div className="text-xl font-bold text-gray-900">
                                    {formatPrice(service.offer.discountedPrice)} - {formatPrice(service.maxPrice - (service.maxPrice * service.offer.discountPercentage / 100))}
                                  </div>
                                  <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full inline-block">
                                    {service.offer.discountPercentage}% OFF
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xl font-bold text-gray-900">
                                  {formatPrice(service.minPrice)} - {formatPrice(service.maxPrice)}
                                </div>
                              )}
                              {service.pricePerPlate && (
                                <div className="text-xs text-gray-600">
                                  per plate: {formatPrice(service.pricePerPlate)}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-2">
                                {service.images.slice(0, 3).map((image, imgIndex) => (
                                  <div key={imgIndex} className="relative group/thumb cursor-pointer">
                                    <img
                                      src={image || "https://via.placeholder.com/100x75?text=No+Image"}
                                      alt={`${service.title} ${imgIndex + 1}`}
                                      className="w-16 h-12 object-cover rounded-lg shadow-sm group-hover/thumb:shadow-md transition-all duration-300 transform group-hover/thumb:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                                  </div>
                                ))}
                                {service.images.length > 3 && (
                                  <div className="w-16 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                                    <span className="text-gray-500 text-xs">
                                      +{service.images.length - 3}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <button
                                onClick={() => navigate(`/services/${service._id}`)}
                                className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View Details</span>
                              </button>
                              <button className="flex items-center space-x-1 bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 text-sm">
                                <Calendar className="w-3 h-3" />
                                <span>Book Now</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredServices?.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Search className="w-12 h-12 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
                  <button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesPage;