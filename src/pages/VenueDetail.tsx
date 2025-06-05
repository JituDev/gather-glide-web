import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  MapPin, 
  Users, 
  Calendar, 
  DollarSign, 
  Home, 
  Wifi, 
  Car, 
  Utensils, 
  Music, 
  Camera,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  ThumbsUp,
  User
} from 'lucide-react';

const VenueDetail = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Static venue data (in real app, this would come from API based on ID)
  const venue = {
    id: 1,
    name: 'Royal Grand Ballroom',
    location: 'Downtown, Mumbai',
    address: '123 Royal Street, Andheri West, Mumbai - 400058',
    price: '₹2,50,000',
    pricePerPlate: '₹1,200',
    rating: 4.8,
    reviews: 156,
    capacity: '200-500 guests',
    type: 'Banquet Halls',
    space: 'Indoor',
    description: 'Experience the epitome of luxury at Royal Grand Ballroom, where your special day becomes an unforgettable celebration. Our opulent venue combines traditional elegance with modern amenities, featuring crystal chandeliers, marble flooring, and state-of-the-art facilities.',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
    ],
    features: [
      { icon: Wifi, name: 'Free WiFi', color: 'text-blue-500' },
      { icon: Car, name: 'Valet Parking', color: 'text-green-500' },
      { icon: Utensils, name: 'In-house Catering', color: 'text-orange-500' },
      { icon: Music, name: 'Sound System', color: 'text-purple-500' },
      { icon: Camera, name: 'Photography Area', color: 'text-pink-500' },
      { icon: Home, name: 'Bridal Suite', color: 'text-indigo-500' }
    ],
    amenities: [
      'Central Air Conditioning',
      'Luxury Restrooms',
      'Dedicated Bridal Room',
      'Professional Lighting',
      'Stage & Podium',
      'Dance Floor',
      'VIP Lounge',
      '24/7 Security'
    ],
    contact: {
      phone: '+91 98765 43210',
      email: 'info@royalgrandballroom.com',
      manager: 'Mr. Rajesh Sharma'
    },
    timings: {
      morning: '6:00 AM - 12:00 PM',
      evening: '6:00 PM - 12:00 AM',
      fullDay: '6:00 AM - 12:00 AM'
    }
  };

  const reviews = [
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 5,
      date: '2024-01-15',
      comment: 'Absolutely stunning venue! The staff was incredibly helpful and the decorations were breathtaking. Our wedding was perfect!',
      helpful: 12
    },
    {
      id: 2,
      name: 'Arjun Patel',
      rating: 4,
      date: '2024-01-10',
      comment: 'Great venue with excellent facilities. The food quality was outstanding and the service was professional.',
      helpful: 8
    },
    {
      id: 3,
      name: 'Meera Gupta',
      rating: 5,
      date: '2024-01-05',
      comment: 'Royal Grand Ballroom exceeded our expectations. The ambiance was perfect for our reception and the team made everything seamless.',
      helpful: 15
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % venue.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + venue.images.length) % venue.images.length);
  };

  const submitReview = () => {
    if (rating > 0 && review.trim()) {
      // In real app, submit to API
      console.log('Review submitted:', { rating, review });
      setRating(0);
      setReview('');
      alert('Thank you for your review!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Venues</span>
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isFavorite ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-500 transition-all duration-300">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="h-96 overflow-hidden">
          <img
            src={venue.images[currentImageIndex]}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Image Navigation */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-300 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-300 shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {venue.images.length}
          </div>
          
          {/* View Gallery Button */}
          <button
            onClick={() => setIsGalleryOpen(true)}
            className="absolute bottom-4 left-4 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg transition-all duration-300 shadow-lg"
          >
            <Camera className="w-4 h-4 inline mr-2" />
            View Gallery
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Venue Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{venue.name}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                    <span>{venue.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-purple-500" />
                      <span className="text-sm text-gray-600">{venue.capacity}</span>
                    </div>
                    <div className="flex items-center">
                      <Home className="w-5 h-5 mr-2 text-green-500" />
                      <span className="text-sm text-gray-600">{venue.space}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 mr-1 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{venue.rating}</span>
                      <span className="text-sm text-gray-600 ml-1">({venue.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{venue.price}</div>
                  <div className="text-sm text-gray-600">per plate: {venue.pricePerPlate}</div>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">{venue.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Features & Amenities</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {venue.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    <span className="font-medium text-gray-700">{feature.name}</span>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {venue.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h2>
                <div className="flex items-center space-x-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <span className="text-xl font-bold text-gray-900">{venue.rating}</span>
                  <span className="text-gray-600">({venue.reviews} reviews)</span>
                </div>
              </div>
              
              {/* Existing Reviews */}
              <div className="space-y-6 mb-8">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {review.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{review.name}</h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                        <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          <span>Helpful ({review.helpful})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Write Review */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setRating(i + 1)}
                          className={`w-8 h-8 ${i < rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                        >
                          <Star className="w-full h-full fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={4}
                    />
                  </div>
                  <button
                    onClick={submitReview}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Review</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-gray-900 mb-1">{venue.price}</div>
                <div className="text-sm text-gray-600">Starting price for full venue</div>
              </div>
              
              <button
                onClick={() => setShowBookingForm(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                <Calendar className="w-5 h-5 inline mr-2" />
                Book Now
              </button>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Per plate cost</span>
                  <span className="font-semibold text-gray-900">{venue.pricePerPlate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Capacity</span>
                  <span className="font-semibold text-gray-900">{venue.capacity}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Space Type</span>
                  <span className="font-semibold text-gray-900">{venue.space}</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium text-gray-900">{venue.contact.phone}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium text-gray-900">{venue.contact.email}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-purple-500" />
                  <div>
                    <div className="text-sm text-gray-600">Manager</div>
                    <div className="font-medium text-gray-900">{venue.contact.manager}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="text-sm text-gray-600">Address</div>
                    <div className="font-medium text-gray-900">{venue.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timings */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Timings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Morning Slot</span>
                  <span className="font-medium text-gray-900">{venue.timings.morning}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Evening Slot</span>
                  <span className="font-medium text-gray-900">{venue.timings.evening}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Full Day</span>
                  <span className="font-medium text-gray-900">{venue.timings.fullDay}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="max-w-4xl w-full">
            <img
              src={venue.images[currentImageIndex]}
              alt={venue.name}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={prevImage}
                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="text-white">
                {currentImageIndex + 1} / {venue.images.length}
              </div>
              
              <button
                onClick={nextImage}
                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-8 gap-2 mt-4">
              {venue.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden ${
                    index === currentImageIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-80'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Book Venue</h3>
              <button
                onClick={() => setShowBookingForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                <input
                  type="number"
                  placeholder="Enter guest count"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
                <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Morning (6:00 AM - 12:00 PM)</option>
                  <option>Evening (6:00 PM - 12:00 AM)</option>
                  <option>Full Day (6:00 AM - 12:00 AM)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
                <textarea
                  placeholder="Any special requirements or notes..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
              
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold">
                Submit Booking Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueDetail;