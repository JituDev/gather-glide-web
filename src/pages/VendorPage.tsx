import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVendor } from '@/contexts/VendorContext';
import { useService } from '@/contexts/ServiceContext';
import Navbar from '@/components/Navbar';
import { Star } from 'lucide-react';

const VendorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getVendor, currentVendor, loadingVendor, errorVendor } = useVendor();
    const { getVendorServices, vendorServices, loadingVendorServices } = useService();
    const [activeTab, setActiveTab] = useState('services');

    useEffect(() => {
        if (id) {
            getVendor(id);
            getVendorServices(id);
        }
    }, [id]);

    const formatPrice = (price: string | number) => {
        if (typeof price === 'string') {
            price = parseFloat(price);
        }
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price).replace('₹', '₹ ');
    };

    if (loadingVendor) {
        return <div className="flex justify-center items-center h-screen">Loading vendor details...</div>;
    }

    if (errorVendor) {
        return <div className="flex justify-center items-center h-screen text-red-500">{errorVendor}</div>;
    }

    if (!currentVendor) {
        return <div className="flex justify-center items-center h-screen">Vendor not found</div>;
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white">
                {/* Header Section */}
                <div className="bg-purple-600 text-white py-8">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-32 h-32 rounded-full bg-white overflow-hidden border-4 border-sky-300">
                                <img
                                    src={currentVendor?.profilePhoto || 'default.jpg'}
                                    alt={currentVendor?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold">{currentVendor?.name}</h1>
                                <p className="text-sky-100 mt-2">{currentVendor?.category}</p>
                                <p className="mt-2">{currentVendor?.description}</p>
                                <div className="flex flex-wrap gap-4 mt-4">
                                    {currentVendor?.email && (
                                        <div className="flex items-center">
                                            <span className="mr-2">📧</span>
                                            <a href={`mailto:${currentVendor?.email}`} className="hover:underline">
                                                {currentVendor?.email}
                                            </a>
                                        </div>
                                    )}
                                    {currentVendor?.address && (
                                        <div className="flex items-center">
                                            <span className="mr-2">📍</span>
                                            <span>{currentVendor?.address}</span>
                                        </div>
                                    )}
                                    {currentVendor?.website && (
                                        <div className="flex items-center">
                                            <span className="mr-2">🌐</span>
                                            <a
                                                href={currentVendor?.website.startsWith('http') ? currentVendor?.website : `https://${currentVendor?.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline"
                                            >
                                                {currentVendor?.website.replace(/^https?:\/\//, '')}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gallery Section */}
                {currentVendor?.galleryImages && currentVendor?.galleryImages.length > 0 && (
                    <div className="container mx-auto px-4 py-8">
                        <h2 className="text-2xl font-bold text-blue-800 mb-4">Gallery</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {currentVendor?.galleryImages.map((image, index) => (
                                <div key={index} className="rounded-lg overflow-hidden shadow-md">
                                    <img
                                        src={image}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Services/Reviews Tabs */}
                <div className="container mx-auto px-4 py-8">
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`py-2 px-4 font-medium ${activeTab === 'services' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('services')}
                        >
                            Services
                        </button>
                        <button
                            className={`py-2 px-4 font-medium ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews
                        </button>
                    </div>

                    {/* Services Tab Content */}
                    {activeTab === 'services' && (
                        <div className="mt-6">
                            {loadingVendorServices ? (
                                <div className="flex justify-center py-8">Loading services...</div>
                            ) : vendorServices && vendorServices.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {vendorServices.map(service => (
                                        <div key={service._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group h-full flex flex-col">
                                            {/* Image Section */}
                                            <div className="relative h-48 overflow-hidden">
                                                {service.offer && (
                                                    <div className="absolute top-4 left-4 z-10">
                                                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                                                            {service.offer.discountPercentage}% OFF
                                                        </span>
                                                    </div>
                                                )}
                                                {service.images && service.images.length > 0 ? (
                                                    <img
                                                        src={service.images[0]}
                                                        alt={service.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                        <span className="text-gray-400">No Image</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="p-6 flex flex-col flex-grow">
                                                <div className="flex-grow">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                        {service.title}
                                                    </h3>
                                                    <div className="flex items-center text-gray-600 mb-2">
                                                        <span className="text-sm">{service.location}</span>
                                                    </div>

                                                    {service.rating && (
                                                        <div className="flex items-center mb-3">
                                                            <div className="flex items-center mr-3">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`w-4 h-4 ${i < Math.floor(service.rating || 0)
                                                                            ? 'text-yellow-400 fill-current'
                                                                            : 'text-gray-300'
                                                                            }`}
                                                                    />
                                                                ))}
                                                                <span className="text-xs text-gray-600 ml-1">
                                                                    {service.rating} ({service.reviews || 0} reviews)
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {service.tags && service.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mb-4">
                                                            {service.tags.map((tag, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-100"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-auto">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-right">
                                                            {service.offer ? (
                                                                <div className="space-y-1">
                                                                    <div className="text-sm line-through text-gray-400">
                                                                        {formatPrice(service.minPrice)} - {formatPrice(service.maxPrice)}
                                                                    </div>
                                                                    <div className="text-xl font-bold text-gray-900">
                                                                        {formatPrice(service.offer.discountedPrice)} - {formatPrice(
                                                                            typeof service.maxPrice === 'string'
                                                                                ? parseFloat(service.maxPrice) - (parseFloat(service.maxPrice) * service.offer.discountPercentage / 100)
                                                                                : service.maxPrice - (service.maxPrice * service.offer.discountPercentage / 100)
                                                                        )}

                                                                    </div>
                                                                    <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full inline-block">
                                                                        Save {service.offer.discountPercentage}%
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-xl font-bold text-gray-900">
                                                                    {formatPrice(service.minPrice)} - {formatPrice(service.maxPrice)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => navigate(`/services/${service._id}`)}
                                                            className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                                                        >
                                                            <span>View</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">No services available</div>
                            )}
                        </div>
                    )}

                    {/* Reviews Tab Content */}
                    {activeTab === 'reviews' && (
                        <div className="mt-6">
                            <div className="text-center py-8 text-gray-500">Reviews will be displayed here</div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default VendorPage;