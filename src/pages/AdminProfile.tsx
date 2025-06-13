import { useState } from "react";
import { 
  Home,
  Users,
  User,
  Clock,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
  Eye,
  Shield,
  Calendar
} from "lucide-react";
import Navbar from "@/components/Navbar";

const AdminProfile = () => {
  const adminData = {
    name: "Admin User",
    email: "admin@eventwala.com",
    role: "admin",
    profilePhoto: "default.jpg",
    description: "System administrator managing the EventWala platform and vendor approvals.",
    createdAt: "2023-01-01T00:00:00.000Z"
  };

  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Admin Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-red-400 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                <Shield className="w-16 h-16" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{adminData.name}</h1>
              <p className="text-gray-600 mb-4">{adminData.email}</p>
              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
                System Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Admin Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex flex-wrap border-b">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'vendors', label: 'Vendor Management', icon: Users },
              { id: 'users', label: 'User Management', icon: User },
              { id: 'approvals', label: 'Pending Approvals', icon: Clock }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-purple-600 text-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-blue-600">1,234</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Active Vendors</p>
                    <p className="text-2xl font-bold text-green-600">456</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-green-400" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Pending Approvals</p>
                    <p className="text-2xl font-bold text-orange-600">23</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-400" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Bookings</p>
                    <p className="text-2xl font-bold text-purple-600">5,678</p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent System Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <UserCheck className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-medium">Approved vendor: "Royal Caterers"</p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="font-medium">New user registration: "John Doe"</p>
                    <p className="text-sm text-gray-600">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <UserX className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="font-medium">Rejected vendor application: "Quick Events"</p>
                    <p className="text-sm text-gray-600">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Approvals Tab */}
        {activeTab === 'approvals' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Pending Vendor Approvals</h2>
            <div className="space-y-4">
              {[
                { name: "Elite Photography", category: "Photography", applied: "2 days ago" },
                { name: "Dream Decorators", category: "Decoration", applied: "3 days ago" },
                { name: "Sound Systems Pro", category: "Sound & Lights", applied: "1 week ago" }
              ].map((vendor, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">{vendor.name}</h3>
                    <p className="text-sm text-gray-600">{vendor.category} • Applied {vendor.applied}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </button>
                    <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs would show similar content structures */}
        {activeTab === 'vendors' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Vendor Management</h2>
            <p className="text-gray-600">Vendor management interface would be displayed here...</p>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">User Management</h2>
            <p className="text-gray-600">User management interface would be displayed here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;