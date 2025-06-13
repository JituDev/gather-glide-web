import { useState, useEffect } from "react";
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
  Star,
  Loader2,
  Plus,
  X
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useVendor } from "@/contexts/VendorContext";
import { useAuth } from "@/contexts/AuthContext";

const VendorProfile = () => {
  const { 
    currentVendor, 
    loadingVendor, 
    getVendor,
    updateVendor,
    uploadGalleryImages,
    uploadingImages,
    offers,
    loadingOffers,
    getMyOffers
  } = useVendor();
  const {user} = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [vendorForm, setVendorForm] = useState({
    name: '',
    description: '',
    category: ''
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Fetch vendor data on component mount
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        // Replace with actual vendor ID from auth context
        const vendorId = user?._id;
        await getVendor(vendorId);
        await getMyOffers();
      } catch (error) {
        console.error("Failed to fetch vendor data:", error);
      }
    };

    fetchVendorData();
  }, []);

  // Initialize form when vendor data is loaded
  useEffect(() => {
    if (currentVendor) {
      setVendorForm({
        name: currentVendor.name || '',
        description: currentVendor.description || '',
        category: currentVendor.category || ''
      });
    }
  }, [currentVendor]);

  const handleUpdateVendor = async () => {
    try {
      if (!currentVendor) return;
      await updateVendor(currentVendor._id, vendorForm);
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update vendor:", error);
    }
  };

  const handleImageUpload = async () => {
    try {
      if (!currentVendor || selectedImages.length === 0) return;
      await uploadGalleryImages(currentVendor._id, selectedImages);
      setSelectedImages([]);
      setShowImageUpload(false);
    } catch (error) {
      console.error("Failed to upload images:", error);
    }
  };

  const calculateSuccessRate = () => {
    // Replace with actual calculation from your data
    if (currentVendor) {
      const total = 156; // Replace with actual total bookings
      const completed = 142; // Replace with actual completed events
      return Math.round((completed / total) * 100);
    }
    return 91; // Default value
  };

  if (loadingVendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!currentVendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Vendor data not available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="relative">
              <div className="w-40 h-40 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center text-white text-5xl font-bold">
                {currentVendor.name.substring(0, 2).toUpperCase()}
              </div>
              <button 
                onClick={() => setShowImageUpload(!showImageUpload)}
                className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Camera className="w-5 h-5 text-gray-600" />
              </button>
              {currentVendor.isApproved && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  {editMode ? (
                    <input
                      type="text"
                      value={vendorForm.name}
                      onChange={(e) => setVendorForm({...vendorForm, name: e.target.value})}
                      className="text-3xl font-bold text-gray-800 mb-2 bg-gray-100 rounded px-2 py-1 w-full lg:w-auto"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentVendor.name}</h1>
                  )}
                  <div className="flex items-center justify-center lg:justify-start space-x-4 mb-2">
                    {editMode ? (
                      <input
                        type="text"
                        value={vendorForm.category}
                        onChange={(e) => setVendorForm({...vendorForm, category: e.target.value})}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium w-32"
                      />
                    ) : (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {currentVendor.category || 'Vendor'}
                      </span>
                    )}
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span className="font-medium">4.8</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4 lg:mt-0">
                  {editMode ? (
                    <>
                      <button 
                        onClick={handleUpdateVendor}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                      >
                        Save Changes
                      </button>
                      <button 
                        onClick={() => setEditMode(false)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setEditMode(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </button>
                      <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{currentVendor.email}</p>
              
              {editMode ? (
                <textarea
                  value={vendorForm.description}
                  onChange={(e) => setVendorForm({...vendorForm, description: e.target.value})}
                  className="w-full p-2 border rounded text-gray-700 mb-6 h-24"
                  placeholder="Enter your business description"
                />
              ) : (
                <p className="text-gray-700 mb-6">{currentVendor.description || 'No description provided'}</p>
              )}
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                <div className="flex items-center text-blue-600">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span>156 Total Bookings</span>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>142 Completed</span>
                </div>
                <div className="flex items-center text-purple-600">
                  <Award className="w-5 h-5 mr-2" />
                  <span>Premium Vendor</span>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload Modal */}
          {showImageUpload && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-800">Upload Gallery Images</h3>
                <button 
                  onClick={() => {
                    setShowImageUpload(false);
                    setSelectedImages([]);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <input
                type="file"
                multiple
                onChange={(e) => setSelectedImages(Array.from(e.target.files || []))}
                className="mb-4 w-full"
                accept="image/*"
              />
              
              {selectedImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <button
                onClick={handleImageUpload}
                disabled={uploadingImages || selectedImages.length === 0}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center disabled:opacity-50"
              >
                {uploadingImages ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Upload Images
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Bookings</p>
                <p className="text-2xl font-bold text-purple-600">156</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Rating</p>
                <p className="text-2xl font-bold text-yellow-600">4.8</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-600">142</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-blue-600">{calculateSuccessRate()}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Gallery</h2>
            <button 
              onClick={() => setShowImageUpload(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Images
            </button>
          </div>
          
          {currentVendor.galleryImages && currentVendor.galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentVendor.galleryImages.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Gallery ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p>No gallery images yet</p>
            </div>
          )}
        </div>

        {/* Offers Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Current Offers</h2>
          {loadingOffers ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
            </div>
          ) : offers.length > 0 ? (
            <div className="space-y-4">
              {offers.filter(o => o.isActive).map((offer) => (
                <div key={offer._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{offer.title}</p>
                    <p className="text-sm text-gray-600">
                      {typeof offer.service === 'object' ? offer.service.title : 'Service'}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Active
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No active offers currently</p>
            </div>
          )}
        </div>

        {/* Recent Bookings */}
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