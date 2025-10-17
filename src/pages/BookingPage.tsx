import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useService } from "../contexts/ServiceContext";
import { useBooking } from "../contexts/BookingContext";
import Navbar from "@/components/Navbar";
import { toast } from "react-toastify";

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        getService,
        currentService,
        loading: serviceLoading,
        error: serviceError,
    } = useService();
    const { createBooking, loading: bookingLoading } = useBooking();

    const [slots, setSlots] = useState<any[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date: "",
        message: "",
        variants: {} as Record<string, number>,
    });

    // Get tomorrow's date in YYYY-MM-DD format for min date
    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split("T")[0];
    };

    // Fetch service details
    useEffect(() => {
        if (id) getService(id);
    }, [id]);

    // Fetch availability directly from backend when date changes
    useEffect(() => {
        const fetchAvailability = async () => {
            if (id && formData.date) {
                try {
                    const res = await fetch(
                        `http://localhost:5000/api/services/${id}/available-slots?date=${formData.date}`
                    );
                    if (!res.ok) throw new Error("Failed to fetch slots");
                    const data = await res.json();

                    setSlots(data.slots || []);

                    // reset slot if not in new list
                    if (selectedSlot && !data.slots?.find((s: any) => s._id === selectedSlot._id)) {
                        setSelectedSlot(null);
                    }
                } catch (err) {
                    console.error("Failed to fetch availability:", err);
                    toast.error("Could not fetch availability for this date");
                }
            }
        };
        fetchAvailability();
    }, [formData.date, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleVariantChange = (variantId: string, value: string) => {
        // Allow empty input for better UX
        if (value === "") {
            setFormData({
                ...formData,
                variants: {
                    ...formData.variants,
                    [variantId]: 0,
                },
            });
            return;
        }

        const quantity = parseInt(value);

        // Only update if it's a valid number
        if (!isNaN(quantity)) {
            setFormData({
                ...formData,
                variants: {
                    ...formData.variants,
                    [variantId]: quantity,
                },
            });
        }
    };

    const handleCheckboxChange = (variantId: string, isChecked: boolean) => {
        setFormData({
            ...formData,
            variants: {
                ...formData.variants,
                [variantId]: isChecked ? 1 : 0,
            },
        });
    };

    const calculateTotal = (): number => {
        if (!currentService?.variants) return 0;

        return currentService.variants.reduce((total, variant) => {
            const quantity = formData.variants[variant._id] || 0;
            return total + variant.price * quantity;
        }, 0);
    };

    const validateVariants = (): boolean => {
        if (!currentService?.variants) return false;

        let isValid = true;
        let errorMessage = "";

        // Check if at least one variant has quantity > 0
        const hasSelectedVariant = currentService.variants.some(
            (variant) => (formData.variants[variant._id] || 0) > 0
        );

        if (!hasSelectedVariant) {
            toast.error("Please select at least one service option");
            return false;
        }

        // Check minimum quantities for non-checkbox variants
        for (const variant of currentService.variants) {
            if (!variant.isCheckbox) {
                const quantity = formData.variants[variant._id] || 0;

                if (quantity > 0 && quantity < variant.minQty) {
                    isValid = false;
                    errorMessage = `${variant.name}: Minimum quantity is ${variant.minQty}`;
                    break;
                }

                // Also check max quantity if defined
                if (variant.maxQty && quantity > variant.maxQty) {
                    isValid = false;
                    errorMessage = `${variant.name}: Maximum quantity is ${variant.maxQty}`;
                    break;
                }
            }
        }

        if (!isValid) {
            toast.error(errorMessage);
        }

        return isValid;
    };

    const validateDate = (): boolean => {
        if (!formData.date) {
            toast.error("Please select a booking date");
            return false;
        }

        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison

        if (selectedDate <= today) {
            toast.error("Booking date must be in the future");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate date first
        if (!validateDate()) {
            return;
        }

        // Validate variants before proceeding
        if (!validateVariants()) {
            return;
        }

        const totalPrice = calculateTotal();

        if (currentService?.availability?.isSlotBased && !selectedSlot) {
            toast.error("Please select a time slot");
            return;
        }

        const variantsArray = Object.entries(formData.variants)
            .filter(([_, quantity]) => quantity > 0)
            .map(([variantId, quantity]) => ({
                variant: variantId,
                quantity: Number(quantity),
            }));

        const bookingData: any = {
            service: id as string,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            date: formData.date,
            slotId: selectedSlot?._id || null,
            message: formData.message,
            totalPrice,
            variants: variantsArray,
        };

        try {
            console.log("bookingData", bookingData);
            const { booking, payment } = await createBooking(bookingData);

            if (payment) {
                navigate(`/booking/${booking._id}/payment`, {
                    state: {
                        bookingId: booking._id,
                        amount: payment.amount,
                        orderId: payment.orderId,
                        currency: payment.currency,
                        key: payment.key,
                    },
                });
            } else {
                navigate(`/booking/${booking._id}`);
            }
        } catch (error: any) {
            console.error("Booking failed:", error);
            // Handle specific backend errors
            if (error.message?.includes("Booking date must be in the future")) {
                toast.error("Please select a future date for booking");
            }
        }
    };

    if (serviceLoading) return <div className="text-center py-8">Loading service details...</div>;
    if (serviceError)
        return <div className="text-center py-8 text-red-500">Error: {serviceError}</div>;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Book {currentService?.title}
                    </h1>
                    <p className="text-gray-600 mb-6">{currentService?.description}</p>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Service Options */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Service Options</h2>
                            <div className="space-y-4">
                                {currentService?.variants?.map((variant) => (
                                    <div key={variant._id} className="border-b pb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium">{variant.name}</span>
                                            <span>
                                                ₹{variant.price}
                                                {variant.isCheckbox ? "" : `/${variant.unit}`}
                                            </span>
                                        </div>

                                        {/* Minimum requirement badge */}
                                        {!variant.isCheckbox && (
                                            <div className="mb-2">
                                                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded border border-yellow-200">
                                                    Minimum: {variant.minQty} {variant.unit}
                                                    {variant.maxQty &&
                                                        ` • Maximum: ${variant.maxQty}`}
                                                </span>
                                            </div>
                                        )}

                                        {variant.isCheckbox ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`variant-${variant._id}`}
                                                    className="h-4 w-4 text-blue-600 rounded"
                                                    onChange={(e) =>
                                                        handleCheckboxChange(
                                                            variant._id,
                                                            e.target.checked
                                                        )
                                                    }
                                                    checked={formData.variants[variant._id] === 1}
                                                />
                                                <label
                                                    htmlFor={`variant-${variant._id}`}
                                                    className="ml-2 text-gray-700"
                                                >
                                                    Include this option
                                                </label>
                                            </div>
                                        ) : (
                                            <div>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder={`Enter quantity (min ${variant.minQty})`}
                                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    onChange={(e) =>
                                                        handleVariantChange(
                                                            variant._id,
                                                            e.target.value
                                                        )
                                                    }
                                                    value={formData.variants[variant._id] || ""}
                                                />

                                                {/* Current quantity indicator */}
                                                {(formData.variants[variant._id] || 0) > 0 && (
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Selected: {formData.variants[variant._id]}{" "}
                                                        {variant.unit}
                                                        {formData.variants[variant._id] > 1 && "s"}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span>₹{calculateTotal()}</span>
                                </div>
                                <p className="text-sm text-blue-600 mt-2 text-center">
                                    {Object.values(formData.variants).some((qty) => qty > 0)
                                        ? "Ready to book!"
                                        : "Select service options above"}
                                </p>
                            </div>
                        </div>

                        {/* Booking Form */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Your Information</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        onChange={handleChange}
                                        value={formData.name}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        onChange={handleChange}
                                        value={formData.email}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        onChange={handleChange}
                                        value={formData.phone}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">Event Date *</label>
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        onChange={handleChange}
                                        min={getTomorrowDate()} // Changed from today to tomorrow
                                        value={formData.date}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Please select a future date
                                    </p>
                                </div>

                                {currentService?.availability?.isSlotBased && formData.date && (
                                    <div>
                                        <label className="block text-gray-700 mb-1">
                                            Select a time slot *
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {slots.length === 0 ? (
                                                <p className="text-gray-500 col-span-2 text-center py-4">
                                                    No slots available for this date
                                                </p>
                                            ) : (
                                                slots.map((slot) => (
                                                    <button
                                                        key={slot._id}
                                                        type="button"
                                                        disabled={slot.isBooked}
                                                        onClick={() => setSelectedSlot(slot)}
                                                        title={
                                                            slot.isBooked
                                                                ? "This slot is already booked"
                                                                : "Click to select this slot"
                                                        }
                                                        className={`px-3 py-2 border rounded-md text-center transition-colors ${
                                                            slot.isBooked
                                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
                                                                : selectedSlot?._id === slot._id
                                                                ? "bg-blue-600 text-white border-blue-600"
                                                                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                                                        }`}
                                                    >
                                                        {slot.startTime} - {slot.endTime}
                                                        {slot.isBooked && " (Booked)"}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-gray-700 mb-1">
                                        Special Requests (Optional)
                                    </label>
                                    <textarea
                                        name="message"
                                        rows={3}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        onChange={handleChange}
                                        value={formData.message}
                                        placeholder="Any special requirements or notes..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={bookingLoading}
                                    className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-md hover:opacity-90 transition ${
                                        bookingLoading ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                                >
                                    {bookingLoading ? "Processing..." : "Confirm Booking"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingPage;
