import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    User,
    Mail,
    Phone,
    Lock,
    Unlock,
    ChevronDown,
    ChevronUp,
    Shield,
    AlertCircle,
    Check,
    X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

const AdminUserManagement = () => {
    const { getUsers, blockUser, unblockUser, user: adminUser } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1
    });
    const [filters, setFilters] = useState({
        role: '',
        isBlocked: undefined,
        search: ''
    });
    const [blockReason, setBlockReason] = useState('');
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [expandedUser, setExpandedUser] = useState<string | null>(null);
    const navigate = useNavigate();

    // Fetch users with filters
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const queryParams = {
                page: pagination.page,
                limit: pagination.limit,
                role: filters.role || undefined,
                isBlocked: filters.isBlocked,
                search: filters.search || undefined
            };

            const response = await getUsers(queryParams);
            setUsers(response.data);
            setPagination({
                page: response.pagination.page,
                limit: response.pagination.limit,
                total: response.total,
                pages: response.pagination.pages
            });
        } catch (err: any) {
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [pagination.page, filters]);

    const handleBlock = async (userId: string) => {
        if (!blockReason.trim()) {
            setError('Please provide a reason for blocking');
            return;
        }

        try {
            setLoading(true);
            await blockUser(userId, blockReason);
            setBlockReason('');
            setSelectedUserId(null);
            await fetchUsers(); // Refresh the list
        } catch (err: any) {
            setError(err.message || 'Failed to block user');
        } finally {
            setLoading(false);
        }
    };

    const handleUnblock = async (userId: string) => {
        try {
            setLoading(true);
            await unblockUser(userId);
            await fetchUsers(); // Refresh the list
        } catch (err: any) {
            setError(err.message || 'Failed to unblock user');
        } finally {
            setLoading(false);
        }
    };

    const toggleUserExpand = (userId: string) => {
        setExpandedUser(expandedUser === userId ? null : userId);
    };

    const renderStatusBadge = (user: any) => {
        if (user?.isBlocked) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <Lock className="w-3 h-3 mr-1" /> Blocked
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Check className="w-3 h-3 mr-1" /> Active
            </span>
        );
    };

    const renderRoleBadge = (role: string) => {
        const roleClasses = {
            admin: 'bg-purple-100 text-purple-800',
            vendor: 'bg-blue-100 text-blue-800',
            user: 'bg-gray-100 text-gray-800'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleClasses[role as keyof typeof roleClasses]}`}>
                {role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                {role === 'vendor' && <User className="w-3 h-3 mr-1" />}
                {role === 'user' && <User className="w-3 h-3 mr-1" />}
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
        );
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage all users, vendors, and administrators
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white shadow rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                    Search
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="search"
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                        placeholder="Name, email..."
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-10 sm:text-sm border-gray-300 rounded-md"
                                    value={filters.role}
                                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                                >
                                    <option value="">All Roles</option>
                                    <option value="user">User</option>
                                    <option value="vendor">Vendor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-10 sm:text-sm border-gray-300 rounded-md"
                                    value={filters.isBlocked as any}
                                    onChange={(e) => setFilters({
                                        ...filters,
                                        isBlocked: e.target.value === '' ? undefined : e.target.value === 'true'
                                    })}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="false">Active</option>
                                    <option value="true">Blocked</option>
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={() => fetchUsers()}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <Filter className="w-4 h-4 mr-2" /> Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users table */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        {loading && users.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                Loading users...
                            </div>
                        ) : users.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No users found matching your criteria
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <li key={user?.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <div className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    {renderStatusBadge(user)}
                                                    {renderRoleBadge(user?.role)}
                                                    <p className="text-sm font-medium text-indigo-600 truncate">
                                                        {user?.name}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {user?.isBlocked ? (
                                                        <button
                                                            onClick={() => handleUnblock(user?.id)}
                                                            disabled={loading}
                                                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                        >
                                                            <Unlock className="w-3 h-3 mr-1" /> Unblock
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => setSelectedUserId(user?.id)}
                                                            disabled={loading}
                                                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        >
                                                            <Lock className="w-3 h-3 mr-1" /> Block
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => toggleUserExpand(user?.id)}
                                                        className="text-gray-400 hover:text-gray-500"
                                                    >
                                                        {expandedUser === user?.id ? (
                                                            <ChevronUp className="w-5 h-5" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {expandedUser === user?.id && (
                                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">
                                                            <Mail className="inline w-4 h-4 mr-2 text-gray-400" />
                                                            {user?.email}
                                                        </p>
                                                        {user?.phoneNumber && (
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                <Phone className="inline w-4 h-4 mr-2 text-gray-400" />
                                                                {user?.phoneNumber}
                                                            </p>
                                                        )}
                                                        {user?.businessName && (
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                <span className="inline-block w-4 h-4 mr-2 text-gray-400">🏢</span>
                                                                {user?.businessName}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">
                                                            <span className="inline-block w-4 h-4 mr-2 text-gray-400">🆔</span>
                                                            {user?.name}
                                                        </p>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            <span className="inline-block w-4 h-4 mr-2 text-gray-400">📅</span>
                                                            Joined {new Date(user?.createdAt).toLocaleDateString()}
                                                        </p>
                                                        {user?.isBlocked && user?.blockDetails && (
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                <span className="inline-block w-4 h-4 mr-2 text-gray-400">⛔</span>
                                                                Blocked on {new Date(user?.blockDetails.blockedAt).toLocaleDateString()}
                                                                {user?.blockDetails.reason && ` - Reason: ${user?.blockDetails.reason}`}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-b-lg">
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                                        <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                                        <span className="font-medium">{pagination.total}</span> users
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                                            disabled={pagination.page === 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                        {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                            let pageNum;
                                            if (pagination.pages <= 5) {
                                                pageNum = i + 1;
                                            } else if (pagination.page <= 3) {
                                                pageNum = i + 1;
                                            } else if (pagination.page >= pagination.pages - 2) {
                                                pageNum = pagination.pages - 4 + i;
                                            } else {
                                                pageNum = pagination.page - 2 + i;
                                            }
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setPagination({ ...pagination, page: pageNum })}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagination.page === pageNum
                                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => setPagination({ ...pagination, page: Math.min(pagination.pages, pagination.page + 1) })}
                                            disabled={pagination.page === pagination.pages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">Next</span>
                                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Block User Modal */}
                {selectedUserId && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                <div>
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                        <Lock className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Block User
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Please provide a reason for blocking this user?. This will be recorded and may be shared with the user?.
                                            </p>
                                            <textarea
                                                rows={3}
                                                className="mt-4 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                placeholder="Reason for blocking..."
                                                value={blockReason}
                                                onChange={(e) => setBlockReason(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                    <button
                                        type="button"
                                        onClick={() => handleBlock(selectedUserId)}
                                        disabled={loading || !blockReason.trim()}
                                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm ${loading || !blockReason.trim() ? 'opacity-70 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        {loading ? 'Blocking...' : 'Block User'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedUserId(null);
                                            setBlockReason('');
                                        }}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminUserManagement;

// Helper components for pagination arrows
const ChevronLeft = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRight = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);