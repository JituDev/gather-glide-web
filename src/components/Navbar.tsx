import { useEffect, useState } from "react";
import { Calendar, Gift, HelpCircle, Home, Menu, X, ChevronDown, Heart, User, Briefcase, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { MapPin as LocationIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getSavedCity } from "@/utils/cityStorage";

const Navbar = ({ cityName: propCityName = null  }) => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVendorDropdownOpen, setIsVendorDropdownOpen] = useState(false);
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
   const [localCityName, setLocalCityName] = useState(null);

  useEffect(() => {
    // Check for city name from props first
    if (propCityName) {
      setLocalCityName(propCityName);
    } else {
      // Fall back to localStorage
      const savedCity = getSavedCity();
      if (savedCity) {
        setLocalCityName(savedCity);
      }
    }
  }, [propCityName]);


  useEffect(() => {
    if (user) {
      setDisplayName(user?.name || user?.email?.split('@')[0]);
    } else {
      setDisplayName("");
    }
  }, [user]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleVendorDropdown = () => setIsVendorDropdownOpen(!isVendorDropdownOpen);

  const vendorCategories = [
    {
      name: "Tent",
      subcategories: [
        "Wedding Tents",
        "Party Tents",
        "Luxury Tents",
        "Outdoor Tents"
      ]
    },
    {
      name: "light-sound",
      subcategories: [
        "LED Lighting",
        "Sound Systems",
        "DJ Equipment",
        "Stage Lighting",
        "Decorative Lights",
        "Audio Visual Equipment"
      ]
    },
    {
      name: "Party Hall",
      subcategories: [
        "Wedding Halls",
        "Banquet Halls",
        "Conference Halls",
        "Outdoor Venues",
        "Luxury Venues",
        // "Budget Venues"
      ]
    },
    {
      name: "Photography",
      subcategories: [
        "Wedding Photography",
        "Pre-Wedding Shoot",
        "Candid Photography",
        "Traditional Photography",
        "Videography",
        "Drone Photography"
      ]
    },
    {
      name: "Catering",
      subcategories: [
        "Wedding Catering",
        "Party Catering",
        "Corporate Catering",
        "Dessert Catering"
      ]
    }
  ];

  // Common nav items for all roles
  const commonNavItems = [
    {
      path: "/ServicesPage",
      icon: Home,
      label: "SERVICES",
      onClick: (navigate) => {
        // Clear any existing location state
        navigate('/ServicesPage', { state: {} });
      }
    },
  ];

  // User-specific nav items
  const userNavItems = [
    { path: "/wishlist", icon: Heart, label: "WISHLIST" },
    { path: "/bookings", icon: Calendar, label: "BOOKINGS" },
    { path: "/userOffer", icon: Gift, label: "OFFERS" }, // User offers
    { path: "/help", icon: HelpCircle, label: "HELP" },
  ];

  // Vendor-specific nav items
  const vendorNavItems = [
    { path: "/vendorOffer", icon: Gift, label: "OFFERS" }, // Vendor offers
    { path: "/services", icon: Briefcase, label: "SERVICE MGMT" },
    { path: "/bookingmanagement", icon: Calendar, label: "BOOKING MGMT" }
  ];

  // Admin-specific nav items
  const adminNavItems = [
    // Add admin-specific items if needed
    { path: "/bookingmanagement", icon: Calendar, label: "BOOKING MGMT" },
    { path: "/admin/usermanagement", icon: User, label: "USER MGMT" },
    { path: "/admin/support", icon: HelpCircle, label: "SUPPORT MGMT" },
    { path: "/admin/category_management", icon: Gift, label: "CATEGORY MGMT" },

  ];

  const getRoleSpecificNavItems = () => {
    if (!user) return [];
    switch (user.role) {
      case 'user': return userNavItems;
      case 'vendor': return vendorNavItems;
      case 'admin': return adminNavItems;
      default: return [];
    }
  };

  const getProfilePath = () => {
    if (!user) return "/login";
    switch (user.role) {
      case 'user': return "/userprofile";
      case 'vendor': return "/vendorprofile";
      case 'admin': return "/adminprofile";
      default: return "/login";
    }
  };

  const getRoleIcon = () => {
    if (!user) return null;
    switch (user.role) {
      case 'user': return <User className="text-purple-800 w-4 h-4" />;
      case 'vendor': return <Briefcase className="text-purple-800 w-4 h-4" />;
      case 'admin': return <Shield className="text-purple-800 w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <nav className="bg-gradient-to-r from-purple-800 via-purple-700 to-blue-700 text-white py-4 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-bold text-2xl flex items-center">
            <span className="bg-white text-purple-800 px-3 py-1 rounded mr-2">EVENT</span>
            <span>LOOP</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 mx-auto">
            {/* Common items */}
            {commonNavItems.map((item, index) => (
              <Link key={index} to={item.path} onClick={() => item.onClick && item.onClick(navigate)} className="hover:text-purple-200 transition-colors flex items-center">
                <item.icon className="w-4 h-4 mr-1" /> {item.label}
              </Link>
            ))}

            {/* Role-specific items */}
            {user && getRoleSpecificNavItems().map((item, index) => (
              <Link key={index} to={item.path} className="hover:text-purple-200 transition-colors flex items-center">
                <item.icon className="w-4 h-4 mr-1" /> {item.label}
              </Link>
            ))}

            {/* Vendor Dropdown */}
            {(!user || user.role === 'user') && (
              <div className="relative">
                <button
                  onClick={toggleVendorDropdown}
                  onMouseEnter={() => setIsVendorDropdownOpen(true)}
                  className="hover:text-purple-200 transition-colors flex items-center"
                >
                  <Briefcase className="w-4 h-4 mr-1" /> VENDOR
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>

                {isVendorDropdownOpen && (
                  <div
                    className="fixed top-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-6xl max-h-[calc(100vh-6rem)] bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 z-50 overflow-y-auto"
                    onMouseLeave={() => setIsVendorDropdownOpen(false)}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 p-4 lg:p-6">
                      {vendorCategories.map((category, index) => (
                        <div key={index} className="space-y-3">
                          <h3 className="font-bold text-purple-800 text-base lg:text-lg border-b border-purple-200 pb-2">
                            {category.name}
                          </h3>
                          <ul className="space-y-2">
                            {category.subcategories.map((subcategory, subIndex) => (
                              <li key={subIndex}>
                                <Link
                                  to={`/vendors/${category.name.toLowerCase().replace(/\s+/g, '-')}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                                  className="text-gray-600 hover:text-blue-600 transition-colors text-xs lg:text-sm block py-1"
                                  onClick={() => setIsVendorDropdownOpen(false)}
                                >
                                  {subcategory}
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <Link
                            to={`/vendors/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-purple-600 hover:text-purple-800 font-medium text-xs lg:text-sm block mt-3"
                            onClick={() => setIsVendorDropdownOpen(false)}
                          >
                            View All {category.name} →
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu toggle button */}
          <button onClick={toggleMenu} className="md:hidden text-white">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          {localCityName && (
    <button
      onClick={() => navigate('/ServicesPage', { state: { location: localCityName } })}
      className="hover:text-purple-200 transition-colors flex items-center px-2"
    >
      <LocationIcon className="w-4 h-4 mr-1" /> {localCityName}
    </button>
  )}

          {/* Profile/Login Button */}
          {user ? (
            <Link
              to={getProfilePath()}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:bg-purple-50 transition-all"
            >
              {getRoleIcon()}
              <span className="text-purple-800 font-medium">{displayName}</span>
            </Link>
          ) : (
            <Link to="/login" className="hidden sm:block">
              <Button className="bg-white text-purple-800 hover:bg-purple-100 px-6 py-2 rounded-full font-medium shadow-md transition-all hover:scale-105">
                GET STARTED
              </Button>
            </Link>
          )}
        </div>


        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            {/* Common items */}
            {commonNavItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="hover:text-purple-200 transition-colors flex items-center"
                onClick={toggleMenu}
              >
                <item.icon className="w-4 h-4 mr-2" /> {item.label}
              </Link>
            ))}

            {/* Role-specific items */}
            {user && getRoleSpecificNavItems().map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="hover:text-purple-200 transition-colors flex items-center"
                onClick={toggleMenu}
              >
                <item.icon className="w-4 h-4 mr-2" /> {item.label}
              </Link>
            ))}

            {/* Mobile Vendor Section */}
            {(!user || user.role === 'user') && (
              <div>
                <button
                  onClick={toggleVendorDropdown}
                  className="w-full text-left hover:text-purple-200 transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" /> VENDOR
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isVendorDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isVendorDropdownOpen && (
                  <div className="mt-2 ml-6 space-y-3">
                    {vendorCategories.map((category, index) => (
                      <div key={index}>
                        <h4 className="font-semibold text-purple-200 mb-1">{category.name}</h4>
                        <ul className="ml-4 space-y-1">
                          {category.subcategories.slice(0, 3).map((subcategory, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                to={`/vendors/${category.name.toLowerCase().replace(/\s+/g, '-')}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-gray-300 hover:text-white transition-colors text-sm block"
                                onClick={toggleMenu}
                              >
                                {subcategory}
                              </Link>
                            </li>
                          ))}
                          <li>
                            <Link
                              to={`/vendors/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                              className="text-purple-300 hover:text-purple-100 text-sm block"
                              onClick={toggleMenu}
                            >
                              View All {category.name} →
                            </Link>
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!user && (
              <Link to="/login" className="block" onClick={toggleMenu}>
                <Button className="w-full bg-white text-purple-800 hover:bg-purple-100 py-2 rounded-full font-medium shadow-md transition-all">
                  GET STARTED
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;