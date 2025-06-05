
import React from 'react';
import { useEvent } from '../contexts/EventContext';
import { Search, List, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const Catering = () => {
  const {
    venues,
    searchTerm,
    setSearchTerm,
    venueType,
    setVenueType
  } = useEvent();

  // Filter venues for Catering category
  const cateringVenues = venues.filter(venue => venue.category === 'Catering');

  const venueTypes = ['Premium Properties'];
  const budgetRanges = ['Budget Friendly', 'Value For Money', 'Premium Properties', 'Luxury Properties'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Filter Bar */}
      <div className="bg-teal-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <select className="bg-teal-700 text-white px-3 py-2 rounded text-sm">
                <option>No Of Guests</option>
                <option>50-100</option>
                <option>100-200</option>
                <option>200+</option>
              </select>
              
              <select className="bg-teal-700 text-white px-3 py-2 rounded text-sm">
                <option>Price Per Plate (Rs)</option>
                <option>500-1000</option>
                <option>1000-2000</option>
                <option>2000+</option>
              </select>
              
              <select
                className="bg-teal-700 text-white px-3 py-2 rounded text-sm"
                value={venueType}
                onChange={(e) => setVenueType(e.target.value)}
              >
                <option value="">Service Type</option>
                {venueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              
              <span className="text-sm">Rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Catering by Budget */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Catering by budget</h3>
              <div className="grid grid-cols-2 gap-3">
                {budgetRanges.map(range => (
                  <div key={range} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-orange-100 mx-auto mb-2 flex items-center justify-center">
                      <span className="text-orange-600 text-xs">{range.charAt(0)}</span>
                    </div>
                    <span className="text-xs text-gray-600">{range}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Catering by Type */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Catering by type</h3>
              <div className="grid grid-cols-2 gap-3">
                {venueTypes.map(type => (
                  <div key={type} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-orange-100 mx-auto mb-2 flex items-center justify-center">
                      <span className="text-orange-600 text-xs">{type.charAt(0)}</span>
                    </div>
                    <span className="text-xs text-gray-600">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Catering Services</h1>
                <p className="text-gray-600">Showing {cateringVenues.length} catering services as per your search criteria</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search Catering Services"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <List className="w-4 h-4 mr-2" />
                  List
                </Button>
              </div>
            </div>

            {/* Venue Cards */}
            <div className="space-y-6">
              {cateringVenues.map((venue) => (
                <div key={venue.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="flex">
                    {/* Main Image */}
                    <div className="w-80 h-64 relative">
                      <span className="absolute top-4 left-4 bg-teal-800 text-white px-3 py-1 rounded text-sm font-medium">
                        Handpicked
                      </span>
                      <img
                        src={venue.image}
                        alt={venue.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{venue.name}</h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm">{venue.location}</span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900 mb-2">{venue.price}</div>
                          <div className="flex items-center mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < venue.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-2">(No Reviews)</span>
                          </div>
                          <Link to={`/venue/${venue.id}`}>
                            <Button className="bg-teal-800 hover:bg-teal-900">
                              More Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail Images */}
                  <div className="px-6 pb-6">
                    <div className="flex space-x-2">
                      {venue.images.slice(0, 3).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${venue.name} ${index + 1}`}
                          className="w-20 h-16 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catering;
