import { useState, useEffect, useCallback } from 'react';
import { useService } from '../contexts/ServiceContext';
import { useVendor } from '../contexts/VendorContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';

const ServiceListPage = () => {
    const {
        vendorServices,
        loadingVendorServices,
        errorVendorServices,
        deleteService,
        getVendorServices
    } = useService();
    const { vendorId } = useVendor();
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch vendor services on component mount
    useEffect(() => {
        if (vendorId) {
            fetchVendorServices();
        }
    }, [vendorId]);

    const fetchVendorServices = useCallback(async () => {
        try {
            if (vendorId) {
                await getVendorServices(vendorId);
            }
        } catch (error) {
            toast.error('Failed to fetch services');
            console.error('Error fetching vendor services:', error);
        }
    }, [vendorId, getVendorServices]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            setIsDeleting(true);
            try {
                await deleteService(id);
                toast.success('Service deleted successfully');
                fetchVendorServices();
            } catch (error) {
                console.error('Error deleting service:', error);
                toast.error('Failed to delete service');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-purple-800">My Services</h1>
                        <button
                            onClick={() => navigate('/services/new')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                        >
                            Add New Service
                        </button>
                    </div>

                    {errorVendorServices && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {errorVendorServices}
                        </div>
                    )}

                    {loadingVendorServices ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                        </div>
                    ) : vendorServices?.length === 0 ? (
                        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-6 rounded-lg text-center">
                            <p className="text-lg">You haven't created any services yet.</p>
                            <button
                                onClick={() => navigate('/services/new')}
                                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-200"
                            >
                                Create Your First Service
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vendorServices?.map((service) => (
                                <div key={service._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition duration-200">
                                    <div className="h-48 bg-gray-200 overflow-hidden">
                                        {service.images?.[0] ? (
                                            <img
                                                src={service.images[0]}
                                                alt={service.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold text-purple-800 mb-2">{service.title}</h3>
                                        <p className="text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-blue-600 font-medium">
                                                ${service.minPrice} - ${service.maxPrice}
                                            </span>
                                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                                {typeof service.category === 'object' ? service.category.title : service.category}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => navigate(`/services/edit/${service._id}`)}
                                                className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-3 rounded text-sm transition duration-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service._id)}
                                                disabled={isDeleting}
                                                className="flex-1 bg-red-100 hover:bg-red-200 text-red-800 py-1 px-3 rounded text-sm transition duration-200 disabled:opacity-50"
                                            >
                                                {isDeleting ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ServiceListPage;