// AdminSupportPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Check,
  Clock,
  X,
  AlertCircle,
  Filter,
  Search
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useSupport } from '@/contexts/SupportContext';

const AdminSupportPage = () => {
  const {
    tickets,
    currentTicket,
    loading,
    error,
    fetchTickets,
    fetchTicket,
    updateTicketStatus,
    clearErrors
  } = useSupport();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => clearErrors();
  }, []);

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      await updateTicketStatus(ticketId, newStatus);
      if (selectedTicket && selectedTicket._id === ticketId) {
        fetchTicket(ticketId); // Refresh the selected ticket
      }
    } catch (err) {
      console.error('Error updating ticket status:', err);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch(status) {
      case 'open':
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800 flex items-center`}>
            <Clock className="w-3 h-3 mr-1" /> Open
          </span>
        );
      case 'in-progress':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800 flex items-center`}>
            <AlertCircle className="w-3 h-3 mr-1" /> In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800 flex items-center`}>
            <Check className="w-3 h-3 mr-1" /> Resolved
          </span>
        );
      case 'closed':
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800 flex items-center`}>
            <X className="w-3 h-3 mr-1" /> Closed
          </span>
        );
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const priorityBadge = (priority) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch(priority) {
      case 'high':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>High</span>;
      case 'medium':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Medium</span>;
      case 'low':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Low</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{priority}</span>;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center">
                <Filter className="w-5 h-5 text-gray-500 mr-2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tickets List */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                {loading && !tickets.length ? (
                  <div className="p-8 text-center text-gray-500">Loading tickets...</div>
                ) : filteredTickets.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No tickets found</div>
                ) : (
                  <ul className="divide-y divide-gray-200 max-h-screen overflow-y-auto">
                    {filteredTickets.map((ticket) => (
                      <li key={ticket._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <div 
                          className={`px-4 py-4 sm:px-6 cursor-pointer ${selectedTicket?._id === ticket._id ? 'bg-purple-50' : ''}`}
                          onClick={() => {
                            setSelectedTicket(ticket);
                            fetchTicket(ticket._id);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {statusBadge(ticket.status)}
                              <p className="text-sm font-medium text-purple-600 truncate">
                                #{ticket._id.substring(ticket._id.length - 6)}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-800 font-medium">
                                {ticket.subject}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <p>{ticket.email}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Ticket Details */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg sticky top-4">
                {selectedTicket ? (
                  <div>
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Ticket Details
                        </h3>
                        <div className="flex items-center space-x-2">
                          {statusBadge(selectedTicket.status)}
                          {priorityBadge(selectedTicket.priority)}
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        #{selectedTicket._id}
                      </p>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Subject</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedTicket.subject}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Description</h4>
                          <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                            {selectedTicket.description}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Customer</h4>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedTicket.name} ({selectedTicket.email})
                          </p>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedTicket.phone}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Created</h4>
                          <p className="mt-1 text-sm text-gray-900">
                            {new Date(selectedTicket.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                          <p className="mt-1 text-sm text-gray-900">
                            {new Date(selectedTicket.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Update Status</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleStatusUpdate(selectedTicket._id, 'in-progress')}
                            disabled={selectedTicket.status === 'in-progress'}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${selectedTicket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 cursor-not-allowed' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'}`}
                          >
                            In Progress
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(selectedTicket._id, 'resolved')}
                            disabled={selectedTicket.status === 'resolved'}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${selectedTicket.status === 'resolved' ? 'bg-green-100 text-green-800 cursor-not-allowed' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                          >
                            Resolved
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(selectedTicket._id, 'closed')}
                            disabled={selectedTicket.status === 'closed'}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${selectedTicket.status === 'closed' ? 'bg-gray-100 text-gray-800 cursor-not-allowed' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                          >
                            Close
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(selectedTicket._id, 'open')}
                            disabled={selectedTicket.status === 'open'}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${selectedTicket.status === 'open' ? 'bg-blue-100 text-blue-800 cursor-not-allowed' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                          >
                            Reopen
                          </button>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={() => {
                            // Implement send email functionality
                            window.location.href = `mailto:${selectedTicket.email}?subject=Re: ${selectedTicket.subject}&body=Dear ${selectedTicket.name},\n\nRegarding your support ticket (#${selectedTicket._id.substring(selectedTicket._id.length - 6)})...`;
                          }}
                          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors duration-200"
                        >
                          Respond via Email
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    Select a ticket to view details
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSupportPage;