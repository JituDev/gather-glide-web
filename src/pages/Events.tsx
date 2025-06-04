
import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import Header from '../components/Header';
import EventCard from '../components/EventCard';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const events = [
    {
      id: '1',
      title: 'Tech Conference 2024: Future of AI',
      date: 'March 15, 2024 • 9:00 AM',
      location: 'San Francisco, CA',
      attendees: 1250,
      price: '$99',
      category: 'Technology',
      image: 'photo-1540575467063-178a50c2df87'
    },
    {
      id: '2',
      title: 'Summer Music Festival',
      date: 'June 20-22, 2024',
      location: 'Austin, TX',
      attendees: 5000,
      price: '$149',
      category: 'Music',
      image: 'photo-1493225457124-a3eb161ffa5f'
    },
    {
      id: '3',
      title: 'Business Leadership Workshop',
      date: 'April 8, 2024 • 2:00 PM',
      location: 'New York, NY',
      attendees: 200,
      price: '$79',
      category: 'Business',
      image: 'photo-1559136555-9303baea8ebd'
    },
    {
      id: '4',
      title: 'Food & Wine Festival',
      date: 'May 12, 2024 • 6:00 PM',
      location: 'Napa Valley, CA',
      attendees: 800,
      price: '$125',
      category: 'Food',
      image: 'photo-1414235077428-338989a2e8c0'
    },
    {
      id: '5',
      title: 'Art Gallery Opening',
      date: 'March 28, 2024 • 7:00 PM',
      location: 'Los Angeles, CA',
      attendees: 150,
      price: 'Free',
      category: 'Art',
      image: 'photo-1541961017774-22349e4a1262'
    },
    {
      id: '6',
      title: 'Marathon Training Camp',
      date: 'April 15, 2024 • 6:00 AM',
      location: 'Boston, MA',
      attendees: 300,
      price: '$45',
      category: 'Sports',
      image: 'photo-1552674605-db6ffd4facb5'
    }
  ];

  const categories = ['All', 'Technology', 'Music', 'Business', 'Food', 'Art', 'Sports'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">All Events</h1>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
