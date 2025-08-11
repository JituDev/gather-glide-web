import React, { useEffect, useState } from "react";
import { useBooking } from "../contexts/BookingContext";
import Navbar from "@/components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const VendorBookingsPage = () => {
    const { vendorBookings, getVendorBookings, loading, error } = useBooking();
    const { user } = useAuth();
    const [filter, setFilter] = useState("all"); // 'all', 'upcoming', 'past', 'pending'
    const [selectedService, setSelectedService] = useState("all");

    useEffect(() => {
        if (user?._id) {
            getVendorBookings(user._id).catch((err) => {
                toast.error("Failed to load bookings");
                console.error(err);
            });
        }
    }, [user?._id]);

    // Get unique services for filter dropdown
    const services = Array.from(new Set(vendorBookings.map((b) => b.service?._id))).map((id) => {
        const booking = vendorBookings.find((b) => b.service?._id === id);
        return {
            id,
            title: booking?.service?.title || "Unknown Service",
        };
    });

    const filteredBookings = vendorBookings.filter((booking) => {
        const bookingDate = new Date(booking.date);
        const today = new Date();
        const dateMatch =
            filter === "upcoming"
                ? bookingDate >= today
                : filter === "past"
                ? bookingDate < today
                : true;
        const statusMatch = filter === "pending" ? booking.status === "pending" : true;
        const serviceMatch = selectedService === "all" || booking.service?._id === selectedService;

        return dateMatch && statusMatch && serviceMatch;
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

    const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
        try {
            await updateBookingStatus(bookingId, newStatus);
            toast.success(`Booking marked as ${newStatus}`);
        } catch (err) {
            toast.error("Failed to update booking status");
            console.error(err);
        }
    };

    if (loading) return <div className="text-center py-8">Loading bookings...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Your Service Bookings
                        </h1>
                        <p className="text-gray-600 mb-6">Manage all bookings for your services</p>

                        {/* Filter Controls */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                <button
                                    onClick={() => setFilter("all")}
                                    className={`px-4 py-2 rounded-md whitespace-nowrap ${
                                        filter === "all"
                                            ? "bg-purple-600 text-white"
                                            : "bg-gray-200 text-gray-700"
                                    }`}
                                >
                                    All Bookings
                                </button>
                                <button
                                    onClick={() => setFilter("upcoming")}
                                    className={`px-4 py-2 rounded-md whitespace-nowrap ${
                                        filter === "upcoming"
                                            ? "bg-purple-600 text-white"
                                            : "bg-gray-200 text-gray-700"
                                    }`}
                                >
                                    Upcoming
                                </button>
                                <button
                                    onClick={() => setFilter("past")}
                                    className={`px-4 py-2 rounded-md whitespace-nowrap ${
                                        filter === "past"
                                            ? "bg-purple-600 text-white"
                                            : "bg-gray-200 text-gray-700"
                                    }`}
                                >
                                    Past
                                </button>
                                <button
                                    onClick={() => setFilter("pending")}
                                    className={`px-4 py-2 rounded-md whitespace-nowrap ${
                                        filter === "pending"
                                            ? "bg-purple-600 text-white"
                                            : "bg-gray-200 text-gray-700"
                                    }`}
                                >
                                    Pending
                                </button>
                            </div>

                            <div className="min-w-[200px]">
                                <select
                                    value={selectedService}
                                    onChange={(e) => setSelectedService(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="all">All Services</option>
                                    {services.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Bookings List */}
                        {filteredBookings.length === 0 ? (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-medium text-gray-700">
                                    No bookings found
                                </h3>
                                <p className="mt-2 text-gray-500">
                                    {filter === "all"
                                        ? "You don't have any bookings yet."
                                        : `You don't have any ${filter} bookings.`}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredBookings.map((booking) => (
                                    <div
                                        key={booking._id}
                                        className="border rounded-lg overflow-hidden hover:shadow-md transition"
                                    >
                                        <div className="p-6">
                                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-800">
                                                        {booking.service?.title || "Service"}
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        {formatDate(booking.date)}
                                                    </p>
                                                    <p className="mt-1 text-gray-700">
                                                        Customer: {booking.userName} (
                                                        {booking.userEmail})
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                            booking.status
                                                        )}`}
                                                    >
                                                        {booking.status.charAt(0).toUpperCase() +
                                                            booking.status.slice(1)}
                                                    </span>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                            booking.paymentStatus === "paid"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                    >
                                                        Payment:{" "}
                                                        {booking.paymentStatus
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            booking.paymentStatus.slice(1)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Contact
                                                    </h4>
                                                    <p className="text-gray-800">{booking.phone}</p>
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
                                                        Special Requests
                                                    </h4>
                                                    <p className="text-gray-800">
                                                        {booking.message || "None"}
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
                                                                {item.quantity} × {item.name} (
                                                                {item.unit})
                                                            </span>
                                                            <span className="text-gray-800">
                                                                ₹{item.quantity * item.unitPrice}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="mt-6 flex flex-wrap justify-end gap-3">
                                                <Link
                                                    to={`/vendor/booking/${booking._id}`}
                                                    className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition"
                                                >
                                                    View Details
                                                </Link>
                                                {booking.status === "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleStatusUpdate(
                                                                    booking._id,
                                                                    "confirmed"
                                                                )
                                                            }
                                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleStatusUpdate(
                                                                    booking._id,
                                                                    "cancelled"
                                                                )
                                                            }
                                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {booking.status === "confirmed" && (
                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                booking._id,
                                                                "completed"
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                                    >
                                                        Mark as Completed
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

export default VendorBookingsPage;
