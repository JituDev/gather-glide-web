import { useState, useEffect, useCallback } from 'react';
import { useService } from '../contexts/ServiceContext';
import { useVendor } from '../contexts/VendorContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import { useAdmin } from '@/contexts/AdminContext';

interface ServiceFormData {
    title: string;
    description: string;
    minPrice: number;
    maxPrice: number;
    category: string;
    subCategory: string;
    tags: string;
    location: string;
    phone?: string;
    website?: string;
    socialLinks?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
    };
    details: Record<string, any>;
    faqs: Array<{ question: string; answer: string }>;
    images: FileList | null;
    existingImages?: string[];
}

interface DynamicField {
    key: string;
    label: string;
    type: string;
    required?: boolean;
}

const ServiceManagement = () => {
    const {
        vendorServices,
        loadingVendorServices,
        errorVendorServices,
        createService,
        updateService,
        deleteService,
        getVendorServices
    } = useService();
    const { vendorId } = useVendor();
    const { getCategories, categories } = useAdmin();
    const [subCategories, setSubCategories] = useState<string[]>([]);
    const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
    const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([]);
    const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

    useEffect(() => {
        getCategories();
    }, [])

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentServiceId, setCurrentServiceId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [filesToRemove, setFilesToRemove] = useState<string[]>([]);

    const [formData, setFormData] = useState<ServiceFormData>({
        title: '',
        description: '',
        minPrice: 0,
        maxPrice: 0,
        category: '',
        subCategory: '',
        tags: '',
        location: '',
        phone: '',
        website: '',
        details: {},
        faqs: [],
        images: null,
        existingImages: []
    });


    const [validationErrors, setValidationErrors] = useState<Partial<ServiceFormData>>({});
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'category') {
            const selectedCategory = categories.find((cat) => cat._id === value);
            setSubCategories(selectedCategory?.subCategories || []);
            setDynamicFields(selectedCategory?.config?.fields || []);

            // Reset subCategory and details on category change
            setFormData(prev => ({
                ...prev,
                subCategory: '',
                details: {}
            }));
        }

        // Clear validation error when user types
        if (validationErrors[name as keyof ServiceFormData]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleDynamicFieldChange = (key: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            details: {
                ...prev.details,
                [key]: value
            }
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);

            // Combine existing files with new files (if any)
            const existingFiles = formData.images ? Array.from(formData.images) : [];
            const allFiles = [...existingFiles, ...newFiles];

            // Validate total number of files (max 10 including existing)
            const totalFiles = allFiles.length + (formData.existingImages?.length || 0) - filesToRemove.length;
            if (totalFiles > 10) {
                toast.error(`Maximum 10 images allowed. You have ${totalFiles} selected.`);
                return;
            }

            // Create new FileList using DataTransfer
            const dataTransfer = new DataTransfer();
            allFiles.forEach(file => dataTransfer.items.add(file));

            setFormData(prev => ({
                ...prev,
                images: dataTransfer.files
            }));

            // Create preview URLs for all files (existing previews + new files)
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };



    const handleRemoveImage = (index: number, isExisting: boolean) => {
        if (isExisting && formData.existingImages) {
            // Mark existing image for removal
            const imageToRemove = formData.existingImages[index];
            setFilesToRemove(prev => [...prev, imageToRemove]);

            // Remove from existing images preview
            const updatedExisting = [...formData.existingImages];
            updatedExisting.splice(index, 1);
            setFormData(prev => ({
                ...prev,
                existingImages: updatedExisting
            }));
        } else {
            // Remove from new files
            const updatedPreviews = [...imagePreviews];
            updatedPreviews.splice(index, 1);
            setImagePreviews(updatedPreviews);

            // Update FileList (this is a bit tricky since FileList is read-only)
            if (formData.images) {
                const filesArray = Array.from(formData.images);
                filesArray.splice(index, 1);

                // Create new FileList using DataTransfer
                const dataTransfer = new DataTransfer();
                filesArray.forEach(file => dataTransfer.items.add(file));
                setFormData(prev => ({
                    ...prev,
                    images: dataTransfer.files
                }));
            }
        }
    };


    const addFaq = () => {
        if (newFaq.question && newFaq.answer) {
            setFaqs([...faqs, newFaq]);
            setFormData(prev => ({
                ...prev,
                faqs: [...prev.faqs, newFaq]
            }));
            setNewFaq({ question: '', answer: '' });
        }
    };

    const removeFaq = (index: number) => {
        const updatedFaqs = [...faqs];
        updatedFaqs.splice(index, 1);
        setFaqs(updatedFaqs);
        setFormData(prev => ({
            ...prev,
            faqs: updatedFaqs
        }));
    };

    const validateForm = () => {
        const errors: Partial<ServiceFormData> = {};

        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.description.trim()) errors.description = 'Description is required';
        if (formData.minPrice <= 0) errors.minPrice = 'Minimum price must be greater than 0';
        if (formData.maxPrice <= formData.minPrice) errors.maxPrice = 'Maximum price must be greater than minimum price';
        if (!formData.category) errors.category = 'Category is required';
        if (!formData.subCategory) errors.subCategory = 'Sub-category is required';
        if (!formData.location) errors.location = 'Location is required';

        // Validate dynamic required fields
        dynamicFields.forEach(field => {
            if (field.required && !formData.details[field.key]) {
                errors.details = errors.details || {};
                errors.details[field.key] = `${field.label} is required`;
            }
        });

        // For new services, at least one image is required
        if (!isEditMode && (!formData.images || formData.images.length === 0)) {
            errors.images = 'At least one image is required';
        }

        // For editing, either existing images or new images must be present
        if (isEditMode &&
            (!formData.existingImages || formData.existingImages.length === 0) &&
            (!formData.images || formData.images.length === 0)) {
            errors.images = 'At least one image is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            minPrice: 0,
            maxPrice: 0,
            category: '',
            subCategory: '',
            tags: '',
            location: '',
            phone: '',
            website: '',
            details: {},
            faqs: [],
            images: null,
            existingImages: []
        });
        setImagePreviews([]);
        setFilesToRemove([]);
        setDynamicFields([]);
        setFaqs([]);
        setNewFaq({ question: '', answer: '' });
        setValidationErrors({});
    };


    const handleOpenCreateModal = () => {
        setIsEditMode(false);
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (service: any) => {
        setIsEditMode(true);
        setCurrentServiceId(service._id);

        // Parse details if it's a string
        let parsedDetails = {};
        if (typeof service.details === 'string') {
            try {
                parsedDetails = JSON.parse(service.details);
            } catch {
                parsedDetails = {};
            }
        } else if (typeof service.details === 'object') {
            parsedDetails = service.details;
        }

        // Parse FAQs if it's a string
        let parsedFaqs = [];
        if (typeof service.faqs === 'string') {
            try {
                parsedFaqs = JSON.parse(service.faqs);
            } catch {
                parsedFaqs = [];
            }
        } else if (Array.isArray(service.faqs)) {
            parsedFaqs = service.faqs;
        }

        setFormData({
            title: service.title,
            description: service.description,
            minPrice: service.minPrice,
            maxPrice: service.maxPrice,
            category: typeof service.category === 'object' ? service.category._id : service.category,
            subCategory: service.subCategory,
            tags: service.tags.join(', '),
            location: service.location,
            phone: service.phone || '',
            website: service.website || '',
            details: parsedDetails,
            faqs: parsedFaqs,
            images: null,
            existingImages: service.images || []
        });

        // Set dynamic fields based on category
        const selectedCategory = categories.find(cat =>
            cat._id === (typeof service.category === 'object' ? service.category._id : service.category)
        );
        setDynamicFields(selectedCategory?.config?.fields || []);
        setFaqs(parsedFaqs);

        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    const fd = new FormData();
    
    // Append all basic fields
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    fd.append('minPrice', formData.minPrice.toString());
    fd.append('maxPrice', formData.maxPrice.toString());
    fd.append('category', formData.category);
    fd.append('subCategory', formData.subCategory);
    fd.append('tags', formData.tags);
    fd.append('location', formData.location);

    // Handle optional fields
    if (formData.phone) fd.append('phone', formData.phone);
    if (formData.website) fd.append('website', formData.website);

    // Append social links if any exist
    const socialLinks = {
      ...(formData.socialLinks?.facebook && { facebook: formData.socialLinks.facebook }),
      ...(formData.socialLinks?.instagram && { instagram: formData.socialLinks.instagram }),
      ...(formData.socialLinks?.twitter && { twitter: formData.socialLinks.twitter })
    };
    if (Object.keys(socialLinks).length > 0) {
      fd.append('socialLinks', JSON.stringify(socialLinks));
    }

    // Append dynamic fields details
    fd.append('details', JSON.stringify(formData.details));

    // Append FAQs
    fd.append('faqs', JSON.stringify(formData.faqs));

    // Add images to be removed (for edit mode)
    if (isEditMode && filesToRemove.length > 0) {
      fd.append('removeImages', JSON.stringify(filesToRemove));
    }

    // Add new images - this is the critical fix
    if (formData.images) {
      const filesArray = Array.from(formData.images);
      filesArray.forEach((file, index) => {
        fd.append('galleryImages', file); // Use the same field name as expected by your backend
      });
    }

    console.log('FormData contents:');
    for (let [key, value] of fd.entries()) {
      console.log(key, value);
    }

    if (isEditMode && currentServiceId) {
      await updateService(currentServiceId, fd);
      toast.success('Service updated successfully');
    } else {
      await createService(fd);
      toast.success('Service created successfully');
    }

    setIsModalOpen(false);
    fetchVendorServices();
  } catch (error) {
    console.error('Error submitting service:', error);
    toast.error(`Failed to ${isEditMode ? 'update' : 'create'} service`);
  }
};

    // Clean up image preview URLs when component unmounts
    useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [imagePreviews]);

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

    // Render dynamic fields based on category configuration
    const renderDynamicFields = () => {
        return dynamicFields.map((field, index) => {
            if (field.type === 'section') {
                return (
                    <div key={index} className="col-span-full mt-6 mb-4">
                        <h3 className="text-lg font-semibold text-purple-800 border-b pb-2">
                            {field.label}
                        </h3>
                    </div>
                );
            }

            return (
                <div key={field.key} className="col-span-full md:col-span-1">
                    <label className="block text-gray-700 mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'text' && (
                        <input
                            type="text"
                            value={formData.details[field.key] || ''}
                            onChange={(e) => handleDynamicFieldChange(field.key, e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg ${validationErrors.details?.[field.key] ? 'border-red-500' : 'border-gray-300'
                                }`}
                            required={field.required}
                        />
                    )}
                    {field.type === 'number' && (
                        <input
                            type="number"
                            value={formData.details[field.key] || ''}
                            onChange={(e) => handleDynamicFieldChange(field.key, Number(e.target.value))}
                            className={`w-full px-3 py-2 border rounded-lg ${validationErrors.details?.[field.key] ? 'border-red-500' : 'border-gray-300'
                                }`}
                            required={field.required}
                        />
                    )}
                    {field.type === 'boolean' && (
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={!!formData.details[field.key]}
                                onChange={(e) => handleDynamicFieldChange(field.key, e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">
                                {field.label}
                            </label>
                        </div>
                    )}
                    {validationErrors.details?.[field.key] && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.details[field.key]}</p>
                    )}
                </div>
            );
        });
    };

    // Render FAQs section
    const renderFaqsSection = () => (
        <div className="col-span-full mt-4">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">FAQs</h3>
            <div className="space-y-4 mb-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium">{faq.question}</p>
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFaq(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 mb-1">Question</label>
                    <input
                        type="text"
                        value={newFaq.question}
                        onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Answer</label>
                    <input
                        type="text"
                        value={newFaq.answer}
                        onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
            </div>
            <button
                type="button"
                onClick={addFaq}
                className="mt-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg"
            >
                Add FAQ
            </button>
        </div>
    );


    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-purple-800">My Services</h1>
                        <button
                            onClick={handleOpenCreateModal}
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
                                onClick={handleOpenCreateModal}
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
                                                onClick={() => handleOpenEditModal(service)}
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

                {/* Service Form Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-purple-800">
                                        {isEditMode ? 'Edit Service' : 'Create New Service'}
                                    </h2>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-700 mb-1">Title*</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 border rounded-lg ${validationErrors.title ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            {validationErrors.title && (
                                                <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-1">Category*</label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 border rounded-lg ${validationErrors.category ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">Select a category</option>
                                                {categories.map((cat) => (
                                                    <option key={cat._id} value={cat._id}>
                                                        {cat.title}
                                                    </option>
                                                ))}
                                            </select>
                                            {validationErrors.category && (
                                                <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-1">Sub-category*</label>
                                            <select
                                                name="subCategory"
                                                value={formData.subCategory}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 border rounded-lg ${validationErrors.subCategory ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">Select a sub-category</option>
                                                {subCategories.map((sub, index) => (
                                                    <option key={index} value={sub}>
                                                        {sub}
                                                    </option>
                                                ))}
                                            </select>
                                            {validationErrors.subCategory && (
                                                <p className="text-red-500 text-sm mt-1">{validationErrors.subCategory}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-1">Location*</label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 border rounded-lg ${validationErrors.location ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            {validationErrors.location && (
                                                <p className="text-red-500 text-sm mt-1">{validationErrors.location}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-1">Minimum Price ($)*</label>
                                            <input
                                                type="number"
                                                name="minPrice"
                                                value={formData.minPrice}
                                                onChange={handleInputChange}
                                                min="0"
                                                className={`w-full px-3 py-2 border rounded-lg ${validationErrors.minPrice ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            {validationErrors.minPrice && (
                                                <p className="text-red-500 text-sm mt-1">{validationErrors.minPrice}</p>
                                            )}
                                        </div>


                                        <div>
                                            <label className="block text-gray-700 mb-1">Maximum Price ($)*</label>
                                            <input
                                                type="number"
                                                name="maxPrice"
                                                value={formData.maxPrice}
                                                onChange={handleInputChange}
                                                min={formData.minPrice}
                                                className={`w-full px-3 py-2 border rounded-lg ${validationErrors.maxPrice ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            {validationErrors.maxPrice && (
                                                <p className="text-red-500 text-sm mt-1">{validationErrors.maxPrice}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 mb-1">Description*</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className={`w-full px-3 py-2 border rounded-lg ${validationErrors.description ? 'border-red-500' : 'border-gray-300'}`}
                                        ></textarea>
                                        {validationErrors.description && (
                                            <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                                        )}
                                    </div>

                                    {/* Dynamic Fields Section */}
                                    {dynamicFields.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            {renderDynamicFields()}
                                        </div>
                                    )}

                                    {/* FAQs Section */}
                                    {renderFaqsSection()}



                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-700 mb-1">Tags (comma separated)</label>
                                            <input
                                                type="text"
                                                name="tags"
                                                value={formData.tags}
                                                onChange={handleInputChange}
                                                placeholder="e.g., wedding, photography, outdoors"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-1">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-1">Website</label>
                                            <input
                                                type="url"
                                                name="website"
                                                value={formData.website}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-700 mb-1">Facebook</label>
                                            <input
                                                type="url"
                                                name="facebook"
                                                value={formData.facebook}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-1">Instagram</label>
                                            <input
                                                type="url"
                                                name="instagram"
                                                value={formData.instagram}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-1">Twitter</label>
                                            <input
                                                type="url"
                                                name="twitter"
                                                value={formData.twitter}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-gray-700 mb-1">
                                            {isEditMode ? 'Add More Images' : 'Images*'}
                                        </label>

                                        {/* Image upload input */}
                                        <input
                                            type="file"
                                            name="images"
                                            onChange={handleFileChange}
                                            multiple
                                            accept="image/*"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                                        />

                                        {/* Image previews */}
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
                                            {/* Existing images (edit mode) */}
                                            {isEditMode && formData.existingImages?.map((img, index) => (
                                                <div key={`existing-${index}`} className="relative group">
                                                    <img
                                                        src={img}
                                                        alt={`Existing ${index}`}
                                                        className="w-full h-24 object-cover rounded border border-gray-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(index, true)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}

                                            {/* New image previews */}
                                            {imagePreviews.map((preview, index) => (
                                                <div key={`new-${index}`} className="relative group">
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index}`}
                                                        className="w-full h-24 object-cover rounded border border-gray-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(index, false)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Validation and help text */}
                                        {validationErrors.images && (
                                            <p className="text-red-500 text-sm mt-1">{validationErrors.images}</p>
                                        )}
                                        <p className="text-gray-500 text-sm mt-1">
                                            Upload high-quality images of your service (first image will be featured)
                                            <br />
                                            Maximum 10 images allowed ({(formData.existingImages?.length || 0) + (formData.images?.length || 0) - filesToRemove.length}/10)
                                        </p>
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-200"
                                        >
                                            {isEditMode ? 'Update Service' : 'Create Service'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ServiceManagement;