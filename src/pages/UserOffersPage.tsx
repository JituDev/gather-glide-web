import React from 'react';
import {
  Percent,
  Calendar,
  MapPin,
  Clock,
  Star,
  Filter,
  Search
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const UserOffersPage = () => {
  // Static offer data
  const offers = [
    {
      id: 1,
      title: "Wedding Package Discount",
      vendor: "Royal Weddings",
      category: "Wedding Planning",
      discount: "20% OFF",
      originalPrice: "₹1,50,000",
      offerPrice: "₹1,20,000",
      validity: "30 Jun 2024",
      location: "Delhi, NCR",
      rating: 4.8,
      reviews: 124,
      description: "Complete wedding package including venue, catering and decoration. Limited period offer.",
      image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      title: "Birthday Photography Special",
      vendor: "Capture Moments",
      category: "Photography",
      discount: "15% OFF",
      originalPrice: "₹25,000",
      offerPrice: "₹21,250",
      validity: "15 Jul 2024",
      location: "Mumbai",
      rating: 4.5,
      reviews: 87,
      description: "Professional birthday photography package with 100 edited photos and 2 photographers.",
      image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      title: "Corporate Event Tent Package",
      vendor: "Elite Tents",
      category: "Tent & Decor",
      discount: "10% OFF",
      originalPrice: "₹80,000",
      offerPrice: "₹72,000",
      validity: "31 Aug 2024",
      location: "Bangalore",
      rating: 4.7,
      reviews: 56,
      description: "Premium tent setup for corporate events with AC and lighting included.",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 4,
      title: "Catering Combo Deal",
      vendor: "Food Heaven",
      category: "Catering",
      discount: "25% OFF",
      originalPrice: "₹60,000",
      offerPrice: "₹45,000",
      validity: "20 Jul 2024",
      location: "Hyderabad",
      rating: 4.9,
      reviews: 203,
      description: "Veg & Non-veg combo for 100 people with dessert counter and live counters.",
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 5,
      title: "DJ + Lighting Package",
      vendor: "Party Makers",
      category: "Entertainment",
      discount: "30% OFF",
      originalPrice: "₹45,000",
      offerPrice: "₹31,500",
      validity: "10 Aug 2024",
      location: "Pune",
      rating: 4.6,
      reviews: 78,
      description: "Professional DJ with full lighting setup for 5 hours. Perfect for weddings and parties.",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 6,
      title: "Mehndi Artist Special",
      vendor: "Heena Arts",
      category: "Beauty",
      discount: "15% OFF",
      originalPrice: "₹15,000",
      offerPrice: "₹12,750",
      validity: "25 Jul 2024",
      location: "Jaipur",
      rating: 4.8,
      reviews: 142,
      description: "Traditional mehndi designs for bridal hands and feet with free touch-ups.",
      image: "https://images.unsplash.com/photo-1605980776566-0486c3ac7617?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ];

  // Categories for filter
  const categories = [
    "All Categories",
    "Wedding Planning",
    "Photography",
    "Tent & Decor",
    "Catering",
    "Entertainment",
    "Beauty",
    "Venues"
  ];

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
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filter Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center">
              <Filter className="text-purple-800 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Filter Offers</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${index === 0 ? 'bg-purple-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                {/* Offer Image */}
                <div className="relative">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-purple-800 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <Percent className="w-4 h-4 mr-1" />
                    {offer.discount}
                  </div>
                </div>

                {/* Offer Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{offer.title}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{offer.category}</span>
                  </div>

                  <p className="text-gray-600 mb-4">{offer.description}</p>

                  <div className="flex items-center mb-3">
                    <Star className="w-5 h-5 text-yellow-400 mr-1" />
                    <span className="text-gray-800 font-medium">{offer.rating}</span>
                    <span className="text-gray-500 ml-1">({offer.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{offer.location}</span>
                  </div>

                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Valid till: {offer.validity}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-500 line-through">{offer.originalPrice}</span>
                      <span className="text-purple-800 font-bold ml-2 text-lg">{offer.offerPrice}</span>
                    </div>
                    <button className="bg-purple-800 hover:bg-purple-900 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State (commented out for now) */}
          {/* <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Percent className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No offers available</h3>
          <p className="text-gray-500">Check back later for new offers from our vendors</p>
        </div> */}
        </div>
      </div>
    </>

  );
};

export default UserOffersPage;