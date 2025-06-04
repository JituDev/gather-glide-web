
import { Calendar, Menu, Search, User } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvent } from '../contexts/EventContext';
import { Button } from './ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useEvent();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">EventHub</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              HOME
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              ABOUT
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-blue-600 transition-colors">
              SERVICES
            </Link>
            <Link to="/vendor" className="text-gray-700 hover:text-blue-600 transition-colors">
              VENDOR
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              CONTACT US
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Hello, {user?.name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
            
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                HOME
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
                ABOUT
              </Link>
              <Link to="/services" className="text-gray-700 hover:text-blue-600 transition-colors">
                SERVICES
              </Link>
              <Link to="/vendor" className="text-gray-700 hover:text-blue-600 transition-colors">
                VENDOR
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                CONTACT US
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
