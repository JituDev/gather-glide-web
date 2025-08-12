import React, { useEffect, useState } from "react";
import { useAdmin } from "../contexts/AdminContext";
import Navbar from "@/components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const AdminBookingsPage = () => {
    const { allBookings, getAllBookings, vendors, getVendors } = useAdmin();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        vendor: "all",
        status: "all",
        startDate: "",
        endDate: "",
    });

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                await getVendors();
                await getAllBookings();
            } catch (err) {
                setError(err.message);
                toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === "admin") {
            loadData();
        }
    }, [user]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const applyFilters = async () => {
        try {
            setLoading(true);

            // Prepare query params object
            const queryParams = {};

            if (filters.vendor !== "all") queryParams.vendor = filters.vendor;
            if (filters.status !== "all") queryParams.status = filters.status;
            if (filters.startDate) queryParams.startDate = filters.startDate;
            if (filters.endDate) queryParams.endDate = filters.endDate;

            await getAllBookings(queryParams);
        } catch (err) {
            toast.error("Failed to apply filters");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Apply filters automatically when they change
    useEffect(() => {
        if (user?.role === "admin") {
            applyFilters();
        }
    }, [filters]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status) => {
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

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">All Bookings</h1>
                        <p className="text-gray-600 mb-6">
                            Manage all bookings across the platform
                        </p>

                        {/* Filter Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Vendor
                                </label>
                                <select
                                    name="vendor"
                                    value={filters.vendor}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="all">All Vendors</option>
                                    {vendors.map((vendor) => (
                                        <option key={vendor._id} value={vendor._id}>
                                            {vendor.businessName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    From
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={filters.startDate}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    To
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={filters.endDate}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                        </div>

                        {/* Bookings List */}
                        {allBookings.length === 0 ? (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-medium text-gray-700">
                                    No bookings found
                                </h3>
                                <p className="mt-2 text-gray-500">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Booking ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Service
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Vendor
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {allBookings.map((booking) => (
                                            <tr key={booking._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {booking._id.substring(18, 24)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {booking.service?.title || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {booking.vendor?.businessName || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {booking.userName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(booking.date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                                            booking.status
                                                        )}`}
                                                    >
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    ₹{booking.grandTotal}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        to={`/admin/bookings/${booking._id}`}
                                                        className="text-purple-600 hover:text-purple-900"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminBookingsPage;
