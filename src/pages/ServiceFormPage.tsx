import { useState, useEffect } from 'react';
import { useService } from '../contexts/ServiceContext';
import { useVendor } from '../contexts/VendorContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

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
    variants: Variant[];
}

interface Variant {
    name: string;
    unit: string;
    price: number;
    minQty?: number;
    maxQty?: number;
}

interface DynamicField {
    key: string;
    label: string;
    type: string;
    required?: boolean;
}

const ServiceFormPage = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    
    const {
        vendorServices,
        createService,
        updateService,
    } = useService();
    const {user} = useAuth();
    console.log("user email", user?.email);
    
    const { vendorId } = useVendor();
    const { getCategories, categories } = useAdmin();
    const [subCategories, setSubCategories] = useState<string[]>([]);
    const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
    const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([]);
    const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [filesToRemove, setFilesToRemove] = useState<string[]>([]);
    const [validationErrors, setValidationErrors] = useState<Partial<ServiceFormData>>({});

    const [formData, setFormData] = useState<ServiceFormData>({
        title: "",
        description: "",
        minPrice: 0,
        maxPrice: 0,
        category: "",
        subCategory: "",
        tags: "",
        location: "",
        phone: "",
        website: "",
        details: {},
        faqs: [],
        images: null,
        existingImages: [],
        variants: [],
        // 🆕 Slot-related fields
        isSlotBased: false,
        slotDuration: 60, // in minutes
        slotCapacity: 1, // how many people per slot
        slotStartTime: "09:00", // default start time
        slotEndTime: "18:00", // default end time
    });

    useEffect(() => {
        getCategories();
    }, []);

    // Load service data in edit mode
    useEffect(() => {
        if (isEditMode && vendorServices) {
            const service = vendorServices.find(s => s._id === id);
            if (service) {
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
            }
        }
    }, [isEditMode, id, vendorServices, categories]);

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
    const addVariant = () => {
        setFormData((prev) => ({
            ...prev,
            variants: [
                ...prev.variants,
                {
                    name: "",
                    unit: "item", // Default unit that works for both types
                    price: 0,
                    minQty: 1, // Default min quantity
                    maxQty: undefined, // Only set to 1 when isCheckbox is true
                    isCheckbox: false,
                    defaultChecked: false,
                },
            ],
        }));
    };

    const removeVariant = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index),
        }));
    };

  const updateVariant = (index: number, key: keyof Variant | object, value?: any) => {
      setFormData((prev) => {
          const updatedVariants = [...prev.variants];

          // Handle bulk updates
          if (typeof key === "object") {
              updatedVariants[index] = { ...updatedVariants[index], ...key };
          }
          // Handle single field update
          else {
              updatedVariants[index] = { ...updatedVariants[index], [key]: value };

              // Special handling when changing to checkbox type
              if (key === "isCheckbox" && value === true) {
                  updatedVariants[index] = {
                      ...updatedVariants[index],
                      unit: "item",
                      minQty: 1,
                      maxQty: 1,
                  };
              }
              // Reset maxQty when changing from checkbox to quantity-based
              else if (key === "isCheckbox" && value === false) {
                  updatedVariants[index] = {
                      ...updatedVariants[index],
                      maxQty: undefined,
                  };
              }
          }

          return { ...prev, variants: updatedVariants };
      });
  };


    const validateForm = () => {
        const errors: Partial<ServiceFormData> = {};

        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.description.trim()) errors.description = 'Description is required';
        // if (formData.minPrice <= 0) errors.minPrice = 'Minimum price must be greater than 0';
        // if (formData.maxPrice <= formData.minPrice) errors.maxPrice = 'Maximum price must be greater than minimum price';
        if (!formData.category) errors.category = 'Category is required';
        if (!formData.subCategory) errors.subCategory = 'Sub-category is required';
        if (!formData.location) errors.location = 'Location is required';
        if (!formData.variants || formData.variants.length === 0) {
            errors.variants = "At least one variant is required";
        } else {
            for (const variant of formData.variants) {
                if (!variant.name) {
                    errors.variants = "All variants must have a name";
                    break;
                }

                if (variant.price === undefined || isNaN(variant.price) || variant.price < 0) {
                    errors.variants = "All variants must have a valid price";
                    break;
                }

                // Different validation for checkbox vs quantity variants
                if (variant.isCheckbox) {
                    if (variant.maxQty !== 1) {
                        errors.variants = "Checkbox variants must have max quantity of 1";
                        break;
                    }
                } else {
                    if (!variant.unit) {
                        errors.variants = "Quantity-based variants must have a unit";
                        break;
                    }
                    if (variant.minQty === undefined || variant.minQty < 1) {
                        errors.variants =
                            "Quantity-based variants must have minimum quantity of at least 1";
                        break;
                    }
                    if (variant.maxQty !== undefined && variant.maxQty < variant.minQty) {
                        errors.variants = "Maximum quantity cannot be less than minimum quantity";
                        break;
                    }
                }
            }
        }


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

    const handleSubmit = async (e: React.FormEvent) => {
        console.log('handleSubmit')
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const fd = new FormData();

            // Append all basic fields
            fd.append("title", formData.title);
            fd.append("description", formData.description);
            // fd.append('minPrice', formData.minPrice.toString());
            // fd.append('maxPrice', formData.maxPrice.toString());
            fd.append("category", formData.category);
            fd.append("subCategory", formData.subCategory);
            fd.append("tags", formData.tags);
            fd.append("location", formData.location);

            // Handle optional fields
            if (formData.phone) fd.append("phone", formData.phone);
            if (formData.website) fd.append("website", formData.website);

            // Append social links if any exist
            const socialLinks = {
                ...(formData.socialLinks?.facebook && { facebook: formData.socialLinks.facebook }),
                ...(formData.socialLinks?.instagram && {
                    instagram: formData.socialLinks.instagram,
                }),
                ...(formData.socialLinks?.twitter && { twitter: formData.socialLinks.twitter }),
            };
            if (Object.keys(socialLinks).length > 0) {
                fd.append("socialLinks", JSON.stringify(socialLinks));
            }

            // Append dynamic fields details
            fd.append("details", JSON.stringify(formData.details));

            // Append FAQs
            fd.append("faqs", JSON.stringify(formData.faqs));

            fd.append("variants", JSON.stringify(formData.variants));
            // 🆕 Add slot fields
            fd.append("isSlotBased", String(formData.isSlotBased));
            if (formData.isSlotBased) {
                fd.append("slotDuration", String(formData.slotDuration));
                fd.append("slotCapacity", String(formData.slotCapacity));
                fd.append("slotStartTime", formData.slotStartTime);
                fd.append("slotEndTime", formData.slotEndTime);
            }

            // Add images to be removed (for edit mode)
            if (isEditMode && filesToRemove.length > 0) {
                fd.append("removeImages", JSON.stringify(filesToRemove));
            }

            // Add new images
            if (formData.images) {
                const filesArray = Array.from(formData.images);
                filesArray.forEach((file, index) => {
                    fd.append("galleryImages", file);
                });
            }

            if (isEditMode && id) {
                await updateService(id, fd);
                toast.success("Service updated successfully");
            } else {
                await createService(fd);
                toast.success("Service created successfully");
            }

            navigate("/services");
        } catch (error) {
            console.error('Error submitting service:', error);
            toast.error(`Failed to ${isEditMode ? 'update' : 'create'} service`);
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
                <div className="max-w-6xl mx-auto">
                    <div className="mb-6">
                        <button
                            onClick={() => navigate("/services")}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <svg
                                className="w-5 h-5 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            Back to Services
                        </button>
                        <h1 className="text-2xl font-bold text-purple-800 mt-4">
                            {isEditMode ? "Edit Service" : "Create New Service"}
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 mb-1">Title*</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg ${
                                        validationErrors.title
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {validationErrors.title && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {validationErrors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Category*</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg ${
                                        validationErrors.category
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.title}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.category && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {validationErrors.category}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Sub-category*</label>
                                <select
                                    name="subCategory"
                                    value={formData.subCategory}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg ${
                                        validationErrors.subCategory
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Select a sub-category</option>
                                    {subCategories.map((sub, index) => (
                                        <option key={index} value={sub}>
                                            {sub}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.subCategory && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {validationErrors.subCategory}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Location*</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg ${
                                        validationErrors.location
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {validationErrors.location && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {validationErrors.location}
                                    </p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Slot Based Booking?
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.isSlotBased}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                isSlotBased: e.target.checked,
                                            }))
                                        }
                                        className="mr-2"
                                    />
                                    Enable slot system
                                </label>
                            </div>
                            {formData.isSlotBased && (
                                <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                                    <h3 className="font-semibold text-gray-800 mb-3">
                                        Slot Settings
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-600 text-sm mb-1">
                                                Slot Duration (minutes)
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.slotDuration}
                                                min="15"
                                                step="15"
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        slotDuration: Number(e.target.value),
                                                    }))
                                                }
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-600 text-sm mb-1">
                                                Capacity per Slot
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.slotCapacity}
                                                min="1"
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        slotCapacity: Number(e.target.value),
                                                    }))
                                                }
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-600 text-sm mb-1">
                                                Start Time
                                            </label>
                                            <input
                                                type="time"
                                                value={formData.slotStartTime}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        slotStartTime: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-600 text-sm mb-1">
                                                End Time
                                            </label>
                                            <input
                                                type="time"
                                                value={formData.slotEndTime}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        slotEndTime: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Service Variants*
                                </label>

                                {formData?.variants?.map((variant, index) => (
                                    <div
                                        key={index}
                                        className="mb-4 p-3 border rounded-lg bg-gray-50"
                                    >
                                        <div className="grid grid-cols-6 gap-2 mb-2">
                                            <input
                                                type="text"
                                                placeholder="Name (e.g., Drone Shoot)"
                                                value={variant.name}
                                                onChange={(e) =>
                                                    updateVariant(index, "name", e.target.value)
                                                }
                                                className="col-span-2 px-2 py-1 border rounded"
                                            />

                                            {/* Checkbox toggle */}
                                            <div className="col-span-1 flex items-center">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={variant.isCheckbox}
                                                        onChange={(e) => {
                                                            const updates = {
                                                                isCheckbox: e.target.checked,
                                                                // Reset to defaults when changing type
                                                                unit: e.target.checked
                                                                    ? "item"
                                                                    : "",
                                                                minQty: e.target.checked
                                                                    ? 1
                                                                    : undefined,
                                                                maxQty: e.target.checked
                                                                    ? 1
                                                                    : undefined,
                                                            };
                                                            updateVariant(index, updates);
                                                        }}
                                                        className="mr-1"
                                                    />
                                                    <span className="text-sm">Checkbox</span>
                                                </label>
                                            </div>

                                            <input
                                                type="number"
                                                placeholder="Price"
                                                value={variant.price}
                                                onChange={(e) =>
                                                    updateVariant(
                                                        index,
                                                        "price",
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="col-span-1 px-2 py-1 border rounded"
                                                min="0"
                                                step="0.01"
                                            />

                                            {!variant.isCheckbox && (
                                                <>
                                                    <input
                                                        type="text"
                                                        placeholder="Unit (e.g., hour)"
                                                        value={variant.unit}
                                                        onChange={(e) =>
                                                            updateVariant(
                                                                index,
                                                                "unit",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="col-span-1 px-2 py-1 border rounded"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Min Qty"
                                                        value={variant.minQty ?? ""}
                                                        onChange={(e) =>
                                                            updateVariant(
                                                                index,
                                                                "minQty",
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        className="col-span-1 px-2 py-1 border rounded"
                                                        min="1"
                                                    />
                                                </>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => removeVariant(index)}
                                                className="text-red-500 text-sm ml-2"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        {/* Additional options for checkbox variants */}
                                        {variant.isCheckbox && (
                                            <div className="mt-2 flex items-center">
                                                <label className="flex items-center mr-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={variant.defaultChecked}
                                                        onChange={(e) =>
                                                            updateVariant(
                                                                index,
                                                                "defaultChecked",
                                                                e.target.checked
                                                            )
                                                        }
                                                        className="mr-1"
                                                    />
                                                    <span className="text-sm">
                                                        Checked by default
                                                    </span>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
                                >
                                    + Add Variant
                                </button>

                                {validationErrors.variants && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {validationErrors.variants}
                                    </p>
                                )}
                            </div>

                            {/* <div>
                                <label className="block text-gray-700 mb-1">
                                    Minimum Price ($)*
                                </label>
                                <input
                                    type="number"
                                    name="minPrice"
                                    value={formData.minPrice}
                                    onChange={handleInputChange}
                                    min="0"
                                    className={`w-full px-3 py-2 border rounded-lg ${
                                        validationErrors.minPrice
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {validationErrors.minPrice && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {validationErrors.minPrice}
                                    </p>
                                )}
                            </div> */}

                            {/* <div>
                                <label className="block text-gray-700 mb-1">
                                    Maximum Price ($)*
                                </label>
                                <input
                                    type="number"
                                    name="maxPrice"
                                    value={formData.maxPrice}
                                    onChange={handleInputChange}
                                    min={formData.minPrice}
                                    className={`w-full px-3 py-2 border rounded-lg ${
                                        validationErrors.maxPrice
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {validationErrors.maxPrice && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {validationErrors.maxPrice}
                                    </p>
                                )}
                            </div> */}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Description*</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-lg ${
                                    validationErrors.description
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            ></textarea>
                            {validationErrors.description && (
                                <p className="text-red-500 text-sm mt-1">
                                    {validationErrors.description}
                                </p>
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
                                <label className="block text-gray-700 mb-1">
                                    Tags (comma separated)
                                </label>
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
                                    value={formData.socialLinks?.facebook || ""}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            socialLinks: {
                                                ...prev.socialLinks,
                                                facebook: e.target.value,
                                            },
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Instagram</label>
                                <input
                                    type="url"
                                    name="instagram"
                                    value={formData.socialLinks?.instagram || ""}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            socialLinks: {
                                                ...prev.socialLinks,
                                                instagram: e.target.value,
                                            },
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Twitter</label>
                                <input
                                    type="url"
                                    name="twitter"
                                    value={formData.socialLinks?.twitter || ""}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            socialLinks: {
                                                ...prev.socialLinks,
                                                twitter: e.target.value,
                                            },
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 mb-1">
                                {isEditMode ? "Add More Images" : "Images*"}
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
                                {isEditMode &&
                                    formData.existingImages?.map((img, index) => (
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
                                <p className="text-red-500 text-sm mt-1">
                                    {validationErrors.images}
                                </p>
                            )}
                            <p className="text-gray-500 text-sm mt-1">
                                Upload high-quality images of your service (first image will be
                                featured)
                                <br />
                                Maximum 10 images allowed (
                                {(formData.existingImages?.length || 0) +
                                    (formData.images?.length || 0) -
                                    filesToRemove.length}
                                /10)
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate("/services")}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-200"
                            >
                                {isEditMode ? "Update Service" : "Create Service"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ServiceFormPage;