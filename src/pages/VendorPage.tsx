import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useVendor } from '@/contexts/VendorContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useService } from '@/contexts/ServiceContext';
import Navbar from '@/components/Navbar';

const VendorPage = () => {
    const { id } = useParams();
    const { getVendor, currentVendor, loadingVendor, errorVendor } = useVendor();
    const { getVendorServices, vendorServices, loadingVendorServices } = useService();
    const [activeTab, setActiveTab] = useState('services');

    useEffect(() => {
        if (id) {
            getVendor(id);
            // getOffer(id);
            getVendorServices(id);
        }
    }, [id]);
    useEffect(()=>{
        console.log("vendorServices",vendorServices)
    },[vendorServices])

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
                                    src={currentVendor.profilePhoto || 'default.jpg'}
                                    alt={currentVendor.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold">{currentVendor.name}</h1>
                                <p className="text-sky-100 mt-2">{currentVendor.category}</p>
                                <p className="mt-2">{currentVendor.description}</p>
                                <div className="flex flex-wrap gap-4 mt-4">
                                    {currentVendor.email && (
                                        <div className="flex items-center">
                                            <span className="mr-2">📧</span>
                                            <a href={`mailto:${currentVendor.email}`} className="hover:underline">
                                                {currentVendor.email}
                                            </a>
                                        </div>
                                    )}
                                    {currentVendor.location && (
                                        <div className="flex items-center">
                                            <span className="mr-2">📍</span>
                                            <span>{currentVendor.location}</span>
                                        </div>
                                    )}
                                    {currentVendor.website && (
                                        <div className="flex items-center">
                                            <span className="mr-2">🌐</span>
                                            <a
                                                href={currentVendor.website.startsWith('http') ? currentVendor.website : `https://${currentVendor.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline"
                                            >
                                                {currentVendor.website.replace(/^https?:\/\//, '')}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gallery Section */}
                {currentVendor.galleryImages && currentVendor.galleryImages.length > 0 && (
                    <div className="container mx-auto px-4 py-8">
                        <h2 className="text-2xl font-bold text-blue-800 mb-4">Gallery</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {currentVendor.galleryImages.map((image, index) => (
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {vendorServices.map(service => (
                                        <div key={service._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                                            <div className="h-48 overflow-hidden relative">
                                                {service.images && service.images.length > 0 ? (
                                                    <img
                                                        src={service.images[0]}
                                                        alt={service.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                        <span className="text-gray-400">No Image</span>
                                                    </div>
                                                )}
                                                {/* Discount Badge */}
                                                {service.offer && (
                                                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                                                        {service.offer.discountPercentage}% OFF
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-xl font-bold text-blue-800">{service.title}</h3>
                                                <p className="text-gray-600 mt-2">{service.description}</p>

                                                {/* Price Section */}
                                                <div className="mt-4">
                                                    {service.offer ? (
                                                        <div className="space-y-1">
                                                            <div className="flex items-center">
                                                                <span className="text-blue-600 font-bold">
                                                                    ₹{service.offer.discountedPrice} - ₹{Math.round(service.maxPrice - (service.maxPrice * service.offer.discountPercentage / 100))}
                                                                </span>
                                                                <span className="ml-2 text-sm text-gray-500 line-through">
                                                                    ₹{service.minPrice} - ₹{service.maxPrice}
                                                                </span>
                                                            </div>
                                                            <div className="text-green-600 text-sm font-medium">
                                                                Save {service.offer.discountPercentage}% on this service
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-blue-600 font-bold">
                                                            ₹{service.minPrice} - ₹{service.maxPrice}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm">
                                                        {service.subCategory}
                                                    </span>
                                                </div>

                                                {service.tags && service.tags.length > 0 && (
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {service.tags.map((tag, index) => (
                                                            <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <span>📍 {service.location}</span>
                                                    </div>
                                                    {service.website && (
                                                        <a
                                                            href={service.website.startsWith('http') ? service.website : `https://${service.website}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline text-sm"
                                                        >
                                                            Visit Website
                                                        </a>
                                                    )}
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