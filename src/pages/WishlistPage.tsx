import React, { useEffect } from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { Heart, MapPin, Users, Home, Star, Eye, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import Navbar from '@/components/Navbar';

const WishlistPage = () => {
    const {
        wishlist,
        loading,
        error,
        getWishlist,
        removeFromWishlist,
        isInWishlist
    } = useWishlist();
    const navigate = useNavigate();

    // Format price with currency symbol
    const formatPrice = (price: string | number) => {
        return `₹${new Intl.NumberFormat('en-IN').format(Number(price))}`;
    };

    // Handle wishlist toggle
    const handleWishlistToggle = async (serviceId: string) => {
        if (isInWishlist(serviceId)) {
            await removeFromWishlist(serviceId);
        }
    };

    // Fetch wishlist on component mount
    useEffect(() => {
        getWishlist();
    }, []);

    useEffect(() => {
        console.log("wishlist", wishlist)
    }, [wishlist])

    // Handle errors
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Your Wishlist
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {wishlist.length > 0
                                ? "Your saved services for future reference"
                                : "Your wishlist is empty. Start adding services you love!"}
                        </p>
                    </div>

                    {/* Loading State */}
                    {loading && !wishlist.length && (
                        <div className="flex justify-center items-center h-64">
                            <LoadingSpinner size="lg" />
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && wishlist.length === 0 && (
                        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                                <Heart className="w-full h-full" strokeWidth={1} />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No services in your wishlist
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Browse our services and add your favorites here
                            </p>
                            <button
                                onClick={() => navigate('/ServicesPage')}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                            >
                                Explore Services
                            </button>
                        </div>
                    )}

                    {/* Wishlist Items */}
                    <div className="space-y-6">
                        {wishlist.map((service: Service) => (
                            <div
                                key={service._id}
                                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group h-[470px] lg:h-[200px]"
                            >
                                <div className="flex flex-col lg:flex-row">
                                    {/* Image Section */}
                                    <div className="lg:w-64 relative overflow-hidden h-48 lg:h-auto">
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                                                Wishlisted
                                            </span>
                                        </div>
                                        <div className="absolute top-4 right-4 z-10">
                                            <button
                                                onClick={() => handleWishlistToggle(service._id)}
                                                disabled={loading}
                                                className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${isInWishlist(service._id)
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                                                    }`}
                                            >
                                                <Heart
                                                    className={`w-5 h-5 ${isInWishlist(service._id) ? 'fill-current' : ''
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                        <img
                                            src={
                                                service.images?.[0] || // Using optional chaining
                                                'https://via.placeholder.com/600x400?text=No+Image'
                                            }
                                            alt={service.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1 p-6 flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                    {service.title}
                                                </h3>
                                                <div className="flex items-center text-gray-600 mb-2">
                                                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                                                    <span className="text-sm">{service.location}</span>
                                                </div>

                                                {service.capacity && (
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <div className="flex items-center">
                                                            <Users className="w-4 h-4 mr-1 text-purple-500" />
                                                            <span className="text-xs text-gray-600">
                                                                {service.capacity}
                                                            </span>
                                                        </div>
                                                        {service.space && (
                                                            <div className="flex items-center">
                                                                <Home className="w-4 h-4 mr-1 text-green-500" />
                                                                <span className="text-xs text-gray-600">
                                                                    {service.space}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

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
                                                        {service.tags?.map((feature: string, index: number) => (
                                                            <span
                                                                key={index}
                                                                className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-100"
                                                            >
                                                                {feature}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-right ml-4">
                                                <div className="text-xl font-bold text-gray-900">
                                                    {formatPrice(service.minPrice)} -{' '}
                                                    {formatPrice(service.maxPrice)}
                                                </div>
                                                {service.pricePerPlate && (
                                                    <div className="text-xs text-gray-600">
                                                        per plate: {formatPrice(service.pricePerPlate)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex space-x-2">
                                                    {service?.images?.slice(0, 3).map((image: string, imgIndex: number) => (
                                                        <div
                                                            key={imgIndex}
                                                            className="relative group/thumb cursor-pointer"
                                                        >
                                                            <img
                                                                src={
                                                                    image ||
                                                                    'https://via.placeholder.com/100x75?text=No+Image'
                                                                }
                                                                alt={`${service.title} ${imgIndex + 1}`}
                                                                className="w-16 h-12 object-cover rounded-lg shadow-sm group-hover/thumb:shadow-md transition-all duration-300 transform group-hover/thumb:scale-105"
                                                            />
                                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                                                        </div>
                                                    ))}
                                                    {service?.images?.length > 3 && (
                                                        <div className="w-16 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                                                            <span className="text-gray-500 text-xs">
                                                                +{service.images.length - 3}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => navigate(`/services/${service._id}`)}
                                                    className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                                                >
                                                    <Eye className="w-3 h-3" />
                                                    <span>View Details</span>
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/booking/${service._id}`)}
                                                    className="flex items-center space-x-1 bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 text-sm"
                                                >
                                                    <Calendar className="w-3 h-3" />
                                                    <span>Book Now</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>

    );
};

export default WishlistPage;