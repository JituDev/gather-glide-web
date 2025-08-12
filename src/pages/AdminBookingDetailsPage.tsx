import React from "react";
import { useParams } from "react-router-dom";
import { useAdmin } from "../contexts/AdminContext";
import Navbar from "@/components/Navbar";

const AdminBookingDetailsPage = () => {
    const { id } = useParams();
    const { allBookings } = useAdmin();

    const booking = allBookings.find((b) => b._id === id);

    if (!booking) {
        return <div>Booking not found</div>;
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Booking Details</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
                            <div className="space-y-2">
                                <p>
                                    <span className="font-medium">Booking ID:</span> {booking._id}
                                </p>
                                <p>
                                    <span className="font-medium">Status:</span> {booking.status}
                                </p>
                                <p>
                                    <span className="font-medium">Date:</span>{" "}
                                    {new Date(booking.date).toLocaleString()}
                                </p>
                                <p>
                                    <span className="font-medium">Total Amount:</span> ₹
                                    {booking.grandTotal}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                            <div className="space-y-2">
                                <p>
                                    <span className="font-medium">Name:</span> {booking.userName}
                                </p>
                                <p>
                                    <span className="font-medium">Email:</span> {booking.userEmail}
                                </p>
                                <p>
                                    <span className="font-medium">Phone:</span> {booking.phone}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">Vendor Information</h2>
                            <div className="space-y-2">
                                <p>
                                    <span className="font-medium">Business:</span>{" "}
                                    {booking.vendor?.businessName || "N/A"}
                                </p>
                                <p>
                                    <span className="font-medium">Email:</span>{" "}
                                    {booking.vendor?.email || "N/A"}
                                </p>
                                <p>
                                    <span className="font-medium">Phone:</span>{" "}
                                    {booking.vendor?.phone || "N/A"}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">Service Information</h2>
                            <div className="space-y-2">
                                <p>
                                    <span className="font-medium">Service:</span>{" "}
                                    {booking.service?.title || "N/A"}
                                </p>
                                <p>
                                    <span className="font-medium">Description:</span>{" "}
                                    {booking.service?.description || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Items Booked</h2>
                        <ul className="space-y-2">
                            {booking.items.map((item, index) => (
                                <li key={index} className="flex justify-between border-b pb-2">
                                    <span>
                                        {item.quantity} × {item.name} ({item.unit})
                                    </span>
                                    <span>₹{item.quantity * item.unitPrice}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 flex justify-between font-medium">
                            <span>Subtotal:</span>
                            <span>₹{booking.subTotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax:</span>
                            <span>₹{booking.tax}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold mt-2">
                            <span>Total:</span>
                            <span>₹{booking.grandTotal}</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-2">Special Requests</h2>
                        <p className="text-gray-700">{booking.message || "None"}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminBookingDetailsPage;
