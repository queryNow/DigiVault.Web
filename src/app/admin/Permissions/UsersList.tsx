import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Key, Shield, Check, AlertTriangle, MoreVertical, Edit, Trash2, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { User } from '../../../utils/types/permissions';
import { CoreService } from '../../../utils/services/CoreService';
import { useAuth } from '../../../core/auth/AuthProvider';

interface UsersListProps {
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export default function UsersList({ onEditUser, onDeleteUser }: UsersListProps) {
  const { instance } = useAuth();
  const coreServiceRef = useRef<CoreService>(new CoreService(instance));

  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('All Groups');
  const [groups, setGroups] = useState<{ id: string, name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 5,
    totalPages: 0
  });

  // Fetch users with OData parameters
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      // Build OData parameters
      const params: any = {
        $top: pagination.pageSize,
        $skip: (pagination.currentPage - 1) * pagination.pageSize,
        $count: true,
        $orderby: 'LastName asc',
      };

      // Add search filter
      if (searchTerm) {
        params.$filter = `contains(FirstName, '${searchTerm}') or contains(LastName, '${searchTerm}') or contains(Email, '${searchTerm}')`;
      }

      // Add group filter
      if (filterGroup !== 'All Groups') {
        const groupFilter = `UserGroupUsersXref/any(x: x/UserGroup/Name eq '${filterGroup}')`;
        params.$filter = params.$filter
          ? `(${params.$filter}) and ${groupFilter}`
          : groupFilter;
      }

      const response = await coreServiceRef.current.getUsers(params);

      // Transform API response to our model
      const transformedUsers = response.value.map((apiUser: any) =>
        coreServiceRef.current.transformApiUserToUser(apiUser)
      );

      setUsers(transformedUsers);
      setTotalCount(response['@odata.count'] || response.value.length);
      setPagination(prev => ({
        ...prev,
        totalPages: Math.ceil(response['@odata.count'] / prev.pageSize)
      }));

    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize, pagination.currentPage, searchTerm, filterGroup]);

  // Fetch groups for filtering
  const fetchGroups = useCallback(async () => {
    try {
      const response = await coreServiceRef.current.getUserGroups();
      const groupsData = response.value.map((group: any) => ({
        id: group.Id.toString(),
        name: group.Name
      }));
      setGroups([{ id: 'all', name: 'All Groups' }, ...groupsData]);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Fetch users when parameters change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Action handlers
  const handleActionClick = useCallback((userId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setShowActionMenu(showActionMenu === userId ? null : userId);
  }, [showActionMenu]);

  const handleEditClick = useCallback((user: User, event: React.MouseEvent) => {
    event.stopPropagation();
    setShowActionMenu(null);
    onEditUser(user);
  }, [onEditUser]);

  const handleDeleteClick = useCallback((userId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      onDeleteUser(userId);
    }
    setShowActionMenu(null);
  }, [onDeleteUser]);

  // Search and filter handlers
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  }, []);

  const handleFilterChange = useCallback((value: string) => {
    setFilterGroup(value);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  }, []);

  // Pagination handler
  const changePage = useCallback((page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowActionMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="w-full sm:w-64 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search users..."
          />
        </div>

        <div className="w-full sm:w-auto flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filterGroup}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {groups.map(group => (
              <option key={group.id} value={group.name}>{group.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role & Groups
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th scope="col" className="relative w-10 px-2">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50"
                onMouseEnter={() => setHoveredUserId(user.id)}
                onMouseLeave={() => setHoveredUserId(null)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium text-lg">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      <Key className="h-3 w-3 mr-1" />
                      {user.role}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {user.groups.map((group) => (
                      <span key={group} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        <Shield className="h-3 w-3 mr-1" />
                        {group}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                    }`}>
                    {user.status === 'Active' ? (
                      <Check className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    )}
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                </td>
                <td className="px-2 py-4 text-right text-sm font-medium">
                  {hoveredUserId === user.id && (
                    <div className="relative">
                      <button
                        onClick={(e) => handleActionClick(user.id, e)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {showActionMenu === user.id && (
                        <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 right-6 top-0">
                          <button
                            onClick={(e) => handleEditClick(user, e)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="mr-2 h-4 w-4 text-gray-500" />
                            Edit User
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(user.id, e)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                            Delete User
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => changePage(Math.max(1, pagination.currentPage - 1))}
            disabled={pagination.currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => changePage(Math.min(pagination.totalPages, pagination.currentPage + 1))}
            disabled={pagination.currentPage === pagination.totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{Math.min(1 + (pagination.currentPage - 1) * pagination.pageSize, totalCount)}</span> to{' '}
              <span className="font-medium">{Math.min(pagination.currentPage * pagination.pageSize, totalCount)}</span> of{' '}
              <span className="font-medium">{totalCount}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => changePage(Math.max(1, pagination.currentPage - 1))}
                disabled={pagination.currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>

              {/* Page numbers */}
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(page =>
                  page === 1 ||
                  page === pagination.totalPages ||
                  Math.abs(page - pagination.currentPage) <= 1
                )
                .map((page, index, array) => {
                  // Add ellipsis
                  const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                  const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;

                  return (
                    <React.Fragment key={page}>
                      {showEllipsisBefore && (
                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                          ...
                        </span>
                      )}

                      <button
                        onClick={() => changePage(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === pagination.currentPage
                          ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                          }`}
                      >
                        {page}
                      </button>

                      {showEllipsisAfter && (
                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                          ...
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}

              <button
                onClick={() => changePage(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}