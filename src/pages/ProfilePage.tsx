{/* <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
              <Camera className="w-4 h-4 mr-2" />
              Add Images
            </button>import React, { useState } from 'react'; */}
import { 
  Calendar, 
  Gift, 
  HelpCircle, 
  Home, 
  User, 
  Camera, 
  Edit3, 
  Settings, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Users,
  TrendingUp,
  DollarSign,
  Award,
  Eye,
  UserCheck,
  UserX,
  Shield,
  ImageIcon
} from "lucide-react";
import { useState } from "react";

// Navbar Component
const Navbar = ({ userRole = 'user' }) => {
  return (
    <nav className="bg-purple-800 text-white py-4 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="font-bold text-2xl flex items-center">
            <span className="bg-white text-purple-800 px-3 py-1 rounded mr-2">EVENT</span>
            <span>WALA</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 mx-auto">
            <div className="hover:text-purple-200 transition-colors flex items-center cursor-pointer">
              <Home className="w-4 h-4 mr-1" /> HOME
            </div>
            <div className="hover:text-purple-200 transition-colors flex items-center cursor-pointer">
              <Calendar className="w-4 h-4 mr-1" /> BOOKINGS
            </div>
            <div className="hover:text-purple-200 transition-colors flex items-center cursor-pointer">
              <Gift className="w-4 h-4 mr-1" /> OFFER
            </div>
            <div className="hover:text-purple-200 transition-colors flex items-center cursor-pointer">
              <User className="w-4 h-4 mr-1" /> VENDOR
            </div>
            <div className="hover:text-purple-200 transition-colors flex items-center cursor-pointer">
              <HelpCircle className="w-4 h-4 mr-1" /> HELP
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-purple-800" />
            </div>
            <span className="text-sm font-medium capitalize">{userRole}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

// User Profile Component
// User Profile Component
const UserProfile = () => {
  const [activeSection, setActiveSection] = useState('personal');
  
  const userData = {
    name: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    phone: "+91 9876543210",
    address: "123 MG Road, Bhubaneswar, Odisha",
    role: "user",
    profilePhoto: "default.jpg",
    description: "Event enthusiast who loves organizing memorable celebrations and gatherings.",
    createdAt: "2024-01-15T00:00:00.000Z",
    bookings: 8,
    favoriteVendors: 12
  };

  const sidebarItems = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'reviews', label: 'My Reviews', icon: Star },
    { id: 'wishlist', label: 'Wishlisted Vendors', icon: Star },
    { id: 'logout', label: 'Logout', icon: Settings }
  ];

  const renderPersonalInfo = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={userData.name}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              defaultValue={userData.email}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              defaultValue={userData.phone}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <input
              type="text"
              value={userData.role}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <textarea
            defaultValue={userData.address}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            defaultValue={userData.description}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
            maxLength="500"
          />
          <p className="text-sm text-gray-500 mt-1">Maximum 500 characters</p>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            Save Changes
          </button>
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderBookings = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>
      <div className="space-y-4">
        {[
          { 
            id: 1, 
            vendor: "Royal Caterers", 
            service: "Wedding Catering", 
            date: "Dec 25, 2024", 
            status: "Confirmed",
            amount: "₹25,000",
            statusColor: "green"
          },
          { 
            id: 2, 
            vendor: "Dream Photography", 
            service: "Wedding Photography", 
            date: "Dec 25, 2024", 
            status: "Confirmed",
            amount: "₹15,000",
            statusColor: "green"
          },
          { 
            id: 3, 
            vendor: "Elite Decorators", 
            service: "Birthday Decoration", 
            date: "Jan 10, 2025", 
            status: "Pending",
            amount: "₹8,000",
            statusColor: "yellow"
          },
          { 
            id: 4, 
            vendor: "Sound Pro", 
            service: "Sound System", 
            date: "Nov 20, 2024", 
            status: "Completed",
            amount: "₹5,000",
            statusColor: "blue"
          }
        ].map((booking) => (
          <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg">{booking.vendor}</h3>
                <p className="text-gray-600">{booking.service}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {booking.date}
                  </span>
                  <span className="font-medium text-gray-800">{booking.amount}</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  booking.statusColor === 'green' ? 'bg-green-100 text-green-800' :
                  booking.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {booking.status}
                </span>
                <button className="text-purple-600 hover:text-purple-800 font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Reviews</h2>
      <div className="space-y-6">
        {[
          {
            vendor: "Royal Caterers",
            rating: 5,
            date: "Dec 26, 2024",
            review: "Excellent service! The food quality was outstanding and the presentation was beautiful. Highly recommended for wedding events.",
            service: "Wedding Catering"
          },
          {
            vendor: "Dream Photography",
            rating: 4,
            date: "Dec 26, 2024",
            review: "Great photography skills and very professional team. Captured all the precious moments perfectly.",
            service: "Wedding Photography"
          },
          {
            vendor: "Sound Pro",
            rating: 4,
            date: "Nov 21, 2024",
            review: "Good sound quality and equipment. Setup was quick and professional.",
            service: "Sound System"
          }
        ].map((review, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">{review.vendor}</h3>
                <p className="text-sm text-gray-600">{review.service}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
            </div>
            <p className="text-gray-700">{review.review}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWishlist = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Wishlisted Vendors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { 
            name: "Premium Decorators", 
            category: "Decoration", 
            rating: 4.8,
            location: "Bhubaneswar",
            price: "₹10,000 - ₹50,000"
          },
          { 
            name: "Elite Caterers", 
            category: "Catering", 
            rating: 4.9,
            location: "Cuttack",
            price: "₹200 - ₹800 per plate"
          },
          { 
            name: "Melody Music", 
            category: "DJ & Music", 
            rating: 4.7,
            location: "Bhubaneswar",
            price: "₹5,000 - ₹25,000"
          },
          { 
            name: "Capture Moments", 
            category: "Photography", 
            rating: 4.6,
            location: "Puri",
            price: "₹15,000 - ₹40,000"
          }
        ].map((vendor, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg">{vendor.name}</h3>
                <p className="text-purple-600 text-sm font-medium">{vendor.category}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {vendor.location}
                  </span>
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                    {vendor.rating}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{vendor.price}</p>
              </div>
              <button className="text-red-500 hover:text-red-700 transition-colors">
                <Star className="w-5 h-5 fill-current" />
              </button>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                Book Now
              </button>
              <button className="flex-1 border border-purple-600 text-purple-600 hover:bg-purple-50 py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'personal':
        return renderPersonalInfo();
      case 'bookings':
        return renderBookings();
      case 'reviews':
        return renderReviews();
      case 'wishlist':
        return renderWishlist();
      case 'logout':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="space-x-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors">
                Yes, Logout
              </button>
              <button 
                onClick={() => setActiveSection('personal')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        );
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="user" />
      
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{userData.name}</h1>
              <p className="text-gray-600 mb-4">{userData.email}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                <div className="flex items-center text-blue-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">{userData.bookings} Bookings</span>
                </div>
                <div className="flex items-center text-purple-600">
                  <Star className="w-4 h-4 mr-1" />
                  <span className="text-sm">{userData.favoriteVendors} Favorites</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-1" />
                  <span className="text-sm">Member since Jan 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        activeSection === item.id
                          ? 'bg-purple-50 text-purple-700 border-r-4 border-purple-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      } ${item.id === 'logout' ? 'text-red-600 hover:bg-red-50' : ''}`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Vendor Profile Component
const VendorProfile = () => {
  const vendorData = {
    name: "Royal Caterers",
    email: "info@royalcaterers.com",
    role: "vendor",
    category: "Catering",
    profilePhoto: "default.jpg",
    description: "Premium catering services for weddings, corporate events, and special occasions. We specialize in traditional Indian cuisine with modern presentation.",
    galleryImages: ["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg"],
    isApproved: true,
    createdAt: "2023-08-20T00:00:00.000Z",
    rating: 4.8,
    totalBookings: 156,
    completedEvents: 142
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="vendor" />
      
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="relative">
              <div className="w-40 h-40 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center text-white text-5xl font-bold">
                RC
              </div>
              <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                <Camera className="w-5 h-5 text-gray-600" />
              </button>
              {vendorData.isApproved && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{vendorData.name}</h1>
                  <div className="flex items-center justify-center lg:justify-start space-x-4 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {vendorData.category}
                    </span>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span className="font-medium">{vendorData.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4 lg:mt-0">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{vendorData.email}</p>
              <p className="text-gray-700 mb-6">{vendorData.description}</p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                <div className="flex items-center text-blue-600">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span>{vendorData.totalBookings} Total Bookings</span>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>{vendorData.completedEvents} Completed</span>
                </div>
                <div className="flex items-center text-purple-600">
                  <Award className="w-5 h-5 mr-2" />
                  <span>Premium Vendor</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Bookings</p>
                <p className="text-2xl font-bold text-purple-600">{vendorData.totalBookings}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Rating</p>
                <p className="text-2xl font-bold text-yellow-600">{vendorData.rating}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-600">{vendorData.completedEvents}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-blue-600">91%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Gallery</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
              <ImageIcon className="w-4 h-4 mr-2" />
              Add Images
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vendorData.galleryImages.map((_, index) => (
              <div key={index} className="aspect-square bg-gradient-to-br from-purple-200 to-blue-200 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-purple-600" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Wedding Catering - Sharma Family</p>
                <p className="text-sm text-gray-600">Event Date: Dec 15, 2024</p>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Completed</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Corporate Event - Tech Solutions</p>
                <p className="text-sm text-gray-600">Event Date: Dec 20, 2024</p>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Upcoming</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Profile Component
const AdminProfile = () => {
  const adminData = {
    name: "Admin User",
    email: "admin@eventwala.com",
    role: "admin",
    profilePhoto: "default.jpg",
    description: "System administrator managing the EventWala platform and vendor approvals.",
    createdAt: "2023-01-01T00:00:00.000Z"
  };

  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="admin" />
      
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Admin Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-red-400 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                <Shield className="w-16 h-16" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{adminData.name}</h1>
              <p className="text-gray-600 mb-4">{adminData.email}</p>
              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
                System Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Admin Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex flex-wrap border-b">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'vendors', label: 'Vendor Management', icon: Users },
              { id: 'users', label: 'User Management', icon: User },
              { id: 'approvals', label: 'Pending Approvals', icon: Clock }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-purple-600 text-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-blue-600">1,234</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Active Vendors</p>
                    <p className="text-2xl font-bold text-green-600">456</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-green-400" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Pending Approvals</p>
                    <p className="text-2xl font-bold text-orange-600">23</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-400" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Bookings</p>
                    <p className="text-2xl font-bold text-purple-600">5,678</p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent System Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <UserCheck className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-medium">Approved vendor: "Royal Caterers"</p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="font-medium">New user registration: "John Doe"</p>
                    <p className="text-sm text-gray-600">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <UserX className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="font-medium">Rejected vendor application: "Quick Events"</p>
                    <p className="text-sm text-gray-600">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Approvals Tab */}
        {activeTab === 'approvals' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Pending Vendor Approvals</h2>
            <div className="space-y-4">
              {[
                { name: "Elite Photography", category: "Photography", applied: "2 days ago" },
                { name: "Dream Decorators", category: "Decoration", applied: "3 days ago" },
                { name: "Sound Systems Pro", category: "Sound & Lights", applied: "1 week ago" }
              ].map((vendor, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">{vendor.name}</h3>
                    <p className="text-sm text-gray-600">{vendor.category} • Applied {vendor.applied}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </button>
                    <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs would show similar content structures */}
        {activeTab === 'vendors' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Vendor Management</h2>
            <p className="text-gray-600">Vendor management interface would be displayed here...</p>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">User Management</h2>
            <p className="text-gray-600">User management interface would be displayed here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component with Profile Switcher
export default function EventWalaProfiles() {
  const [currentProfile, setCurrentProfile] = useState('user');

  return (
    <div className="min-h-screen">
      {/* Profile Switcher */}
      <div className="bg-gray-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-center space-x-4">
          <button
            onClick={() => setCurrentProfile('user')}
            className={`px-4 py-2 rounded transition-colors ${
              currentProfile === 'user' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'
            }`}
          >
            User Profile
          </button>
          <button
            onClick={() => setCurrentProfile('vendor')}
            className={`px-4 py-2 rounded transition-colors ${
              currentProfile === 'vendor' ? 'bg-purple-600' : 'bg-gray-600 hover:bg-gray-500'
            }`}
          >
            Vendor Profile
          </button>
          <button
            onClick={() => setCurrentProfile('admin')}
            className={`px-4 py-2 rounded transition-colors ${
              currentProfile === 'admin' ? 'bg-red-600' : 'bg-gray-600 hover:bg-gray-500'
            }`}
          >
            Admin Profile
          </button>
        </div>
      </div>

      {/* Render Current Profile */}
      {currentProfile === 'user' && <UserProfile />}
      {currentProfile === 'vendor' && <VendorProfile />}
      {currentProfile === 'admin' && <AdminProfile />}
    </div>
  );
}