import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

interface LineItem {
    variant: string;
    quantity: number;
}

interface Booking {
    _id: string;
    user: string;
    userName: string;
    userEmail: string;
    vendor: string;
    service: string;
    message?: string;
    date: string;
    items: {
        name: string;
        unit: string;
        quantity: number;
        unitPrice: number;
    }[];
    subTotal: number;
    tax: number;
    grandTotal: number;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    paymentStatus: "pending" | "paid" | "refunded";
    createdAt: string;
    updatedAt: string;
}

interface PaymentDetails {
    orderId: string;
    amount: number;
    currency: string;
    key: string;
}

interface CreateBookingData {
    service: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    message?: string;
    totalPrice: number;
    variants: LineItem[];
}

interface BookingContextType {
    bookings: Booking[];
    vendorBookings: Booking[];
    loading: boolean;
    error: string | null;
    createBooking: (
        data: CreateBookingData
    ) => Promise<{ booking: Booking; payment: PaymentDetails }>;
    getVendorBookings: (vendorId: string) => Promise<Booking[]>;
    getUserBookings: (userId: string) => Promise<Booking[]>;
    updateBookingStatus: (bookingId: string, status: string) => Promise<Booking>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [vendorBookings, setVendorBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const token = localStorage.getItem("token");

    const api = axios.create({
        baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/bookings`,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Set auth token
    const setAuthToken = (token: string | null) => {
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common["Authorization"];
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        setAuthToken(token);
    }, []);

    const createBooking = async (bookingData: CreateBookingData) => {
        

        try {
            setLoading(true);
            setError(null);

            const response = await api.post("/", bookingData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            // Add to user's bookings
            setBookings((prev) => [...prev, response.data.data.booking]);

            toast.success("Booking created successfully!");
            return response.data.data;
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to create booking";
            setError(errorMessage);
            toast.error(errorMessage);
            console.log("err",err)
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getVendorBookings = async (vendorId: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(`/vendor/${vendorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setVendorBookings(response.data.data);
            return response.data.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Failed to fetch vendor bookings";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getUserBookings = async (userId: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(`/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBookings(response.data.data);
            return response.data.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Failed to fetch user bookings";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const updateBookingStatus = async (bookingId: string, status: string) => {
        try {
            setLoading(true);
            const response = await api.put(`/${bookingId}/status`, { status });

            // Update both bookings and vendorBookings state
            setBookings((prev) => prev.map((b) => (b._id === bookingId ? response.data.data : b)));
            setVendorBookings((prev) =>
                prev.map((b) => (b._id === bookingId ? response.data.data : b))
            );

            return response.data.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to update booking status";
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    // Load initial bookings
    useEffect(() => {
        if (!user?._id) return;

        const loadBookings = async () => {
            try {
                if (user.role === "user") {
                    await getUserBookings(user._id);
                } else if (user.role === "vendor") {
                    await getVendorBookings(user._id);
                }
            } catch (error) {
                console.error("Failed to load bookings:", error);
            }
        };

        loadBookings();
    }, [user?._id, user?.role]);

    return (
        <BookingContext.Provider
            value={{
                bookings,
                vendorBookings,
                loading,
                error,
                createBooking,
                getVendorBookings,
                getUserBookings,
                updateBookingStatus,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = (): BookingContextType => {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error("useBooking must be used within a BookingProvider");
    }
    return context;
};
