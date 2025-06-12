import React, { useState } from 'react';
import { 
  Percent, 
  Calendar, 
  MapPin, 
  Image as ImageIcon,
  X,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  List,
  Grid
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const VendorOffersPage = () => {
  const [activeTab, setActiveTab] = useState('view'); // 'view' or 'create'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    originalPrice: '',
    discountPercentage: '',
    validityDate: '',
    termsConditions: '',
    images: []
  });

  // Static existing offers data
  const existingOffers = [
    {
      id: 'offer1',
      title: "Wedding Photography Package",
      category: "Photography",
      description: "Complete wedding photography with 500+ edited photos and 2 photographers",
      originalPrice: "75000",
      discountPercentage: "15",
      validityDate: "2024-07-31",
      termsConditions: "Valid for bookings before June 30, 2024",
      images: [
        { id: 'img1', url: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
      ],
      status: "active",
      createdAt: "2024-05-15"
    },
    {
      id: 'offer2',
      title: "Birthday Event Decor",
      category: "Tent & Decor",
      description: "Complete birthday decoration with theme setup and lighting",
      originalPrice: "35000",
      discountPercentage: "10",
      validityDate: "2024-08-15",
      termsConditions: "Minimum 50 guests required",
      images: [
        { id: 'img2', url: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
      ],
      status: "active",
      createdAt: "2024-05-20"
    },
    {
      id: 'offer3',
      title: "Corporate Catering Special",
      category: "Catering",
      description: "Veg buffet for corporate events with dessert counter",
      originalPrice: "60000",
      discountPercentage: "20",
      validityDate: "2024-06-30",
      termsConditions: "For events with 100+ attendees",
      images: [
        { id: 'img3', url: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
      ],
      status: "expired",
      createdAt: "2024-04-10"
    }
  ];

  const categories = [
    "Wedding Planning",
    "Photography",
    "Tent & Decor",
    "Catering",
    "Entertainment",
    "Beauty",
    "Venues"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    
    setFormData({
      ...formData,
      images: [...formData.images, ...newImages]
    });
  };

  const removeImage = (id) => {
    setFormData({
      ...formData,
      images: formData.images.filter(img => img.id !== id)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Offer submitted:', formData);
    alert('Offer created successfully!');
    setFormData({
      title: '',
      category: '',
      description: '',
      originalPrice: '',
      discountPercentage: '',
      validityDate: '',
      termsConditions: '',
      images: []
    });
    setActiveTab('view');
  };

  const calculateOfferPrice = (original, discount) => {
    if (original && discount) {
      return (original - (original * discount / 100)).toFixed(2);
    }
    return '';
  };

  const handleEditOffer = (offerId) => {
    const offerToEdit = existingOffers.find(offer => offer.id === offerId);
    if (offerToEdit) {
      setFormData({
        title: offerToEdit.title,
        category: offerToEdit.category,
        description: offerToEdit.description,
        originalPrice: offerToEdit.originalPrice,
        discountPercentage: offerToEdit.discountPercentage,
        validityDate: offerToEdit.validityDate,
        termsConditions: offerToEdit.termsConditions,
        images: offerToEdit.images
      });
      setActiveTab('create');
    }
  };

  const handleDeleteOffer = (offerId) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      alert(`Offer ${offerId} would be deleted in a real implementation`);
    }
  };

  return (
    <>
    <Navbar />
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Offers</h1>
            <p className="text-gray-600">Manage your special offers and promotions</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}
            >
              {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setActiveTab('create')}
              className="flex items-center gap-2 bg-purple-800 hover:bg-purple-900 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
              Create Offer
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('view')}
            className={`px-4 py-2 font-medium ${activeTab === 'view' ? 'text-purple-800 border-b-2 border-purple-800' : 'text-gray-500 hover:text-gray-700'}`}
          >
            My Offers
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 font-medium ${activeTab === 'create' ? 'text-purple-800 border-b-2 border-purple-800' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Create New Offer
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'view' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Offers List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {existingOffers.map((offer) => (
                  <div key={offer.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="relative">
                      <img 
                        src={offer.images[0]?.url || "https://via.placeholder.com/500x300?text=No+Image"} 
                        alt={offer.title} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-purple-800 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                        <Percent className="w-3 h-3 mr-1" />
                        {offer.discountPercentage}% OFF
                      </div>
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${
                        offer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {offer.status === 'active' ? 'Active' : 'Expired'}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{offer.title}</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{offer.category}</span>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{offer.description}</p>

                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <span className="text-gray-500 line-through text-sm">₹{offer.originalPrice}</span>
                          <span className="text-purple-800 font-bold ml-2">
                            ₹{calculateOfferPrice(parseFloat(offer.originalPrice), parseFloat(offer.discountPercentage))}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Valid till: {new Date(offer.validityDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t pt-3">
                        <div className="text-xs text-gray-500">
                          Created: {new Date(offer.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditOffer(offer.id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteOffer(offer.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {existingOffers.map((offer) => (
                      <tr key={offer.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                src={offer.images[0]?.url || "https://via.placeholder.com/40?text=No+Image"} 
                                alt={offer.title} 
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">{offer.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{offer.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 line-through">₹{offer.originalPrice}</div>
                          <div className="text-sm font-medium text-purple-800">
                            ₹{calculateOfferPrice(parseFloat(offer.originalPrice), parseFloat(offer.discountPercentage))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{offer.discountPercentage}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(offer.validityDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            offer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {offer.status === 'active' ? 'Active' : 'Expired'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditOffer(offer.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteOffer(offer.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-purple-800 to-blue-500 p-6 text-white">
              <h2 className="text-2xl font-bold">Create New Offer</h2>
              <p className="opacity-90">Attract more customers with exclusive deals</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Offer Details</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Wedding Package Discount"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe your offer in detail..."
                    required
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Pricing</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹) *</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., 50000"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%) *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Percent className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="discountPercentage"
                        value={formData.discountPercentage}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., 20"
                        min="1"
                        max="100"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Offer Price</label>
                    <div className="text-xl font-bold text-purple-800">
                      {calculateOfferPrice(formData.originalPrice, formData.discountPercentage) ? 
                        `₹${calculateOfferPrice(formData.originalPrice, formData.discountPercentage)}` : '--'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Validity */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Validity</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="validityDate"
                      value={formData.validityDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
                  <textarea
                    name="termsConditions"
                    value={formData.termsConditions}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Any special terms for this offer..."
                  />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Images</h2>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload images of your service</p>
                    <label className="cursor-pointer bg-purple-800 hover:bg-purple-900 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                      Select Files
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                        multiple
                        accept="image/*"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">JPEG, PNG up to 5MB</p>
                  </div>
                </div>

                {/* Preview Images */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                    {formData.images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img 
                          src={image.url} 
                          alt={image.name} 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('view')}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-800 to-blue-500 hover:from-purple-900 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-bold transition-all duration-200"
                >
                  Publish Offer
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
    </>
    
  );
};

export default VendorOffersPage;