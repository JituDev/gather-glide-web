
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Share2, Heart } from 'lucide-react';
import Header from '../components/Header';

const EventDetail = () => {
  const { id } = useParams();

  // Mock event data - in a real app, this would be fetched based on the ID
  const event = {
    id: '1',
    title: 'Tech Conference 2024: Future of AI',
    date: 'March 15, 2024',
    time: '9:00 AM - 6:00 PM',
    location: 'Moscone Center, San Francisco, CA',
    attendees: 1250,
    price: '$99',
    category: 'Technology',
    image: 'photo-1540575467063-178a50c2df87',
    description: 'Join us for the most anticipated technology conference of 2024! Explore the latest breakthroughs in artificial intelligence, machine learning, and emerging technologies that are shaping our future.',
    highlights: [
      'Keynote speakers from leading tech companies',
      'Interactive workshops and hands-on sessions',
      'Networking opportunities with industry experts',
      'Exhibition showcase of cutting-edge technologies',
      'Panel discussions on AI ethics and future trends'
    ],
    organizer: {
      name: 'TechEvents Inc.',
      avatar: 'photo-1472099645785-5658abf4ff4e'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/events" className="text-blue-600 hover:text-blue-700">
            ← Back to Events
          </Link>
        </div>

        {/* Event Image */}
        <div className="relative mb-8 rounded-xl overflow-hidden">
          <img 
            src={`https://images.unsplash.com/${event.image}?w=800&h=400&fit=crop`}
            alt={event.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute top-6 left-6">
            <span className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium">
              {event.category}
            </span>
          </div>
          <div className="absolute top-6 right-6 flex gap-3">
            <button className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {event.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-6 bg-white rounded-xl border">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">{event.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">{event.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">{event.location}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">{event.attendees} attending</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {event.description}
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Highlights</h3>
              <ul className="space-y-2">
                {event.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Organizer */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Organized by</h3>
              <div className="flex items-center gap-4">
                <img 
                  src={`https://images.unsplash.com/${event.organizer.avatar}?w=64&h=64&fit=crop&crop=face`}
                  alt={event.organizer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-gray-900">{event.organizer.name}</div>
                  <div className="text-gray-600 text-sm">Event Organizer</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">{event.price}</div>
                <div className="text-gray-600">per ticket</div>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4">
                Get Tickets
              </button>
              
              <div className="text-center text-sm text-gray-500">
                Free cancellation up to 24 hours before the event
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
