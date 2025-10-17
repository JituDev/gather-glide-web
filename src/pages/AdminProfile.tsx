import { useState, useEffect } from "react";
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
  Calendar,
  Tag,
  PlusCircle,
  List
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAdmin } from "@/contexts/AdminContext";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

const AdminProfile = () => {
  const {
    vendors,
    loadingVendors,
    getVendors,
    approveVendor,
    categories,
    loadingCategories,
    getCategories,
    createCategory,
    offers,
    loadingOffers,
    getOffers,
    getOffer,
    currentOffer
  } = useAdmin();
  const {logout} = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newCategory, setNewCategory] = useState({
    title: '',
    subCategories: ''
  });
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.log("error", error)
        }
    }

  useEffect(() => {
    if (activeTab === 'vendors' || activeTab === 'approvals') {
      getVendors();
    }
    if (activeTab === 'categories') {
      getCategories();
    }
    if (activeTab === 'offers') {
      getOffers(1, 10, true);
    }
  }, [activeTab]);

  const handleApproveVendor = async (id: string, approve: boolean) => {
    try {
      await approveVendor(id, approve);
      // The context will automatically update the vendors list
    } catch (error) {
      console.error("Failed to update vendor status:", error);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', newCategory.title);
      formData.append('subCategories', newCategory.subCategories);
      if (categoryImage) {
        formData.append('categoryImage', categoryImage);
      }

      await createCategory(formData);
      setNewCategory({ title: '', subCategories: '' });
      setCategoryImage(null);
      // The context will automatically update the categories list
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleViewOffer = async (id: string) => {
    setSelectedOffer(id);
    await getOffer(id);
  };

  const pendingVendors = vendors?.filter(vendor => vendor.isApproved === false);
  const approvedVendors = vendors?.filter(vendor => vendor.isApproved === true);

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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600 mb-4">Manage platform vendors, offers, and categories</p>
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
              { id: 'approvals', label: 'Pending Approvals', icon: Clock },
              { id: 'logout', label: 'Logout', icon: List },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 transition-colors ${activeTab === tab.id
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
                    <p className="text-gray-600 text-sm">Total Vendors</p>
                    <p className="text-2xl font-bold text-blue-600">{vendors?.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Active Vendors</p>
                    <p className="text-2xl font-bold text-green-600">{approvedVendors?.length}</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Pending Approvals</p>
                    <p className="text-2xl font-bold text-orange-600">{pendingVendors?.length}</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-400" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent System Activity</h2>
              {loadingVendors ? (
                <div className="text-center py-8">Loading activity...</div>
              ) : (
                <div className="space-y-4">
                  {vendors?.slice(0, 3).map(vendor => (
                    <div key={vendor._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      {vendor.isApproved ? (
                        <UserCheck className="w-6 h-6 text-green-500" />
                      ) : (
                        <Clock className="w-6 h-6 text-orange-500" />
                      )}
                      <div>
                        <p className="font-medium">
                          {vendor.isApproved ? 'Approved' : 'Pending'} vendor: "{vendor.name}"
                        </p>
                        <p className="text-sm text-gray-600">{vendor.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pending Approvals Tab */}
        {activeTab === 'approvals' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Pending Vendor Approvals</h2>
            {loadingVendors ? (
              <div className="text-center py-8">Loading vendors?...</div>
            ) : pendingVendors?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No pending vendor approvals</div>
            ) : (
              <div className="space-y-4">
                {pendingVendors?.map((vendor) => (
                  <div key={vendor._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">{vendor.name}</h3>
                      <p className="text-sm text-gray-600">{vendor.email}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveVendor(vendor._id, true)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproveVendor(vendor._id, false)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Vendor Management Tab */}
        {activeTab === 'vendors' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Vendor Management</h2>
            {loadingVendors ? (
              <div className="text-center py-8">Loading vendors?...</div>
            ) : approvedVendors?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No approved vendors</div>
            ) : (
              <div className="space-y-4">
                {approvedVendors?.map((vendor) => (
                  <div key={vendor._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">{vendor.name}</h3>
                      <p className="text-sm text-gray-600">{vendor.email}</p>
                    </div>
                    <div>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        Approved
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'logout' &&(
           <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">LoG Out</h2>            
              {/* <div className="text-center py-8 text-gray-500">No approved vendors</div> */}
               <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">Are u sure want to logout</h3>
                      {/* <p className="text-sm text-gray-600">{vendor.email}</p> */}
                    </div>
                    <div className="flex space-x-2">
                     
                      <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Logout
                      </button>
                    </div>
                  </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;