
import EventCard from './EventCard';

const FeaturedEvents = () => {
  const featuredEvents = [
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
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Events
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these popular events happening near you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
