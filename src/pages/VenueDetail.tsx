
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEvent } from '../contexts/EventContext';
import { ArrowLeft, MapPin, Star, Phone, Mail, Globe, Facebook, Twitter, Youtube, Linkedin, Instagram } from 'lucide-react';
import Header from '../components/Header';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const VenueDetail = () => {
  const { id } = useParams();
  const { venues } = useEvent();
  const venue = venues.find(v => v.id === id);

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Venue not found</h1>
            <Link to="/venues" className="text-blue-600 hover:text-blue-700">
              Back to venues
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/venues" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Venues
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="relative h-96 rounded-xl overflow-hidden">
              <img
                src={venue.image}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  4.5 ★
                </span>
              </div>
            </div>

            {/* Venue Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{venue.name}</h1>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Send Message
                  </Button>
                </div>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{venue.location}</span>
                </div>

                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < venue.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">(No Reviews)</span>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {venue.description}
                </p>
              </CardContent>
            </Card>

            {/* About Company */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About Company</h2>
                <p className="text-gray-700 leading-relaxed">
                  The Partywaala is a Hyderabad-based complete event management firm. They are 
                  a group of heartfelt experts who specialise in bringing your event from concept to 
                  reality. They collaborate with providers to provide unforgettable experiences in 
                  both large and local venues. They name themselves The Partywaala and believe 
                  in reducing the complications of event planning and providing you with end-to-
                  end services. They work behind the scenes to create that environment for you 
                  because they know it's your time to celebrate, to be cheerful, and to avoid the 
                  inconveniences that come with it.
                </p>
              </CardContent>
            </Card>

            {/* Photo Gallery */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">PHOTOS / GALLERY</h2>
                <div className="grid grid-cols-3 gap-4">
                  {venue.images.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                  {/* Additional dummy images */}
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={`extra-${i}`} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=400&h=400&fit=crop`}
                        alt={`Gallery ${i}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = venue.image;
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Rate</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Reviews</h3>
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">{rating}</span>
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${rating * 20}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Rate Vendor</h3>
                    <div className="space-y-4">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-6 h-6 text-gray-300 hover:text-yellow-400 cursor-pointer" />
                        ))}
                      </div>
                      <textarea
                        placeholder="Tell Us About Your Experience"
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                        rows={4}
                      ></textarea>
                      <Button className="w-full">Submit Review</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Form */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">SEND YOUR MESSAGE</h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <textarea
                    placeholder="Message"
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  ></textarea>
                  <Button className="w-full bg-teal-800 hover:bg-teal-900">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* WhatsApp Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">ENABLE WHATSAPP BUTTON ON YOUR PROFILE</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Share your profile with your friends and followers on facebook. Share your profile with your friends and followers on facebook.
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Share On Facebook
                </Button>
              </CardContent>
            </Card>

            {/* Social Share */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Share your profile</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Share your profile with your friends and followers on facebook.
                </p>
                <Button className="w-full bg-teal-800 hover:bg-teal-900">
                  Share On Facebook
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Contact Info */}
        <Card className="mt-12">
          <CardContent className="p-8 bg-teal-800 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5" />
                    <span>GLS Tower, DE-139, Nr by Tank, No 7, Street Number 336, Newtown, Kolkata, West Bengal 700156</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5" />
                    <span>+91 8335972999</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5" />
                    <span>sales@glsrealty.in</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5" />
                    <span>sales@glsrealty.com</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">KEEP IN TOUCH</h3>
                <p className="text-sm mb-4">Subscribe to Our Newsletter to get Important News & Offers</p>
                <div className="flex space-x-2 mb-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 rounded text-gray-900"
                  />
                  <Button variant="secondary">Subscribe</Button>
                </div>
                <div className="flex space-x-3">
                  <Facebook className="w-6 h-6 cursor-pointer hover:text-blue-400" />
                  <Twitter className="w-6 h-6 cursor-pointer hover:text-blue-400" />
                  <Youtube className="w-6 h-6 cursor-pointer hover:text-red-400" />
                  <Linkedin className="w-6 h-6 cursor-pointer hover:text-blue-400" />
                  <Instagram className="w-6 h-6 cursor-pointer hover:text-pink-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VenueDetail;
