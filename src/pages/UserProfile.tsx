import { useEffect, useState } from "react";
import {
    Calendar,
    User,
    Settings,
    Star,
    Camera,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
const UserProfile = () => {
    const [activeSection, setActiveSection] = useState('personal');
    const { logout, user, updateProfile } = useAuth();
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
    // Initialize profile image preview when user data loads
    useEffect(() => {
        if (user?.profilePhoto && user.profilePhoto !== "default.jpg") {
            setProfileImagePreview(user.profilePhoto);
        }
    }, [user]);
    // Handle profile image change
    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImage(file);
            setProfileImagePreview(URL.createObjectURL(file));
        }
    };
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
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            // Append all fields to formData
            if (formData.name) formData.append('name', formData.name);
            if (formData.email) formData.append('email', formData.email);
            if (formData.phoneNumber) formData.append('phoneNumber', formData.phoneNumber);
            if (formData.address) formData.append('address', formData.address);

            // Append profile image if selected
            if (profileImage) {
                formData.append('profilePhoto', profileImage);
            }

            await updateProfile(formData);
            // Reset profile image state after successful upload
            setProfileImage(null);
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
        // { id: 'bookings', label: 'My Bookings', icon: Calendar },
        // { id: 'reviews', label: 'My Reviews', icon: Star },
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
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <input
                            type="text"
                            value={user?.role}
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                        />
                    </div> */}
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


    const renderContent = () => {
        switch (activeSection) {
            case 'personal':
                return renderPersonalInfo();
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
                            {profileImagePreview ? (
                                <img
                                    src={profileImagePreview}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                    {user?.name?.split(' ').map(n => n[0]).join('')}
                                </div>
                            )}
                            <label htmlFor="profileImage" className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                                <Camera className="w-4 h-4 text-gray-600" />
                                <input
                                    id="profileImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfileImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{user?.name}</h1>
                            <p className="text-gray-600 mb-4">{user?.email}</p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                                {/* <div className="flex items-center text-blue-600">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span className="text-sm">{userData.bookings} Bookings</span>
                                </div>
                                <div className="flex items-center text-purple-600">
                                    <Star className="w-4 h-4 mr-1" />
                                    <span className="text-sm">{userData.favoriteVendors} Favorites</span>
                                </div> */}
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