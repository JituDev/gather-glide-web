import React, { useEffect, useState } from "react";
import { useBooking } from "../contexts/BookingContext";
import Navbar from "@/components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const UserBookingsPage = () => {
    const { bookings, getUserBookings, loading, error } = useBooking();
    const { user } = useAuth();
    const [filter, setFilter] = useState("all"); // 'all', 'upcoming', 'past'

    useEffect(() => {
        if (user?._id) {
            getUserBookings(user._id).catch((err) => {
                toast.error("Failed to load bookings");
                console.error(err);
            });
        }
    }, [user?._id]);

    const filteredBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.date);
        const today = new Date();

        if (filter === "upcoming") return bookingDate >= today;
        if (filter === "past") return bookingDate < today;
        return true;
    });

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            case "completed":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) return <div className="text-center py-8">Loading your bookings...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Bookings</h1>
                        <p className="text-gray-600 mb-6">
                            View and manage all your upcoming and past bookings
                        </p>

                        {/* Filter Controls */}
                        <div className="flex space-x-4 mb-6">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-4 py-2 rounded-md ${
                                    filter === "all"
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-200 text-gray-700"
                                }`}
                            >
                                All Bookings
                            </button>
                            <button
                                onClick={() => setFilter("upcoming")}
                                className={`px-4 py-2 rounded-md ${
                                    filter === "upcoming"
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-200 text-gray-700"
                                }`}
                            >
                                Upcoming
                            </button>
                            <button
                                onClick={() => setFilter("past")}
                                className={`px-4 py-2 rounded-md ${
                                    filter === "past"
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-200 text-gray-700"
                                }`}
                            >
                                Past
                            </button>
                        </div>

                        {/* Bookings List */}
                        {filteredBookings.length === 0 ? (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-medium text-gray-700">
                                    No {filter === "all" ? "" : filter} bookings found
                                </h3>
                                <p className="mt-2 text-gray-500">
                                    {filter === "all"
                                        ? "You haven't made any bookings yet."
                                        : `You don't have any ${filter} bookings.`}
                                </p>
                                <Link
                                    to="/services"
                                    className="mt-4 inline-block px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                                >
                                    Browse Services
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredBookings.map((booking) => (
                                    <div
                                        key={booking._id}
                                        className="border rounded-lg overflow-hidden hover:shadow-md transition"
                                    >
                                        <div className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-800">
                                                        {booking.service?.title || "Service"}
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        {formatDate(booking.date)}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                        booking.status
                                                    )}`}
                                                >
                                                    {booking.status.charAt(0).toUpperCase() +
                                                        booking.status.slice(1)}
                                                </span>
                                            </div>

                                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Vendor
                                                    </h4>
                                                    <p className="text-gray-800">
                                                        {booking.vendor?.businessName || "Vendor"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Total
                                                    </h4>
                                                    <p className="text-gray-800">
                                                        ₹{booking.grandTotal}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Payment
                                                    </h4>
                                                    <p className="text-gray-800">
                                                        {booking.paymentStatus === "paid"
                                                            ? "Paid"
                                                            : "Pending"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-500">
                                                    Items Booked
                                                </h4>
                                                <ul className="mt-2 space-y-2">
                                                    {booking.items.map((item, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex justify-between"
                                                        >
                                                            <span className="text-gray-700">
                                                                {item.quantity} × {item.name}
                                                            </span>
                                                            <span className="text-gray-800">
                                                                ₹{item.quantity * item.unitPrice}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="mt-6 flex justify-end space-x-3">
                                                <Link
                                                    to={`/booking/${booking._id}`}
                                                    className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition"
                                                >
                                                    View Details
                                                </Link>
                                                {booking.status === "pending" && (
                                                    <button
                                                        onClick={() =>
                                                            handleCancelBooking(booking._id)
                                                        }
                                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                                    >
                                                        Cancel Booking
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserBookingsPage;
