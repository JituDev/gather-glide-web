
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Music, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel';

const Homepage = () => {
  const services = [
    {
      title: 'EVENT MANAGEMENT',
      description: 'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop',
      icon: Calendar
    },
    {
      title: 'LIGHT & SOUND',
      description: 'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      icon: Music
    },
    {
      title: 'CATERING',
      description: 'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=300&fit=crop',
      icon: Users
    },
    {
      title: 'VENUES',
      description: 'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop',
      icon: MapPin
    }
  ];

  const features = [
    {
      title: '7/24 Event available',
      description: 'Lorem ipsum dolor sit amet sed do eiusmod tempor sit amet dolor eiusmod et.',
      icon: Calendar
    },
    {
      title: 'Great Locations',
      description: 'Lorem ipsum dolor sit amet sed do eiusmod tempor sit amet dolor eiusmod et.',
      icon: MapPin
    },
    {
      title: 'Lets Party After Event',
      description: 'Lorem ipsum dolor sit amet sed do eiusmod tempor sit amet dolor eiusmod et.',
      icon: Music
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="font-bold text-xl">EVENT WALA</Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/" className="hover:text-gray-300">HOME</Link>
                <Link to="/about" className="hover:text-gray-300">ABOUT</Link>
                <Link to="/services" className="hover:text-gray-300">SERVICES</Link>
                <Link to="/vendor" className="hover:text-gray-300">VENDOR</Link>
                <Link to="/contact" className="hover:text-gray-300">CONTACT US</Link>
              </div>
            </div>
            <Link to="/login">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-teal-800">
                GET STARTED
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div 
        className="relative h-screen bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920&h=1080&fit=crop')`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">We are Event Provider</h1>
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex items-center bg-white rounded-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Find Experience"
                  className="flex-1 px-6 py-4 text-gray-900 outline-none"
                />
                <select className="px-4 py-4 text-gray-900 border-l">
                  <option>All Categories</option>
                  <option>Wedding</option>
                  <option>Corporate</option>
                  <option>Birthday</option>
                </select>
                <Button className="bg-teal-600 hover:bg-teal-700 px-8 py-4 rounded-none">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">HIGHLIGHTS</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <Button variant="outline" className="w-full">
                    Learn more
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">AMENITIES</h2>
            <p className="max-w-4xl mx-auto text-gray-600 leading-relaxed">
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer 
              took a galley of type and scrambled it to make a type specimen book. It has survived not only five 
              centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised 
              in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with 
              desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
          </div>

          {/* Image Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                <CarouselItem>
                  <div className="grid grid-cols-2 gap-4 h-96">
                    <img
                      src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop"
                      alt="Event 1"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop"
                      alt="Event 2"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="grid grid-cols-2 gap-4 h-96">
                    <img
                      src="https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=400&fit=crop"
                      alt="Event 3"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop"
                      alt="Event 4"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-8">
                <CardContent>
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-96 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&h=600&fit=crop"
              alt="Event Video"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <Button 
                size="lg" 
                className="w-20 h-20 rounded-full bg-white text-teal-600 hover:bg-gray-100"
              >
                <div className="w-0 h-0 border-l-8 border-l-teal-600 border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5" />
                  <span>GLS Tower, DE-139, Nr by Tank, No 7, Street Number 336, Newtown, Kolkata, West Bengal 700156</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span>📞</span>
                  <span>+91 8335972999</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span>✉️</span>
                  <span>sales@glsrealty.in</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span>🌐</span>
                  <span>sales@glsrealty.com</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">KEEP IN TOUCH</h3>
              <p className="text-sm mb-4">Subscribe to Our Newsletter to get Important News & Offers</p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 rounded text-gray-900"
                />
                <Button variant="secondary">Subscribe</Button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-teal-700 text-center">
            <p>&copy; 2024 EVENT CONSULTANCY SERVICES. All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
