import { useEffect, useState } from "react";
import {
    Calendar,
    User,
    Settings,
    Star,
    Camera,
    MapPin,
    Shield
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
const UserProfile = () => {
    const [activeSection, setActiveSection] = useState('personal');
    const { logout, user, updateProfile } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.log("error", error)
        }
    }
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        address: ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user?.name || "",
                email: user?.email || "",
                phoneNumber: user?.phoneNumber || "",
                address: user?.address || ""
            });
        }
    }, [user]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleUpdateProfile = async (e) => {
        e.preventDefault(); // Prevent page reload
        try {
            await updateProfile(formData);
        } catch (error) {
            console.log("error", error);
        }
    };

    const userData = {
        name: "Rahul Sharma",
        email: "rahul.sharma@gmail.com",
        phone: "+91 9876543210",
        address: "123 MG Road, Bhubaneswar, Odisha",
        role: "user",
        profilePhoto: "default.jpg",
        description: "Event enthusiast who loves organizing memorable celebrations and gatherings.",
        createdAt: "2024-01-15T00:00:00.000Z",
        bookings: 8,
        favoriteVendors: 12
    };

    const sidebarItems = [
        { id: 'personal', label: 'Personal Information', icon: User },
        { id: 'bookings', label: 'My Bookings', icon: Calendar },
        { id: 'reviews', label: 'My Reviews', icon: Star },
        // { id: 'wishlist', label: 'Wishlisted Vendors', icon: Star },
        { id: 'logout', label: 'Logout', icon: Settings }
    ];

    const renderPersonalInfo = () => (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
            <form className="space-y-6" onSubmit={handleUpdateProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg ..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg ..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg ..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <input
                            type="text"
                            value={user?.role}
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border rounded-lg ..."
                    />
                </div>
                <div className="flex space-x-4">
                    <button
                        type="submit"
                        onClick={handleUpdateProfile}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );

    const renderBookings = () => (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>
            <div className="space-y-4">
                {[
                    {
                        id: 1,
                        vendor: "Royal Caterers",
                        service: "Wedding Catering",
                        date: "Dec 25, 2024",
                        status: "Confirmed",
                        amount: "₹25,000",
                        statusColor: "green"
                    },
                    {
                        id: 2,
                        vendor: "Dream Photography",
                        service: "Wedding Photography",
                        date: "Dec 25, 2024",
                        status: "Confirmed",
                        amount: "₹15,000",
                        statusColor: "green"
                    },
                    {
                        id: 3,
                        vendor: "Elite Decorators",
                        service: "Birthday Decoration",
                        date: "Jan 10, 2025",
                        status: "Pending",
                        amount: "₹8,000",
                        statusColor: "yellow"
                    },
                    {
                        id: 4,
                        vendor: "Sound Pro",
                        service: "Sound System",
                        date: "Nov 20, 2024",
                        status: "Completed",
                        amount: "₹5,000",
                        statusColor: "blue"
                    }
                ].map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800 text-lg">{booking.vendor}</h3>
                                <p className="text-gray-600">{booking.service}</p>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {booking.date}
                                    </span>
                                    <span className="font-medium text-gray-800">{booking.amount}</span>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center space-x-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${booking.statusColor === 'green' ? 'bg-green-100 text-green-800' :
                                    booking.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                    {booking.status}
                                </span>
                                <button className="text-purple-600 hover:text-purple-800 font-medium">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderReviews = () => (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Reviews</h2>
            <div className="space-y-6">
                {[
                    {
                        vendor: "Royal Caterers",
                        rating: 5,
                        date: "Dec 26, 2024",
                        review: "Excellent service! The food quality was outstanding and the presentation was beautiful. Highly recommended for wedding events.",
                        service: "Wedding Catering"
                    },
                    {
                        vendor: "Dream Photography",
                        rating: 4,
                        date: "Dec 26, 2024",
                        review: "Great photography skills and very professional team. Captured all the precious moments perfectly.",
                        service: "Wedding Photography"
                    },
                    {
                        vendor: "Sound Pro",
                        rating: 4,
                        date: "Nov 21, 2024",
                        review: "Good sound quality and equipment. Setup was quick and professional.",
                        service: "Sound System"
                    }
                ].map((review, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-semibold text-gray-800">{review.vendor}</h3>
                                <p className="text-sm text-gray-600">{review.service}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                        </div>
                        <p className="text-gray-700">{review.review}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    // const renderWishlist = () => (
    //     <div className="bg-white rounded-xl shadow-lg p-6">
    //         <h2 className="text-2xl font-bold text-gray-800 mb-6">Wishlisted Vendors</h2>
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //             {[
    //                 {
    //                     name: "Premium Decorators",
    //                     category: "Decoration",
    //                     rating: 4.8,
    //                     location: "Bhubaneswar",
    //                     price: "₹10,000 - ₹50,000"
    //                 },
    //                 {
    //                     name: "Elite Caterers",
    //                     category: "Catering",
    //                     rating: 4.9,
    //                     location: "Cuttack",
    //                     price: "₹200 - ₹800 per plate"
    //                 },
    //                 {
    //                     name: "Melody Music",
    //                     category: "DJ & Music",
    //                     rating: 4.7,
    //                     location: "Bhubaneswar",
    //                     price: "₹5,000 - ₹25,000"
    //                 },
    //                 {
    //                     name: "Capture Moments",
    //                     category: "Photography",
    //                     rating: 4.6,
    //                     location: "Puri",
    //                     price: "₹15,000 - ₹40,000"
    //                 }
    //             ].map((vendor, index) => (
    //                 <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    //                     <div className="flex items-start justify-between mb-3">
    //                         <div className="flex-1">
    //                             <h3 className="font-semibold text-gray-800 text-lg">{vendor.name}</h3>
    //                             <p className="text-purple-600 text-sm font-medium">{vendor.category}</p>
    //                             <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
    //                                 <span className="flex items-center">
    //                                     <MapPin className="w-4 h-4 mr-1" />
    //                                     {vendor.location}
    //                                 </span>
    //                                 <span className="flex items-center">
    //                                     <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
    //                                     {vendor.rating}
    //                                 </span>
    //                             </div>
    //                             <p className="text-sm text-gray-600 mt-1">{vendor.price}</p>
    //                         </div>
    //                         <button className="text-red-500 hover:text-red-700 transition-colors">
    //                             <Star className="w-5 h-5 fill-current" />
    //                         </button>
    //                     </div>
    //                     <div className="flex space-x-2">
    //                         <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
    //                             Book Now
    //                         </button>
    //                         <button className="flex-1 border border-purple-600 text-purple-600 hover:bg-purple-50 py-2 px-4 rounded-lg transition-colors text-sm font-medium">
    //                             View Details
    //                         </button>
    //                     </div>
    //                 </div>
    //             ))}
    //         </div>
    //     </div>
    // );

    const renderContent = () => {
        switch (activeSection) {
            case 'personal':
                return renderPersonalInfo();
            case 'bookings':
                return renderBookings();
            case 'reviews':
                return renderReviews();
            // case 'wishlist':
            //     return renderWishlist();
            case 'logout':
                return (
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Logout</h2>
                        <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
                        <div className="space-x-4">
                            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors">
                                Yes, Logout
                            </button>
                            <button
                                onClick={() => setActiveSection('personal')}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                );
            default:
                return renderPersonalInfo();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto py-8 px-4">
                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                        <div className="relative">
                            <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                {user?.name?.split(' ').map(n => n[0]).join('')}
                            </div>
                            <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                                <Camera className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{user?.name}</h1>
                            <p className="text-gray-600 mb-4">{user?.email}</p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                                <div className="flex items-center text-blue-600">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span className="text-sm">{userData.bookings} Bookings</span>
                                </div>
                                <div className="flex items-center text-purple-600">
                                    <Star className="w-4 h-4 mr-1" />
                                    <span className="text-sm">{userData.favoriteVendors} Favorites</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <User className="w-4 h-4 mr-1" />
                                    <span className="text-sm">
                                        Member since {new Date(user?.createdAt).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content with Sidebar */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-xl shadow-lg p-4">
                            <nav className="space-y-2">
                                {sidebarItems.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveSection(item.id)}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${activeSection === item.id
                                                ? 'bg-purple-50 text-purple-700 border-r-4 border-purple-600'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                                } ${item.id === 'logout' ? 'text-red-600 hover:bg-red-50' : ''}`}
                                        >
                                            <IconComponent className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;