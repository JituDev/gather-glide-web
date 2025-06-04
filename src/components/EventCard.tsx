
import { Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  price: string;
  category: string;
  image: string;
}

const EventCard = ({ id, title, date, location, attendees, price, category, image }: EventCardProps) => {
  return (
    <Link 
      to={`/events/${id}`}
      className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      <div className="relative overflow-hidden">
        <img 
          src={`https://images.unsplash.com/${image}?w=400&h=200&fit=crop`}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {category}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
            {price}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          {title}
        </h3>
        
        <div className="space-y-2 text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">{attendees} attending</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
