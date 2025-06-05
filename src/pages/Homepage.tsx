import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Music, MapPin, Home, Gift, User, HelpCircle, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel';


const Homepage = () => {
  // State for service card image animation
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % 3); // Assuming 3 images per service
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      title: 'TENT',
      description: 'Premium quality tents for all occasions - weddings, corporate events, and parties. Our tents come with weather-resistant materials, elegant designs, and customizable sizes to fit any venue requirements.',
      images: [
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&h=600&fit=crop'
      ],
      icon: Calendar
    },
    {
      title: 'LIGHT & SOUND',
      description: 'Professional audio-visual solutions with state-of-the-art equipment. Our sound systems and lighting setups will elevate your event with crystal clear audio and stunning visual effects tailored to your theme.',
      images: [
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop'
      ],
      icon: Music
    },
    {
      title: 'CATERING',
      description: 'Gourmet catering services with diverse menu options from international cuisines to local favorites. Our professional chefs create delicious, beautifully presented dishes that will impress your guests.',
      images: [
        'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'
      ],
      icon: Users
    },
    {
      title: 'PARTY HALL',
      description: 'Elegant and spacious venues equipped with modern amenities. Our party halls offer versatile spaces that can be customized for weddings, receptions, corporate events, and social gatherings.',
      images: [
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&h=600&fit=crop'
      ],
      icon: MapPin
    },
    {
      title: 'PHOTOGRAPHY',
      description: 'Professional photography and videography services to capture your special moments. Our team uses high-end equipment and creative techniques to deliver stunning visual memories of your event.',
      images: [
        'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800&h=600&fit=crop'
      ],
      icon: MapPin
    }
  ];

  const features = [
    {
      title: '24/7 Event Support',
      description: 'Our team is available round the clock to ensure your event runs smoothly without any hiccups.',
      icon: Calendar
    },
    {
      title: 'Premium Locations',
      description: 'Access to the most sought-after venues in the city with excellent amenities and accessibility.',
      icon: MapPin
    },
    {
      title: 'After Party Services',
      description: 'Extend the celebration with our specialized after-party arrangements and entertainment options.',
      icon: Music
    }
  ];

  const testimonials = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      alt: 'Client 1'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop',
      alt: 'Client 2'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
      alt: 'Client 3'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop',
      alt: 'Client 4'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop',
      alt: 'Client 5'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-purple-800 text-white py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="font-bold text-2xl flex items-center">
              <span className="bg-white text-purple-800 px-3 py-1 rounded mr-2">EVENT</span>
              <span>WALA</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8 mx-auto">
              <Link to="/" className="hover:text-purple-200 transition-colors flex items-center">
                <Home className="w-4 h-4 mr-1" /> HOME
              </Link>
              <Link to="/bookings" className="hover:text-purple-200 transition-colors flex items-center">
                <Calendar className="w-4 h-4 mr-1" /> BOOKINGS
              </Link>
              <Link to="/offer" className="hover:text-purple-200 transition-colors flex items-center">
                <Gift className="w-4 h-4 mr-1" /> OFFER
              </Link>
              <Link to="/vendor" className="hover:text-purple-200 transition-colors flex items-center">
                <User className="w-4 h-4 mr-1" /> VENDOR
              </Link>
              <Link to="/help" className="hover:text-purple-200 transition-colors flex items-center">
                <HelpCircle className="w-4 h-4 mr-1" /> HELP
              </Link>
            </div>
            
            <Link to="/login">
              <Button className="bg-white text-purple-800 hover:bg-purple-100 px-6 py-2 rounded-full font-medium shadow-md transition-all hover:scale-105">
                GET STARTED
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">We Create Unforgettable Events</h1>
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex flex-col md:flex-row items-center bg-white bg-opacity-90 rounded-lg overflow-hidden shadow-xl">
                <input
                  type="text"
                  placeholder="Find Your Perfect Event Experience"
                  className="flex-1 px-6 py-4 text-gray-900 outline-none text-lg"
                />
                <select className="px-4 py-4 text-gray-900 border-l border-gray-200 bg-gray-50">
                  <option>All Categories</option>
                  <option>Wedding</option>
                  <option>Corporate</option>
                  <option>Birthday</option>
                </select>
                <Button className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-none text-lg font-semibold transition-all duration-300 hover:shadow-lg">
                  Search
                </Button>
              </div>
            </div>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto animate-fade-in-delay">
              From intimate gatherings to grand celebrations, we bring your vision to life
            </p>
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">OUR SERVICES</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Premium event services tailored to make your occasion truly special
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="h-48 overflow-hidden relative">
                  {service.images.map((img, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={img}
                      alt={service.title}
                      className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${imgIndex === currentImageIndex % service.images.length ? 'opacity-100' : 'opacity-0'}`}
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <service.icon className="w-10 h-10 text-white" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-colors">
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
            <h2 className="text-4xl font-bold text-gray-900 mb-8">EVENT AMENITIES</h2>
            <p className="max-w-4xl mx-auto text-gray-600 leading-relaxed text-lg">
              We provide comprehensive event solutions with attention to every detail. Our team of experienced professionals ensures seamless execution from planning to completion, delivering exceptional quality and service that exceeds expectations for any type of event.
            </p>
          </div>

          {/* Enhanced Carousel */}
          <div className="relative max-w-6xl mx-auto mb-16">
            <Carousel 
              className="w-full"
              // plugins={[Autoplay({ delay: 5000 })]}
              opts={{
                align: "center",
                loop: true,
              }}
            >
              <CarouselContent className="-ml-4">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={testimonial.id} className="pl-4 basis-1/3 lg:basis-1/5">
                    <div className="relative group">
                      <div className={`overflow-hidden rounded-xl transition-all duration-500 ${index === 2 ? 'h-64 scale-110 shadow-xl z-10' : 'h-56 scale-90 opacity-90'}`}>
                        <img
                          src={testimonial.image}
                          alt={testimonial.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                          <h3 className="text-white font-medium">Client {testimonial.id}</h3>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-white/80 hover:bg-white text-purple-800 border-none shadow-lg" />
              <CarouselNext className="right-2 bg-white/80 hover:bg-white text-purple-800 border-none shadow-lg" />
            </Carousel>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow duration-300 hover:border-purple-500">
                <CardContent>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-purple-600 group-hover:text-white">
                    <feature.icon className="w-8 h-8 text-purple-600 transition-all duration-300 group-hover:text-white" />
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <video 
              autoPlay 
              loop 
              muted 
              className="w-full h-auto"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-dancing-under-lights-4642-large.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <Button 
                size="lg" 
                className="w-20 h-20 rounded-full bg-white text-purple-600 hover:bg-purple-100 transition-all hover:scale-110 shadow-xl"
              >
                <div className="w-0 h-0 border-l-[12px] border-l-purple-600 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <span className="bg-white text-purple-900 px-2 py-1 rounded mr-2">EVENT</span>
                <span>WALA</span>
              </h3>
              <p className="text-purple-200 mb-4">
                Creating memorable experiences through exceptional event planning and execution.
              </p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                    <span className="sr-only">{social}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 border-b border-purple-700 pb-2">Quick Links</h4>
              <ul className="space-y-2">
                {['Home', 'Services', 'About Us', 'Gallery', 'Testimonials', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-purple-200 hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 border-b border-purple-700 pb-2">Services</h4>
              <ul className="space-y-2">
                {services.map((service) => (
                  <li key={service.title}>
                    <a href="#" className="text-purple-200 hover:text-white transition-colors">{service.title}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 border-b border-purple-700 pb-2">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mt-1 mr-3 flex-shrink-0" />
                  <span>GLS Tower, DE-139, Nr by Tank, No 7, Street Number 336, Newtown, Kolkata, West Bengal 700156</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3" />
                  <span>+91 8335972999</span>
                </div>
                <div className="flex items-center">
                  <span className="w-5 h-5 mr-3">✉️</span>
                  <span>info@eventwala.com</span>
                </div>
              </div>
              
              <h4 className="text-lg font-semibold mt-6 mb-3">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-l text-gray-900 outline-none"
                />
                <Button className="bg-purple-600 hover:bg-purple-700 rounded-l-none px-4">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-purple-800 text-center text-purple-300">
            <p>&copy; {new Date().getFullYear()} EVENT WALA. All Rights Reserved | Designed with ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;