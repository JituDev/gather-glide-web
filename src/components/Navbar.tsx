import { Calendar, Gift, HelpCircle, Home, User } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from '../components/ui/button'


const Navbar = ()=>{
    return(
              <nav className="bg-purple-800 text-white py-4 sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between">
                    <Link to="/" className="font-bold text-2xl flex items-center">
                      <span className="bg-white text-purple-800 px-3 py-1 rounded mr-2">EVENT</span>
                      <span>LOOP</span>
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
    )
}

export default Navbar