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

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date: "",
        message: "",
        variants: {} as Record<string, number>,
    });

    useEffect(() => {
        if (id) {
            getService(id);
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleVariantChange = (variantId: string, value: string) => {
        const quantity = value === "" ? 0 : Math.max(0, parseInt(value));
        setFormData({
            ...formData,
            variants: {
                ...formData.variants,
                [variantId]: quantity,
            },
        });
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

   const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault();
       const totalPrice = calculateTotal();

       if (totalPrice <= 0) {
           toast.error("Please select at least one service option");
           return;
       }

       // Prepare the variants array in the correct format
       const variantsArray = Object.entries(formData.variants)
           .filter(([_, quantity]) => quantity > 0)
           .map(([variantId, quantity]) => ({
               variant: variantId,
               quantity: Number(quantity),
           }));

       const bookingData = {
           service: id as string,
           name: formData.name,
           email: formData.email,
           phone: formData.phone,
           date: formData.date,
           message: formData.message,
           totalPrice: totalPrice,
           variants: variantsArray,
       };

       try {
           // Ensure you're sending JSON content type
           const { booking, payment } = await createBooking(bookingData);
           toast.success("Booking created successfully!");

           navigate(`/booking/${booking._id}/payment`, {
               state: {
                   bookingId: booking._id,
                   amount: payment.amount,
                   orderId: payment.orderId,
                   currency: payment.currency,
                   key: payment.key,
               },
           });
       } catch (error) {
           console.error("Booking failed:", error);
           toast.error("Failed to create booking. Please try again.");
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
                                                    min={variant.minQty}
                                                    max={variant.maxQty || undefined}
                                                    placeholder={`Quantity (min ${variant.minQty})`}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                    onChange={(e) =>
                                                        handleVariantChange(
                                                            variant._id,
                                                            e.target.value
                                                        )
                                                    }
                                                    value={formData.variants[variant._id] || ""}
                                                />
                                                {variant.maxQty && (
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Maximum: {variant.maxQty}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span>₹{calculateTotal()}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">Your Information</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full px-3 py-2 border rounded-md"
                                        onChange={handleChange}
                                        value={formData.name}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full px-3 py-2 border rounded-md"
                                        onChange={handleChange}
                                        value={formData.email}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        className="w-full px-3 py-2 border rounded-md"
                                        onChange={handleChange}
                                        value={formData.phone}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">Event Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        className="w-full px-3 py-2 border rounded-md"
                                        onChange={handleChange}
                                        min={new Date().toISOString().split("T")[0]}
                                        value={formData.date}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">
                                        Special Requests
                                    </label>
                                    <textarea
                                        name="message"
                                        rows={3}
                                        className="w-full px-3 py-2 border rounded-md"
                                        onChange={handleChange}
                                        value={formData.message}
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
