import Navbar from "@/components/Navbar";
import { 
  CheckCircle,
  Calendar,
  TrendingUp,
  Award,
  Image as ImageIcon,
  Edit3,
  Settings,
  Shield,
  Camera,
  Star
} from "lucide-react";

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
      <Navbar />
      
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

export default VendorProfile;