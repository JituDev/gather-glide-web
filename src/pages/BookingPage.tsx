import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useService } from "../contexts/ServiceContext";
import Navbar from "@/components/Navbar";
import { Footer } from "react-day-picker";

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getService, currentService, loading, error } = useService();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date: "",
        message: "",
        variants: {},
    });

    useEffect(() => {
        if (id) {
            getService(id);
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleVariantChange = (variantId, value) => {
        setFormData({
            ...formData,
            variants: {
                ...formData.variants,
                [variantId]: Number(value),
            },
        });
    };

    const calculateTotal = () => {
        if (!currentService?.variants) return 0;

        return currentService.variants.reduce((total, variant) => {
            const quantity = formData.variants[variant._id] || 0;
            return total + variant.price * quantity;
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const bookingData = {
            service: id,
            ...formData,
            totalPrice: calculateTotal(),
            variants: Object.entries(formData.variants)
                .filter(([_, quantity]) => quantity > 0)
                .map(([variantId, quantity]) => ({
                    variant: variantId,
                    quantity,
                })),
        };

        // Here you would call your API to create the booking
        console.log("Booking data:", bookingData);
        // navigate('/confirmation');
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

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
                            <h2 className="text-xl font-semibold mb-4">Service Details</h2>
                            <div className="space-y-4">
                                {currentService?.variants?.map((variant) => (
                                    <div key={variant._id} className="border-b pb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium">{variant.name}</span>
                                            <span>
                                                ₹{variant.price}/{variant.unit}
                                            </span>
                                        </div>
                                        <input
                                            type="number"
                                            min={variant.minQty}
                                            max={variant.maxQty || ""}
                                            placeholder={`Quantity (min ${variant.minQty})`}
                                            className="w-full px-3 py-2 border rounded-md"
                                            onChange={(e) =>
                                                handleVariantChange(variant._id, e.target.value)
                                            }
                                        />
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
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">
                                        Special Requests
                                    </label>
                                    <textarea
                                        name="message"
                                        rows="3"
                                        className="w-full px-3 py-2 border rounded-md"
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-md hover:opacity-90 transition"
                                >
                                    Confirm Booking
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
