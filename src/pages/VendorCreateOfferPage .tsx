import React, { useState, useEffect } from 'react';
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
import { useVendor } from '@/contexts/VendorContext';
import { useService } from '@/contexts/ServiceContext';
import { useAuth } from '@/contexts/AuthContext';

interface Service {
  _id: string;
  title: string;
  minPrice: string;
  maxPrice: string;
}

const VendorOffersPage = () => {
  const {
    offers,
    loadingOffers,
    errorOffers,
    getMyOffers,
    createOffer,
    updateOffer,
    deleteOffer,
    toggleOfferStatus,
  } = useVendor();

  const {
    vendorServices,
    getVendorServices,
    loadingVendorServices
  } = useService();
  const { user } = useAuth();
  const vendorId = user?._id;
  const [activeTab, setActiveTab] = useState<'view' | 'create'>('view');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [formData, setFormData] = useState({
    title: '',
    service: '',
    description: '',
    originalPrice: '',
    discountPercentage: '',
    validTill: '',
    termsConditions: '',
    bannerImage: null as File | null,
    isActive: true
  });
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    getMyOffers();
    getVendorServices(vendorId); // Fetch vendor services when component mounts
  }, [vendorId]);

  useEffect(() => {
    // When service is selected in form, update the original price
    if (formData.service && vendorServices) {
      const service = vendorServices.find(s => s._id === formData.service);
      if (service) {
        setSelectedService(service);
        setFormData(prev => ({
          ...prev,
          originalPrice: service.minPrice
        }));
      }
    }
  }, [formData.service, vendorServices]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        bannerImage: e.target.files[0]
      });
    }
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      bannerImage: null
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('service', formData.service);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('originalPrice', formData.originalPrice);
    formDataToSend.append('discountPercentage', formData.discountPercentage);
    formDataToSend.append('validTill', formData.validTill);
    formDataToSend.append('termsConditions', formData.termsConditions);
    formDataToSend.append('isActive', String(formData.isActive));
    if (formData.bannerImage) {
      formDataToSend.append('categoryImage', formData.bannerImage);
    }

    try {
      if (editingOfferId) {
        await updateOffer(editingOfferId, formDataToSend);
      } else {
        await createOffer(formDataToSend);
      }

      resetForm();
      setActiveTab('view');
    } catch (error) {
      console.error('Error submitting offer:', error);
      alert('Failed to submit offer. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      service: '',
      description: '',
      originalPrice: '',
      discountPercentage: '',
      validTill: '',
      termsConditions: '',
      bannerImage: null,
      isActive: true
    });
    setEditingOfferId(null);
    setSelectedService(null);
  };

  const calculateOfferPrice = (original: string, discount: string) => {
    if (original && discount) {
      const originalNum = parseFloat(original);
      const discountNum = parseFloat(discount);
      return (originalNum - (originalNum * discountNum / 100)).toFixed(2);
    }
    return '';
  };

  const handleEditOffer = (offerId: string) => {
    const offerToEdit = offers.find(offer => offer._id === offerId);
    if (offerToEdit) {
      setFormData({
        title: offerToEdit.title,
        service: typeof offerToEdit.service === 'object' ? offerToEdit.service._id : offerToEdit.service,
        description: offerToEdit.description,
        originalPrice: offerToEdit.originalPrice.toString(),
        discountPercentage: offerToEdit.discountPercentage.toString(),
        validTill: new Date(offerToEdit.validTill).toISOString().split('T')[0],
        termsConditions: offerToEdit.termsConditions || '',
        bannerImage: null,
        isActive: offerToEdit.isActive
      });
      setEditingOfferId(offerId);
      setActiveTab('create');
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await deleteOffer(offerId);
      } catch (error) {
        console.error('Error deleting offer:', error);
        alert('Failed to delete offer. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (offerId: string) => {
    try {
      await toggleOfferStatus(offerId);
    } catch (error) {
      console.error('Error toggling offer status:', error);
      alert('Failed to toggle offer status. Please try again.');
    }
  };

  if (loadingOffers && offers.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <div className="text-center">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-purple-800" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-gray-600">Loading your offers...</p>
          </div>
        </div>
      </>
    );
  }

  if (errorOffers) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <div className="text-center text-red-500">
            <p>Error loading offers: {errorOffers}</p>
            <button
              onClick={getMyOffers}
              className="mt-4 bg-purple-800 text-white px-4 py-2 rounded-lg"
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
                onClick={() => {
                  resetForm();
                  setActiveTab('create');
                }}
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
              onClick={() => {
                resetForm();
                setActiveTab('create');
              }}
              className={`px-4 py-2 font-medium ${activeTab === 'create' ? 'text-purple-800 border-b-2 border-purple-800' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {editingOfferId ? 'Edit Offer' : 'Create New Offer'}
            </button>
          </div>

          {/* Content Area */}
          {activeTab === 'view' ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Offers List */}
              {offers.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No offers yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new offer.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab('create')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-800 hover:bg-purple-900 focus:outline-none"
                    >
                      <Plus className="-ml-1 mr-2 h-5 w-5" />
                      Create Offer
                    </button>
                  </div>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {offers.map((offer) => (
                    <div key={offer._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                      <div className="relative">
                        <img
                          src={offer.bannerImage || "https://via.placeholder.com/500x300?text=No+Image"}
                          alt={offer.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-purple-800 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                          <Percent className="w-3 h-3 mr-1" />
                          {offer?.discountPercentage}% OFF
                        </div>
                        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${offer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                          {offer.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{offer.title}</h3>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {typeof offer.service === 'object' ? offer?.service?.title : 'Service'}
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{offer?.description}</p>

                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <span className="text-gray-500 line-through text-sm">₹{offer?.originalPrice}</span>
                            <span className="text-purple-800 font-bold ml-2">
                              ₹{offer.discountedPrice}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Valid till: {new Date(offer.validTill).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex justify-between items-center border-t pt-3">
                          <div className="text-xs text-gray-500">
                            Created: {new Date(offer.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleStatus(offer._id)}
                              className={`p-1.5 rounded-full ${offer.isActive
                                  ? 'text-yellow-600 hover:bg-yellow-50'
                                  : 'text-green-600 hover:bg-green-50'
                                }`}
                              title={offer.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {offer.isActive ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => handleEditOffer(offer._id)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOffer(offer._id)}
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {offers.map((offer) => (
                        <tr key={offer._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  src={offer.bannerImage || "https://via.placeholder.com/40?text=No+Image"}
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {typeof offer.service === 'object' ? offer.service.title : 'Service'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 line-through">₹{offer.originalPrice}</div>
                            <div className="text-sm font-medium text-purple-800">
                              ₹{offer.discountedPrice}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{offer.discountPercentage}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(offer.validTill).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${offer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                              {offer.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleToggleStatus(offer._id)}
                                className={`p-1 rounded-full ${offer.isActive
                                    ? 'text-yellow-600 hover:bg-yellow-50'
                                    : 'text-green-600 hover:bg-green-50'
                                  }`}
                                title={offer.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {offer.isActive ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                )}
                              </button>
                              <button
                                onClick={() => handleEditOffer(offer._id)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteOffer(offer._id)}
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
                <h2 className="text-2xl font-bold">{editingOfferId ? 'Edit Offer' : 'Create New Offer'}</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service *</label>
                    <div className="relative">
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                        required
                        disabled={loadingVendorServices}
                      >
                        <option value="">Select service</option>
                        {loadingVendorServices ? (
                          <option>Loading services...</option>
                        ) : (
                          vendorServices?.map((service) => (
                            <option key={service._id} value={service._id}>
                              {service.title} (₹{service.minPrice} - ₹{service.maxPrice})
                            </option>
                          ))
                        )}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    {selectedService && (
                      <p className="mt-1 text-sm text-gray-500">
                        Using minimum price of {selectedService.title} (₹{selectedService.minPrice}) as base price
                      </p>
                    )}
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
                        name="validTill"
                        value={formData.validTill}
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
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Banner Image</h2>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        {formData.bannerImage
                          ? formData.bannerImage.name
                          : 'Upload a banner image for your offer'}
                      </p>
                      <label className="cursor-pointer bg-purple-800 hover:bg-purple-900 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                        {formData.bannerImage ? 'Change Image' : 'Select File'}
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleImageUpload}
                          accept="image/*"
                        />
                      </label>
                      {formData.bannerImage && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="mt-2 text-sm text-red-600 hover:text-red-800"
                        >
                          Remove Image
                        </button>
                      )}
                      <p className="text-xs text-gray-500 mt-2">JPEG, PNG up to 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Status</h2>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4 text-purple-800 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Active (visible to customers)
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveTab('view');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-800 to-blue-500 hover:from-purple-900 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-bold transition-all duration-200"
                    disabled={loadingOffers}
                  >
                    {loadingOffers ? 'Saving...' : editingOfferId ? 'Update Offer' : 'Publish Offer'}
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