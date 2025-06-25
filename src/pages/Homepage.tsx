import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Calendar, Music, Users, MapPin, Camera, ChevronLeft, ChevronRight, Star, Award, Clock, Heart, Home, Gift, User, HelpCircle, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Loader from '@/components/Loader';


const Homepage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);


  const handleLearnMore = (title: string) => {
    // Convert title to URL-friendly format (e.g., "LIGHT & SOUND" -> "light-sound")
    const categoryPath = title.toLowerCase().replace(' & ', '-').replace(' ', '-');
    navigate(`/vendors/${categoryPath}`);
  };
  // State for service card image animation
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageIndices, setCurrentImageIndices] = useState([0, 0, 0, 0, 0]);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading time (replace with actual loading logic)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds for demo, adjust as needed

    return () => clearTimeout(timer);
  }, []);

  


  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const cityName =
            data.address.city || data.address.town || data.address.village || null;
          setCity(cityName);
        },
        (error) => {
          console.error('Location permission denied or error:', error.message);
        }
      );
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % 3); // Assuming 3 images per service
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      title: 'TENT',
      images: [
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&h=600&fit=crop'
      ],
      icon: Calendar
    },
    {
      title: 'LIGHT & SOUND',
      images: [
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop'
      ],
      icon: Music
    },
    {
      title: 'CATERING',
      images: [
        'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'
      ],
      icon: Users
    },
    {
      title: 'PARTY HALL',
      images: [
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&h=600&fit=crop'
      ],
      icon: MapPin
    },
    {
      title: 'PHOTOGRAPHY',
      images: [
        'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800&h=600&fit=crop'
      ],
      icon: Camera
    }
  ];

  const features = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'We use only the finest materials and equipment to ensure your event exceeds expectations with unmatched quality and attention to detail.'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Our dedicated team is available around the clock to assist you with any questions or concerns throughout your event planning journey.'
    },
    {
      icon: Heart,
      title: 'Personalized Service',
      description: 'Every event is unique, and we tailor our services to match your specific vision, style, and requirements for a truly personalized experience.'
    }
  ];

  const testimonials = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=800&fit=crop',
      description: 'Elegant Wedding Reception with Premium Floral Arrangements and Ambient Lighting',
      url: '/gallery/wedding-1'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=800&fit=crop',
      description: 'Colorful Birthday Party Setup with Custom Balloon Decorations and Themed Styling',
      url: '/gallery/birthday-1'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=800&fit=crop',
      description: 'Corporate Event with Professional Stage Setup and State-of-the-Art Audio Visual',
      url: '/gallery/corporate-1'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=800&fit=crop',
      description: 'Outdoor Garden Party with Beautiful Tent Arrangements and Natural Décor',
      url: '/gallery/outdoor-1'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=800&fit=crop',
      description: 'Anniversary Celebration with Romantic Lighting and Luxurious Table Settings',
      url: '/gallery/anniversary-1'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&h=800&fit=crop',
      description: 'Baby Shower Event with Pastel Theme and Creative Backdrop Designs',
      url: '/gallery/baby-shower-1'
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600&h=800&fit=crop',
      description: 'Engagement Party with Premium Catering and Sophisticated Venue Styling',
      url: '/gallery/engagement-1'
    }
  ];


  // Staggered image transitions for service cards
  useEffect(() => {
    const intervals = services.map((_, index) => {
      return setInterval(() => {
        setCurrentImageIndices(prev => {
          const newIndices = [...prev];
          newIndices[index] = (newIndices[index] + 1) % services[index].images.length;
          return newIndices;
        });
      }, 3000 + (index * 800)); // Each card changes at different intervals
    });

    return () => intervals.forEach(interval => clearInterval(interval));
  }, []);

  // Carousel navigation
  const nextSlide = () => {
    setCurrentCarouselIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentCarouselIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Get visible testimonials for 3D effect
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentCarouselIndex + i + testimonials.length) % testimonials.length;
      visible.push({
        ...testimonials[index],
        position: i
      });
    }
    return visible;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-contain"
        >
          <source src="/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">We Create Unforgettable Events
              {/* {city
              ? `Unforgettable Events in ${city}`
              : 'We Create Unforgettable Events'} */}
            </h1>

            {/* Search Input */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex flex-col md:flex-row items-center bg-white bg-opacity-90 rounded-lg overflow-hidden shadow-xl">
                <input
                  type="text"
                  placeholder="Find Your Perfect Event Experience"
                  className="flex-1 px-6 py-4 text-gray-900 outline-none text-lg"
                  value={city}
                />
                <select className="px-4 py-4 text-gray-900 border-l border-gray-200 bg-gray-50">
                  <option>All Categories</option>
                  <option>Wedding</option>
                  <option>Corporate</option>
                  <option>Birthday</option>
                </select>
                <Button className="bg-purple-600 hover:bg-purple-700 px-8 py-4 mx-4 rounded-none text-lg font-semibold transition-all duration-300 hover:shadow-lg">
                  Search
                </Button>
              </div>
            </div>

            {/* Subtext */}
            <p className="text-xl md:text-2xl max-w-3xl mx-auto animate-fade-in-delay">
              From intimate gatherings to grand celebrations, we bring your vision to life
            </p>
          </div>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">OUR SERVICES</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Premium event services tailored to make your occasion truly special and unforgettable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="h-56 overflow-hidden relative">
                    {service.images.map((img, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={img}
                        alt={service.title}
                        className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${imgIndex === currentImageIndices[index] ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                          }`}
                      />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <service.icon className="w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl text-center font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                      {service.title}
                    </h3>
                    {/* <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">
                      {service.description}
                    </p> */}
                    <button
                      onClick={() => handleLearnMore(service.title)}
                      className="w-full bg-gradient-to-r from-sky-400 to-purple-700 text-white py-2.5 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section with 3D Carousel */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">OUR BEST DESIGNS</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6"></div>
            <p className="max-w-4xl mx-auto text-gray-600 leading-relaxed text-lg">
              Discover our stunning event designs and setups that have made countless celebrations unforgettable. Each project showcases our commitment to excellence, creativity, and attention to detail in creating magical moments for our clients.
            </p>
          </div>

          {/* 3D Carousel */}
          <div className="relative max-w-6xl mx-auto mb-16 h-96 overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center perspective-1000 overflow-hidden">

              {getVisibleTestimonials().map((testimonial, index) => {
                const position = testimonial.position;
                let transform = '';
                let zIndex = 0;
                let opacity = 1;
                let scale = 1;

                if (position === 0) {
                  // Center - largest
                  transform = 'translateX(0) translateZ(0)';
                  zIndex = 50;
                  scale = 1.2;
                } else if (position === -1 || position === 1) {
                  // First left/right - medium, slightly behind
                  transform = `translateX(${position * 200}px) translateZ(-100px)`;
                  zIndex = 30;
                  scale = 0.9;
                  opacity = 0.8;
                } else {
                  // Far left/right - smallest, furthest back
                  transform = `translateX(${position * 240}px) translateZ(-200px)`;
                  zIndex = 10;
                  scale = 0.7;
                  opacity = 0.6;
                }

                return (
                  <div
                    key={testimonial.id}
                    className="absolute transition-all duration-700 ease-out cursor-pointer"
                    style={{
                      transform: `${transform} scale(${scale})`,
                      zIndex,
                      opacity
                    }}
                    onClick={() => window.open(testimonial.url, '_blank')}
                  >
                    <div className="w-64 h-80 bg-white rounded-2xl shadow-2xl overflow-hidden group hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
                      <div className="relative h-full">
                        <img
                          src={testimonial.image}
                          alt="Event Design"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                            <p className="text-white text-xs font-medium leading-relaxed">
                              {testimonial.description}
                            </p>
                          </div>
                        </div>
                        <div className="absolute bottom-4 right-4">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-purple-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-60 backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-purple-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-60 backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 hover:border-purple-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-blue-600 group-hover:to-purple-800 transition-all duration-500 transform group-hover:scale-110">
                    <feature.icon className="w-10 h-10 text-purple-600 group-hover:text-white transition-all duration-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
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
              <source src="https://videos.pexels.com/video-files/2361938/2361938-uhd_2560_1440_30fps.mp4" type="video/mp4" />
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
                <span>LOOP</span>
              </h3>
              <p className="text-purple-200 mb-4">
                Creating memorable experiences through exceptional event planning and execution.
              </p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-purple-800 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                    <span className="sr-only text-white">{social}</span>
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
                  <span>info@eventloop.com</span>
                </div>
              </div>

              {/* <h4 className="text-lg font-semibold mt-6 mb-3">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-l text-gray-900 outline-none"
                />
                <Button className="bg-purple-600 hover:bg-purple-700 rounded-l-none px-4">
                  Subscribe
                </Button>
              </div> */}
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