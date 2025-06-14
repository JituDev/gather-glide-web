
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Venue {
  id: string;
  name: string;
  location: string;
  price: string;
  rating: number;
  image: string;
  category: string;
  type: string;
  images: string[];
  description: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'vendor';
}

interface EventContextType {
  venues: Venue[];
  filteredVenues: Venue[];
  searchTerm: string;
  selectedCategory: string;
  priceRange: string;
  venueType: string;
  user: User | null;
  isLoggedIn: boolean;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setPriceRange: (range: string) => void;
  setVenueType: (type: string) => void;
  login: (email: string, password: string, userType: 'customer' | 'vendor') => void;
  logout: () => void;
  filterVenues: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const dummyVenues: Venue[] = [
  // Wedding Venues
  {
    id: '1',
    name: 'AA CONVENTION & RESORT',
    location: 'FATEHABAD',
    price: 'RS. 30,000 - 45,000',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
    category: 'Wedding Venues',
    type: 'Resort',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=600&fit=crop'
    ],
    description: 'A beautiful wedding venue with elegant decor and modern amenities.'
  },
  {
    id: '2',
    name: 'AA CONVENTION & RESORT',
    location: 'FATEHABAD',
    price: 'RS. 30,000 - 45,000',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
    category: 'Wedding Venues',
    type: 'Banquet Halls',
    images: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop'
    ],
    description: 'Elegant banquet hall perfect for wedding ceremonies and receptions.'
  },
  {
    id: '3',
    name: 'AA CONVENTION & RESORT',
    location: 'FATEHABAD',
    price: 'RS. 30,000 - 45,000',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
    category: 'Wedding Venues',
    type: 'Luxury Properties',
    images: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop'
    ],
    description: 'Beautiful garden venue with outdoor seating and natural ambiance.'
  },
  // Catering
  {
    id: '4',
    name: 'AA CONVENTION & RESORT',
    location: 'FATEHABAD',
    price: 'RS. 30,000 - 45,000',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop',
    category: 'Catering',
    type: 'Premium Properties',
    images: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop'
    ],
    description: 'Professional catering services with diverse menu options.'
  },
  {
    id: '5',
    name: 'AA CONVENTION & RESORT',
    location: 'FATEHABAD',
    price: 'RS. 30,000 - 45,000',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    category: 'Catering',
    type: 'Premium Properties',
    images: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop'
    ],
    description: 'Exquisite catering services for all types of events.'
  },
  // Light & Studio
  {
    id: '6',
    name: 'AA CONVENTION & RESORT',
    location: 'FATEHABAD',
    price: 'RS. 30,000 - 45,000',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    category: 'Light & Studio',
    type: 'Premium Properties',
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop'
    ],
    description: 'Professional lighting and sound equipment for your events.'
  },
  {
    id: '7',
    name: 'AA CONVENTION & RESORT',
    location: 'FATEHABAD',
    price: 'RS. 30,000 - 45,000',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    category: 'Light & Studio',
    type: 'Premium Properties',
    images: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop'
    ],
    description: 'State-of-the-art lighting and studio equipment rental.'
  }
];

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [venues] = useState<Venue[]>(dummyVenues);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>(dummyVenues);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [venueType, setVenueType] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (email: string, password: string, userType: 'customer' | 'vendor') => {
    // Simulate login
    const newUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      type: userType
    };
    setUser(newUser);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const filterVenues = () => {
    let filtered = venues;

    if (searchTerm) {
      filtered = filtered.filter(venue =>
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(venue => venue.category === selectedCategory);
    }

    if (venueType) {
      filtered = filtered.filter(venue => venue.type === venueType);
    }

    setFilteredVenues(filtered);
  };

  React.useEffect(() => {
    filterVenues();
  }, [searchTerm, selectedCategory, priceRange, venueType]);

  const value: EventContextType = {
    venues,
    filteredVenues,
    searchTerm,
    selectedCategory,
    priceRange,
    venueType,
    user,
    isLoggedIn,
    setSearchTerm,
    setSelectedCategory,
    setPriceRange,
    setVenueType,
    login,
    logout,
    filterVenues
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
