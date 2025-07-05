import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  MapPin,
  Users,
  Calendar,
  Home,
  Wifi,
  Car,
  Utensils,
  Music,
  Camera,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  ThumbsUp,
  User,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useService } from '../contexts/ServiceContext';
import { formatPrice } from '../utils/formatPrice';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getService, currentService, loadingServices, errorServices } = useService();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    // description: true,
    features: false,
    faqs: false,
    policies: false,
    moreInfo: false
  });

  useEffect(() => {
    if (id) {
      getService(id);
    }
  }, [id]);

  const nextImage = () => {
    if (currentService?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % currentService?.images.length);
    }
  };

  const prevImage = () => {
    if (currentService?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + currentService?.images.length) % currentService?.images.length);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const submitReview = () => {
    if (rating > 0 && review.trim()) {
      console.log('Review submitted:', { rating, review });
      setRating(0);
      setReview('');
      alert('Thank you for your review!');
    }
  };

  const renderCategorySpecificDetails = () => {
  if (!currentService?.details) return null;

  const details = currentService.details;
  const category = currentService?.category?.title?.toLowerCase();

  // Helper function to render select/multi-select values
  const renderSelectValue = (value, options) => {
    if (!value) return 'Not specified';
    if (Array.isArray(value)) return value.join(', ');
    return value;
  };

  // Category-specific sections
  let categorySections = [];

  switch (category) {
    case 'decoration':
      categorySections = [
        {
          title: 'Decoration Details',
          key: 'features',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Type of Decoration</h4>
                  <p className="text-gray-900">{details.decorationType || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Materials Used</h4>
                  <p className="text-gray-900">{details.materialUsed || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Applicable For</h4>
                  <p className="text-gray-900">{details.indoorOutdoor || 'Not specified'}</p>
                </div>
                {details.theme_color && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Theme Color</h4>
                    <p className="text-gray-900">{details.theme_color}</p>
                  </div>
                )}
              </div>
            </div>
          )
        },
        {
          title: 'Add-ons & Features',
          key: 'moreInfo',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.includesLighting ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Includes Decorative Lighting</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.includesSoundSetup ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Includes Sound Setup</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.customizationAvailable ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Customization Available</span>
                </div>
                {details.floralType && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Type of Flowers</h4>
                    <p className="text-gray-900">{details.floralType}</p>
                  </div>
                )}
              </div>
            </div>
          )
        },
        {
          title: 'Booking & Pricing',
          key: 'policies',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.startingPrice && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Starting Price</h4>
                    <p className="text-gray-900">{formatPrice(details.startingPrice)}</p>
                  </div>
                )}
                {details.advancePayment && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Advance Payment</h4>
                    <p className="text-gray-900">{details.advancePayment}%</p>
                  </div>
                )}
                {details.cancellationPolicy && (
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500">Cancellation Policy</h4>
                    <p className="text-gray-900">{details.cancellationPolicy}</p>
                  </div>
                )}
              </div>
            </div>
          )
        }
      ];
      break;

    case 'tent':
      categorySections = [
        {
          title: 'Tent Information',
          key: 'features',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.tentSize && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Tent Size</h4>
                    <p className="text-gray-900">{details.tentSize} sq ft</p>
                  </div>
                )}
                {details.materialType && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Material Type</h4>
                    <p className="text-gray-900">{details.materialType}</p>
                  </div>
                )}
                {details.colorTheme && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Color Theme</h4>
                    <p className="text-gray-900">{details.colorTheme}</p>
                  </div>
                )}
                {details.question_1 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Question 1</h4>
                    <p className="text-gray-900">{details.question_1}</p>
                  </div>
                )}
                {details.qu_2 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Question 2</h4>
                    <p className="text-gray-900">{details.qu_2}</p>
                  </div>
                )}
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.q3 ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Question 3</span>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Facilities',
          key: 'moreInfo',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.lightingIncluded ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Lighting Included</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.fanCoolerIncluded ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Fan/Cooler Included</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.waterproof ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Waterproof Tent</span>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Service Policies',
          key: 'policies',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.installationTime && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Setup Time</h4>
                    <p className="text-gray-900">{details.installationTime} hours</p>
                  </div>
                )}
                {details.extraCharges && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Extra Charges</h4>
                    <p className="text-gray-900">{details.extraCharges}</p>
                  </div>
                )}
              </div>
            </div>
          )
        }
      ];
      break;

    case 'photography':
      categorySections = [
        {
          title: 'Photography Details',
          key: 'features',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.cameraBrands && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Camera Brands</h4>
                    <p className="text-gray-900">{details.cameraBrands}</p>
                  </div>
                )}
                {details.numberOfPhotographers && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Number of Photographers</h4>
                    <p className="text-gray-900">{details.numberOfPhotographers}</p>
                  </div>
                )}
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.includesDrone ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Drone Coverage Included</span>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Coverage Info',
          key: 'moreInfo',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.eventTypesCovered && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Event Types Covered</h4>
                    <p className="text-gray-900">{details.eventTypesCovered}</p>
                  </div>
                )}
                {details.deliveryTime && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Photo Delivery Time</h4>
                    <p className="text-gray-900">{details.deliveryTime} days</p>
                  </div>
                )}
              </div>
            </div>
          )
        },
        {
          title: 'Deliverables',
          key: 'policies',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.albumIncluded ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Printed Album Included</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.onlineGallery ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Online Gallery Access</span>
                </div>
              </div>
            </div>
          )
        }
      ];
      break;

    case 'catering':
      categorySections = [
        {
          title: 'Menu Details',
          key: 'features',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.vegMenu && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Veg Menu</h4>
                    <p className="text-gray-900">{details.vegMenu}</p>
                  </div>
                )}
                {details.nonVegMenu && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Non-Veg Menu</h4>
                    <p className="text-gray-900">{details.nonVegMenu}</p>
                  </div>
                )}
                {details.cuisineTypes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Cuisine Types</h4>
                    <p className="text-gray-900">{details.cuisineTypes}</p>
                  </div>
                )}
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.dessertsIncluded ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Desserts Included</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.beveragesIncluded ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Beverages Included</span>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Service Type',
          key: 'moreInfo',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.buffetAvailable ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Buffet Available</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.liveCounter ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Live Counter Available</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.tableServiceAvailable ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Table Service Available</span>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Guest Capacity',
          key: 'capacity',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.minGuests && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Minimum Guests</h4>
                    <p className="text-gray-900">{details.minGuests}</p>
                  </div>
                )}
                {details.maxGuests && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Maximum Guests</h4>
                    <p className="text-gray-900">{details.maxGuests}</p>
                  </div>
                )}
              </div>
            </div>
          )
        },
        {
          title: 'Staff and Service',
          key: 'staff',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.serviceStaffCount && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Service Staff Count</h4>
                    <p className="text-gray-900">{details.serviceStaffCount}</p>
                  </div>
                )}
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.cutleryIncluded ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Cutlery Included</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.uniformedStaff ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Uniformed Staff</span>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Booking & Payment',
          key: 'policies',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.advancePercentage && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Advance Payment</h4>
                    <p className="text-gray-900">{details.advancePercentage}%</p>
                  </div>
                )}
                {details.cancellationPolicy && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Cancellation Policy</h4>
                    <p className="text-gray-900">{details.cancellationPolicy}</p>
                  </div>
                )}
              </div>
            </div>
          )
        }
      ];
      break;

    case 'light and sound':
      categorySections = [
        {
          title: 'Lighting Details',
          key: 'features',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.lightTypes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Types of Lights</h4>
                    <p className="text-gray-900">{details.lightTypes}</p>
                  </div>
                )}
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.laserShow ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Laser Show Included</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.dmxLighting ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>DMX Lighting Available</span>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Sound Setup',
          key: 'moreInfo',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.djIncluded ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>DJ Included</span>
                </div>
                {details.micCount && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Number of Microphones</h4>
                    <p className="text-gray-900">{details.micCount}</p>
                  </div>
                )}
                {details.soundPower && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Total Sound Output</h4>
                    <p className="text-gray-900">{details.soundPower} Watts</p>
                  </div>
                )}
              </div>
            </div>
          )
        },
        {
          title: 'Policies',
          key: 'policies',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.nightServiceAvailable ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Available for Night Events</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.generatorIncluded ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Generator Included</span>
                </div>
              </div>
            </div>
          )
        }
      ];
      break;

    case 'party hall':
      categorySections = [
        {
          title: 'Basic Information',
          key: 'features',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.hotelName && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Hotel Name</h4>
                    <p className="text-gray-900">{details.hotelName}</p>
                  </div>
                )}
                {details.ratings && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Ratings</h4>
                    <p className="text-gray-900">{details.ratings}/5</p>
                  </div>
                )}
                {details.location && (
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500">Location</h4>
                    <p className="text-gray-900">{details.location}</p>
                  </div>
                )}
              </div>
            </div>
          )
        },
        {
          title: 'Pricing',
          key: 'moreInfo',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.vegPrice && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Veg Price Starting</h4>
                    <p className="text-gray-900">{details.vegPrice}</p>
                  </div>
                )}
                {details.nonVegPrice && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Non-Veg Price Starting</h4>
                    <p className="text-gray-900">{details.nonVegPrice}</p>
                  </div>
                )}
                {details.halfDayRent && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Half Day Rent</h4>
                    <p className="text-gray-900">{details.halfDayRent}</p>
                  </div>
                )}
                {details.fullDayRent && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Full Day Rent</h4>
                    <p className="text-gray-900">{details.fullDayRent}</p>
                  </div>
                )}
              </div>
            </div>
          )
        },
        {
          title: 'Room & Capacity Info',
          key: 'capacity',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.spaceCapacity && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Space Capacity</h4>
                    <p className="text-gray-900">{details.spaceCapacity} people</p>
                  </div>
                )}
                {details.numberOfRooms && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Number of Rooms</h4>
                    <p className="text-gray-900">{details.numberOfRooms}</p>
                  </div>
                )}
                {details.parkingCapacity && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Parking Capacity</h4>
                    <p className="text-gray-900">{details.parkingCapacity} cars</p>
                  </div>
                )}
              </div>
            </div>
          )
        },
        {
          title: 'Facilities',
          key: 'facilities',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.djAvailable ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>DJ Available</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.alcoholServed ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Alcohol Served</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.acAvailable ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>AC Available</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.nonAcAvailable ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Non-AC Available</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.outdoorLiquorPermitted ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Outdoor Liquor Permitted</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.wifi ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>WiFi Available</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.smokingAllowed ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Smoking Allowed</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.decorationAvailable ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Decoration Available</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.parkingArea ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Parking Area Available</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${details.cateringAvailable ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Catering Available</span>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Services & Policies',
          key: 'policies',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.basicDecorationStartFrom && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Basic Decoration Start From</h4>
                    <p className="text-gray-900">{details.basicDecorationStartFrom}</p>
                  </div>
                )}
                {details.decorationPolicy && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Decoration Policy</h4>
                    <p className="text-gray-900">{details.decorationPolicy}</p>
                  </div>
                )}
                {details.djDescription && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">DJ Starting Price</h4>
                    <p className="text-gray-900">{details.djDescription}</p>
                  </div>
                )}
                {details.cateringPolicy && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Catering Policy</h4>
                    <p className="text-gray-900">{details.cateringPolicy}</p>
                  </div>
                )}
                {details.bookingPolicy && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Booking Policy</h4>
                    <p className="text-gray-900">{details.bookingPolicy}</p>
                  </div>
                )}
                {details.cancellationPolicy && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Cancellation Policy</h4>
                    <p className="text-gray-900">{details.cancellationPolicy}</p>
                  </div>
                )}
              </div>
            </div>
          )
        }
      ];
      break;

    default:
      categorySections = [];
  }

  // Collect all FAQs (from both details and service.faqs)
  const allFaqs = [];

  // Add admin FAQs from details object (support up to 9 FAQs)
  for (let i = 1; i <= 9; i++) {
    const faqKey = `faq${i}`;
    if (details[faqKey]) {
      const [question, answer] = details[faqKey].includes('?') ? 
        details[faqKey].split('?') : 
        [details[faqKey], ''];
      allFaqs.push({
        question: question.endsWith('?') ? question : question + '?',
        answer: answer || 'Not specified'
      });
    }
  }

  // Add vendor FAQs from service.faqs array
  if (currentService.faqs && currentService.faqs.length > 0) {
    currentService.faqs.forEach(faq => {
      allFaqs.push({
        question: faq.question.endsWith('?') ? faq.question : faq.question + '?',
        answer: faq.answer || 'Not specified'
      });
    });
  }

  // FAQ section for all categories
  const faqSection = {
    title: 'FAQs',
    key: 'faqs',
    content: (
      <div className="space-y-4">
        {allFaqs.length > 0 ? (
          allFaqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
              <h4 className="text-sm font-medium text-gray-500">{faq.question}</h4>
              <p className="text-gray-900 mt-1">{faq.answer}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No FAQs available</p>
        )}
      </div>
    )
  };

  // Combine all sections
  const allSections = [...categorySections, faqSection];

  return allSections.map((section, index) => (
    <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
      <button
        onClick={() => toggleSection(section.key)}
        className="w-full flex justify-between items-center text-left"
      >
        <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
        {expandedSections[section.key] ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {expandedSections[section.key] && (
        <div className="mt-4">
          {section.content}
        </div>
      )}
    </div>
  ));
};

  if (loadingServices) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (errorServices) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>{errorServices}</p>
          <button
            onClick={() => navigate('/services')}
            className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  if (!currentService) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p>Service not found</p>
          <button
            onClick={() => navigate('/services')}
            className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  // Static reviews (can be replaced with dynamic data later)
  const reviews = [
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 5,
      date: '2024-01-15',
      comment: 'Absolutely stunning service! The staff was incredibly helpful and everything was perfect!',
      helpful: 12
    },
    {
      id: 2,
      name: 'Arjun Patel',
      rating: 4,
      date: '2024-01-10',
      comment: 'Great service with excellent quality. Would definitely recommend!',
      helpful: 8
    }
  ];

  // Features based on tags
  // const features = [
  //   { icon: Utensils, name: 'Catering', color: 'text-orange-500' },
  //   { icon: Music, name: 'Entertainment', color: 'text-purple-500' },
  //   { icon: Home, name: 'Venue', color: 'text-indigo-500' },
  //   { icon: Wifi, name: 'WiFi', color: 'text-blue-500' },
  //   { icon: Car, name: 'Parking', color: 'text-green-500' },
  //   { icon: Camera, name: 'Photography', color: 'text-pink-500' }
  // ].filter(feature =>
  //     currentService?.tags?.some(tag =>
  //       tag.toLowerCase().includes(feature.name.toLowerCase())
  //     ).slice(0, 6));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/ServicesPage')}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Services</span>
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-all duration-300 ${isFavorite ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'}`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-500 transition-all duration-300">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="h-96 overflow-hidden">
          {currentService?.images?.length > 0 ? (
            <>
              <img
                src={currentService?.images[currentImageIndex]}
                alt={currentService?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {/* Image Navigation */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-300 shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-300 shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {currentService?.images.length}
              </div>

              {/* View Gallery Button */}
              <button
                onClick={() => setIsGalleryOpen(true)}
                className="absolute bottom-4 left-4 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg transition-all duration-300 shadow-lg"
              >
                <Camera className="w-4 h-4 inline mr-2" />
                View Gallery
              </button>
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No images available</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentService?.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                    <span>{currentService?.location}</span>
                  </div>

                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-purple-500" />
                      <span className="text-sm text-gray-600">Vendor: {currentService?.vendor?.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Home className="w-5 h-5 mr-2 text-green-500" />
                      <span className="text-sm text-gray-600">{currentService?.category.title}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 mr-1 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">4.8</span>
                      <span className="text-sm text-gray-600 ml-1">(156 reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center mb-0">
                    <p className='text-lg'>Desciption - <span className='text-md text-gray-600'>{currentService?.description}</span> </p>
                  </div>
                </div>

                <div className="text-right">
                  {currentService?.offer ? (
                    <div className="space-y-1">
                      <div className="text-sm line-through text-gray-400">
                        {formatPrice(parseInt(currentService?.minPrice))} - {formatPrice(parseInt(currentService?.maxPrice))}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatPrice(currentService?.offer.discountedPrice)} - {formatPrice(
                          typeof currentService?.maxPrice === 'string'
                            ? parseInt(currentService?.maxPrice) - (parseInt(currentService?.maxPrice) * currentService?.offer.discountPercentage / 100)
                            : currentService?.maxPrice - (currentService?.maxPrice * currentService?.offer.discountPercentage / 100)
                        )}
                      </div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full inline-block">
                        {currentService?.offer.discountPercentage}% OFF
                      </div>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(parseInt(currentService?.minPrice))} - {formatPrice(parseInt(currentService?.maxPrice))}
                    </div>
                  )}
                  {currentService?.pricePerPlate && (
                    <div className="text-sm text-gray-600">per plate: {formatPrice(parseInt(currentService?.pricePerPlate))}</div>
                  )}
                </div>
              </div>

              {/* Offer Banner */}
              {currentService?.offer && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {currentService?.offer.discountPercentage}% OFF
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Special Offer</h4>
                    <p className="text-sm text-gray-600">
                      Valid until {new Date(currentService?.offer.validTill).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Category Specific Details */}
            {renderCategorySpecificDetails()}

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h2>
                <div className="flex items-center space-x-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <span className="text-xl font-bold text-gray-900">4.8</span>
                  <span className="text-gray-600">(156 reviews)</span>
                </div>
              </div>

              {/* Existing Reviews */}
              <div className="space-y-6 mb-8">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {review.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{review.name}</h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                        <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          <span>Helpful ({review.helpful})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Write Review */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setRating(i + 1)}
                          className={`w-8 h-8 ${i < rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                        >
                          <Star className="w-full h-full fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={4}
                    />
                  </div>
                  <button
                    onClick={submitReview}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Review</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="text-center mb-6">
                {currentService?.offer ? (
                  <div className="space-y-2">
                    <div className="text-sm line-through text-gray-400">
                      {formatPrice(parseInt(currentService?.minPrice))} - {formatPrice(parseInt(currentService?.maxPrice))}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(currentService?.offer.discountedPrice)} - {formatPrice(
                        typeof currentService?.maxPrice === 'string'
                          ? parseInt(currentService?.maxPrice) - (parseInt(currentService?.maxPrice) * currentService?.offer.discountPercentage / 100)
                          : currentService?.maxPrice - (currentService?.maxPrice * currentService?.offer.discountPercentage / 100)
                      )}
                    </div>
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full inline-block">
                      {currentService?.offer.discountPercentage}% OFF
                    </div>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-gray-900">
                    {formatPrice(parseInt(currentService?.minPrice))} - {formatPrice(parseInt(currentService?.maxPrice))}
                  </div>
                )}
                <div className="text-sm text-gray-600">Starting price</div>
              </div>

              <button
                onClick={() => setShowBookingForm(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                <Calendar className="w-5 h-5 inline mr-2" />
                Book Now
              </button>

              {/* Offer Details */}
              {currentService?.offer && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-bold">
                      {currentService?.offer.discountPercentage}% OFF
                    </div>
                    <span className="text-sm text-gray-700">
                      Valid until {new Date(currentService?.offer.validTill).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-3">
                {currentService?.pricePerPlate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Per plate cost</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(parseInt(currentService?.pricePerPlate))}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold text-gray-900">{currentService?.category.title}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Sub-category</span>
                  <span className="font-semibold text-gray-900">{currentService?.subCategory}</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium text-gray-900">{currentService?.phone}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium text-gray-900">{currentService?.vendor?.email || 'Not provided'}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-purple-500" />
                  <div>
                    <div className="text-sm text-gray-600">Vendor</div>
                    <div className="font-medium text-gray-900">{currentService?.vendor?.name}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="font-medium text-gray-900">{currentService?.location}</div>
                  </div>
                </div>
              </div>

              {/* View Vendor Details Button */}
              <div className="mt-6">
                <button
                  onClick={() => navigate(`/vendor/${currentService?.vendor?._id}`)}
                  className="w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View Vendor Details
                </button>
              </div>
            </div>

            {/* Website */}
            {currentService?.website && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Website</h3>
                <a
                  href={currentService?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {currentService?.website}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {isGalleryOpen && currentService?.images?.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="max-w-4xl w-full">
            <img
              src={currentService?.images[currentImageIndex]}
              alt={currentService?.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={prevImage}
                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="text-white">
                {currentImageIndex + 1} / {currentService?.images.length}
              </div>

              <button
                onClick={nextImage}
                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-8 gap-2 mt-4">
              {currentService?.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden ${index === currentImageIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-80'}`}
                >
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Book Service</h3>
              <button
                onClick={() => setShowBookingForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                <input
                  type="number"
                  placeholder="Enter guest count"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
                <textarea
                  placeholder="Any special requirements or notes..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold">
                Submit Booking Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;