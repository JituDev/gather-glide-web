import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, List, Star, MapPin, Users, Calendar, DollarSign, Home, Filter, ChevronDown, Heart, Eye, ArrowRight, Music, Camera } from 'lucide-react';
import Navbar from '@/components/Navbar';

const VendorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());

  // Static vendor data based on normalizedCategory
  const vendorsData = {
    TENT: [
      {
        id: 1,
        name: 'Royal Tents & Decor',
        location: 'Central Mumbai',
        price: '₹50,000',
        pricePerPlate: '₹0',
        rating: 4.7,
        reviews: 89,
        capacity: '200-500 guests',
        type: 'Premium Tents',
        normalizedCategory: 'TENT',
        image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1511578314322-379afb476865?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=300&h=200&fit=crop'
        ],
        features: ['AC Tents', 'Premium Decor', 'Lighting', 'Furniture'],
        space: 'Outdoor'
      },
      {
        id: 2,
        name: 'Luxury Wedding Tents',
        location: 'Suburban Mumbai',
        price: '₹75,000',
        pricePerPlate: '₹0',
        rating: 4.9,
        reviews: 124,
        capacity: '100-300 guests',
        type: 'Luxury Tents',
        normalizedCategory: 'TENT',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1511578314322-379afb476865?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=300&h=200&fit=crop'
        ],
        features: ['AC', 'Premium Flooring', 'Chandeliers', 'VIP Lounge'],
        space: 'Outdoor'
      }
    ],
    'LIGHT & SOUND': [
      {
        id: 3,
        name: 'Premium Lights & Sound',
        location: 'Tech City, Bangalore',
        price: '₹75,000',
        pricePerPlate: '₹0',
        rating: 4.6,
        reviews: 67,
        capacity: 'Any Event Size',
        type: 'Equipment',
        normalizedCategory: 'LIGHT & SOUND',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=200&fit=crop'
        ],
        features: ['LED Walls', 'Sound System', 'Lighting', 'DJ Setup'],
        space: 'Both'
      },
      {
        id: 4,
        name: 'Elite Sound Systems',
        location: 'Downtown, Delhi',
        price: '₹50,000',
        pricePerPlate: '₹0',
        rating: 4.5,
        reviews: 92,
        capacity: 'Any Event Size',
        type: 'Sound Equipment',
        normalizedCategory: 'LIGHT & SOUND',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=200&fit=crop'
        ],
        features: ['Surround Sound', 'Wireless Mics', 'Mixers', 'Amplifiers'],
        space: 'Both'
      }
    ],
    CATERING: [
      {
        id: 5,
        name: 'Elite Catering Services',
        location: 'Central Delhi',
        price: '₹800/plate',
        pricePerPlate: '₹800',
        rating: 4.7,
        reviews: 234,
        capacity: '50-1000 guests',
        type: 'Catering',
        normalizedCategory: 'CATERING',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1555244162-803834f70033?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop'
        ],
        features: ['Multi-Cuisine', 'Live Counter', 'Desserts', 'Beverages'],
        space: 'Both'
      },
      {
        id: 6,
        name: 'Gourmet Wedding Caterers',
        location: 'South Mumbai',
        price: '₹1,200/plate',
        pricePerPlate: '₹1,200',
        rating: 4.8,
        reviews: 187,
        capacity: '100-800 guests',
        type: 'Premium Catering',
        normalizedCategory: 'CATERING',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1555244162-803834f70033?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop'
        ],
        features: ['Gourmet Cuisine', 'Live Cooking', 'Bartenders', 'Custom Menus'],
        space: 'Both'
      }
    ],
    'PARTY HALL': [
      {
        id: 7,
        name: 'Royal Grand Ballroom',
        location: 'Downtown, Mumbai',
        price: '₹2,50,000',
        pricePerPlate: '₹1,200',
        rating: 4.8,
        reviews: 156,
        capacity: '200-500 guests',
        type: 'Banquet Halls',
        normalizedCategory: 'PARTY HALL',
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=300&h=200&fit=crop'
        ],
        features: ['AC', 'Parking', 'Catering', 'Decoration'],
        space: 'Indoor'
      },
      {
        id: 8,
        name: 'Elite Party Palace',
        location: 'West Delhi',
        price: '₹1,80,000',
        pricePerPlate: '₹900',
        rating: 4.6,
        reviews: 112,
        capacity: '150-400 guests',
        type: 'Party Hall',
        normalizedCategory: 'PARTY HALL',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=300&h=200&fit=crop'
        ],
        features: ['Dance Floor', 'LED Lighting', 'Sound System', 'VIP Lounge'],
        space: 'Indoor'
      }
    ],
    PHOTOGRAPHY: [
      {
        id: 9,
        name: 'Dream Wedding Photography',
        location: 'Across India',
        price: '₹1,00,000',
        pricePerPlate: '₹0',
        rating: 4.9,
        reviews: 215,
        capacity: 'Full Day Coverage',
        type: 'Premium Photography',
        normalizedCategory: 'PHOTOGRAPHY',
        image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=600&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1554080353-a576cf803bda?w=300&h=200&fit=crop'
        ],
        features: ['Pre-Wedding', 'Wedding Day', 'Album Design', 'Drone Shots'],
        space: 'Both'
      },
      {
        id: 10,
        name: 'Candid Moments Studio',
        location: 'Mumbai & Delhi',
        price: '₹75,000',
        pricePerPlate: '₹0',
        rating: 4.7,
        reviews: 178,
        capacity: '8 Hour Coverage',
        type: 'Candid Photography',
        normalizedCategory: 'PHOTOGRAPHY',
        image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1554080353-a576cf803bda?w=300&h=200&fit=crop'
        ],
        features: ['Candid Shots', 'Traditional Poses', 'Video Coverage', 'Photo Booth'],
        space: 'Both'
      }
    ]
  };

  // In VendorsPage.tsx
const normalizedCategory = category 
  ?.toUpperCase()
  .replace(/-/g, ' ')
  // Special case for "light-sound" which should become "LIGHT & SOUND"
  .replace(/^LIGHT SOUND$/, 'LIGHT & SOUND')
  || '';

  // Get vendors for the current normalizedCategory
  const currentVendors = vendorsData[normalizedCategory as keyof typeof vendorsData] || [];

  const filteredVendors = currentVendors.filter(vendor => {
    return vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const toggleFavorite = (vendorId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(vendorId)) {
      newFavorites.delete(vendorId);
    } else {
      newFavorites.add(vendorId);
    }
    setFavorites(newFavorites);
  };
  const categories = [
    {
      name: 'TENT',
      icon: Home,
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=100&h=100&fit=crop',
      count: currentVendors.length,
      url: '/vendors/tent'
    },
    {
      name: 'LIGHT & SOUND',
      icon: Music,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
      count: currentVendors.length,
      url: '/vendors/light-sound'
    },
    {
      name: 'CATERING',
      icon: Users,
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=100&h=100&fit=crop',
      count: currentVendors.length,
      url: '/vendors/catering'
    },
    {
      name: 'PARTY HALL',
      icon: MapPin,
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=100&h=100&fit=crop',
      count: currentVendors.length,
      url: '/vendors/party-hall'
    },
    {
      name: 'PHOTOGRAPHY',
      icon: Camera,
      image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=100&h=100&fit=crop',
      count: currentVendors.length,
      url: '/vendors/photography'
    }
  ];

  const vendorTypes = {
    TENT: ['Premium Tents', 'Luxury Tents', 'Traditional Tents'],
    'LIGHT & SOUND': ['Sound Systems', 'Lighting', 'DJ Equipment'],
    CATERING: ['Multi-Cuisine', 'Premium Catering', 'Traditional'],
    'PARTY HALL': ['Banquet Halls', 'Party Halls', 'Luxury Venues'],
    PHOTOGRAPHY: ['Wedding Photography', 'Candid Photography', 'Videography']
  };

  const budgetRanges = [
    { name: 'Budget Friendly', range: '₹10K - ₹50K', color: 'bg-green-100 text-green-600' },
    { name: 'Value For Money', range: '₹50K - ₹1L', color: 'bg-blue-100 text-blue-600' },
    { name: 'Premium Services', range: '₹1L - ₹3L', color: 'bg-purple-100 text-purple-600' },
    { name: 'Luxury Services', range: '₹3L+', color: 'bg-pink-100 text-pink-600' }
  ];


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Enhanced Filter Bar */}
        <div className="sticky top-0 z-40">
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
                        <select className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                          <option>Price Range</option>
                          <option>₹10K-₹50K</option>
                          <option>₹50K-₹1L</option>
                          <option>₹1L+</option>
                        </select>

                        <select className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                          <option>Rating</option>
                          <option>4+ Stars</option>
                          <option>4.5+ Stars</option>
                          <option>5 Stars</option>
                        </select>

                        <select className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                          <option>Location</option>
                          <option>Mumbai</option>
                          <option>Delhi</option>
                          <option>Bangalore</option>
                        </select>

                        {vendorTypes[normalizedCategory] && (
                          <select className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                            <option value="">{normalizedCategory} Type</option>
                            {vendorTypes[normalizedCategory].map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        )}
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
            <div className="w-80 space-y-8">
              {/* normalizedCategory Filters */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Categories</h3>
                <div className="space-y-4">
                  {categories.map((cat) => (
                    <div
                      key={cat.name}
                      onClick={() => navigate(cat.url)}
                      className={`flex items-center space-x-4 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${normalizedCategory === cat.name
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200'
                          : 'hover:bg-gray-50'
                        }`}
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`font-semibold ${normalizedCategory === cat.name
                              ? 'text-blue-600'
                              : 'text-gray-700'
                            }`}
                        >
                          {cat.name}
                        </h4>
                        <p className="text-sm text-gray-500">{cat.count} vendors</p>
                      </div>
                      <cat.icon
                        className={`w-5 h-5 ${normalizedCategory === cat.name
                            ? 'text-blue-600'
                            : 'text-gray-400'
                          }`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Vendors by Budget */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Budget Range</h3>
                <div className="grid grid-cols-1 gap-4">
                  {budgetRanges.map(range => (
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
                    {normalizedCategory} Vendors
                  </h2>
                  <p className="text-gray-600">Showing {filteredVendors.length} results matching your criteria</p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={`Search ${normalizedCategory.toLowerCase()} vendors...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 w-80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
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

              {/* Vendor Cards */}
              <div className="space-y-6">
                {filteredVendors.map((vendor, index) => (
                  <div
                    key={vendor.id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Compact Image Section */}
                      <div className="lg:w-64 relative overflow-hidden">
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                            Handpicked
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 z-10">
                          <button
                            onClick={() => toggleFavorite(vendor.id)}
                            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${favorites.has(vendor.id)
                              ? 'bg-red-500 text-white'
                              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                              }`}
                          >
                            <Heart className={`w-5 h-5 ${favorites.has(vendor.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        <img
                          src={vendor.image}
                          alt={vendor.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Enhanced Content */}
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {vendor.name}
                            </h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                              <span className="text-sm">{vendor.location}</span>
                            </div>

                            <div className="flex items-center space-x-3 mb-3">
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1 text-purple-500" />
                                <span className="text-xs text-gray-600">{vendor.capacity}</span>
                              </div>
                              {vendor.space && (
                                <div className="flex items-center">
                                  <Home className="w-4 h-4 mr-1 text-green-500" />
                                  <span className="text-xs text-gray-600">{vendor.space}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center mb-3">
                              <div className="flex items-center mr-3">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(vendor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                                <span className="text-xs text-gray-600 ml-1">
                                  {vendor.rating} ({vendor.reviews} reviews)
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-4">
                              {vendor.features.map((feature, index) => (
                                <span
                                  key={index}
                                  className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-100"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="text-right ml-4">
                            <div className="text-xl font-bold text-gray-900">{vendor.price}</div>
                            {vendor.pricePerPlate !== '₹0' && (
                              <div className="text-xs text-gray-600">per plate: {vendor.pricePerPlate}</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-2">
                              {vendor.images.slice(0, 3).map((image, imgIndex) => (
                                <div key={imgIndex} className="relative group/thumb cursor-pointer">
                                  <img
                                    src={image}
                                    alt={`${vendor.name} ${imgIndex + 1}`}
                                    className="w-16 h-12 object-cover rounded-lg shadow-sm group-hover/thumb:shadow-md transition-all duration-300 transform group-hover/thumb:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                                </div>
                              ))}
                              {vendor.images.length > 3 && (
                                <div className="w-16 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                                  <span className="text-gray-500 text-xs">+{vendor.images.length - 3}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => window.location.href = `/venue/${vendor.id}`}
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

              {filteredVendors.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Search className="w-12 h-12 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No vendors found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                    }}
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

export default VendorsPage;