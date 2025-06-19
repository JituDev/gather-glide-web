import React, { useEffect, useState } from 'react';
import {
  Percent,
  Calendar,
  MapPin,
  Clock,
  Star,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAdmin } from '@/contexts/AdminContext';

const UserOffersPage = () => {
  const { offers, getOffers, categories, getCategories } = useAdmin();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState(true); // Show active offers by default
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Categories for filter
  // const categories = [
  //   "All Categories",
  //   "Wedding Planning",
  //   "Photography",
  //   "Tent & Decor",
  //   "Catering",
  //   "Entertainment",
  //   "Beauty",
  //   "Venues"
  // ];

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const result = await getOffers(currentPage, 6, activeFilter);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };
    fetchOffers();
  }, [currentPage, activeFilter]);
  useEffect(() => {
    getCategories();
  }, [])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Exclusive Offers</h1>
            <p className="text-xl mb-8">Discover amazing deals from our top-rated vendors</p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search offers by vendor, category or location..."
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filter Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Filter className="text-purple-800 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">Filter Offers</h2>
              </div>
              <div className="flex space-x-2">
                {/* <button
                  onClick={() => setActiveFilter(true)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilter ? 'bg-purple-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Active Offers
                </button> */}
                {/* <button
                  onClick={() => setActiveFilter(false)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${!activeFilter ? 'bg-purple-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  All Offers
                </button> */}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory?._id === category._id
                      ? 'bg-purple-800 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category.title}
                </button>
              ))}
            </div>

          </div>

          {/* Offers Grid */}
          {offers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {offers.map((offer) => (
                  <div key={offer._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                    {/* Offer Image */}
                    <div className="relative">
                      <img
                        src={offer.bannerImage}
                        alt={offer.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-purple-800 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                        <Percent className="w-4 h-4 mr-1" />
                        {offer.discountPercentage}% OFF
                      </div>
                    </div>

                    {/* Offer Details */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{offer.title}</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {offer.vendor?.name || 'Vendor'}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">{offer.description}</p>

                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>Location not specified</span>
                      </div>

                      <div className="flex items-center text-gray-600 text-sm mb-4">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Valid till: {formatDate(offer.validTill)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-gray-500 line-through">
                            {formatPrice(offer.originalPrice)}
                          </span>
                          <span className="text-purple-800 font-bold ml-2 text-lg">
                            {formatPrice(offer.discountedPrice)}
                          </span>
                        </div>
                        <button className="bg-purple-800 hover:bg-purple-900 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum ? 'z-10 bg-purple-800 border-purple-800 text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Percent className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No offers available</h3>
              <p className="text-gray-500">Check back later for new offers from our vendors</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserOffersPage;