import React, { useState, useEffect, useCallback } from 'react';
import { useCoreApi } from '../../../services/api/coreApi';
import { useLocation } from 'react-router-dom';
import { User, ODataParams, CreateUpdateUserRequest, UserGroup } from '../../../services/api/types';
import { Edit2, Search, Plus, X, User as UserIcon, MoreVertical, ChevronLeft, ChevronRight, Power, Filter, Check } from 'lucide-react';
import LoadingSpinner from '../../../core/components/LoadingSpinner';
import UserForm from './UserForm';

const PAGE_SIZE = 10;

const UserTable: React.FC = () => {
  const location = useLocation();
  const groupFromState = location.state?.selectedGroup as UserGroup | undefined;
  const coreApi = useCoreApi();
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>(() => {
    if (groupFromState) {
      const groupId = parseInt(groupFromState.Id);
      return isNaN(groupId) ? [] : [groupId];
    }
    return [];
  });
  const [showGroupFilter, setShowGroupFilter] = useState(false);
  const [groupSearchTerm, setGroupSearchTerm] = useState('');

  const fetchGroups = useCallback(async () => {
    try {
      const response = await coreApi.getUserGroups({
        $orderby: 'Precedence desc'  // Sort by precedence in descending order
      });
      // Sort groups by precedence in descending order
      const sortedGroups = response.value.sort((a, b) => b.Precedence - a.Precedence);
      setGroups(sortedGroups);
    } catch (err) {
      console.error('Failed to fetch groups:', err);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params: ODataParams = {
        $top: PAGE_SIZE,
        $skip: (currentPage - 1) * PAGE_SIZE,
        $count: true,
        $orderby: 'Email'
      };

      let filters = [];

      if (searchTerm) {
        filters.push(`(contains(Email, '${searchTerm}') or contains(FirstName, '${searchTerm}') or contains(LastName, '${searchTerm}'))`);
      }

      if (selectedGroups.length > 0) {
        const groupFilters = selectedGroups.map(groupId => 
          `UserGroupUsersXref/any(x: x/UserGroup/Id eq ${groupId})`
        );
        filters.push(`(${groupFilters.join(' or ')})`);
      }

      if (filters.length > 0) {
        params.$filter = filters.join(' and ');
      }

      const response = await coreApi.getUsers(params);
      setUsers(response.value);
      setTotalCount(response['@odata.count'] || 0);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, selectedGroups]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !(event.target as Element).closest('.actions-dropdown')) {
        setActiveDropdown(null);
      }
      if (showGroupFilter && !(event.target as Element).closest('.group-filter-dropdown')) {
        setShowGroupFilter(false);
        setGroupSearchTerm('');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown, showGroupFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowForm(true);
    setActiveDropdown(null);
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    setSelectedUser(null);
    fetchUsers();
  };

  const handleToggleStatus = async (user: User) => {
    try {
      const updatedUser: CreateUpdateUserRequest = {
        Id: user.Id,
        Email: user.Email,
        FirstName: user.FirstName,
        LastName: user.LastName,
        IsActive: !user.IsActive,
        UserGroupUsersXrefs: user.UserGroupUsersXref.map(xref => ({
          Id: xref.Id,
          User: user.Id,
          UserGroup: xref.UserGroup.Id
        }))
      };

      await coreApi.updateUser(user.Id, updatedUser);
      fetchUsers();
      setActiveDropdown(null);
    } catch (err) {
      console.error('Failed to toggle user status:', err);
      setError('Failed to update user status. Please try again.');
    }
  };

  const toggleGroupFilter = (groupId: number) => {
    setSelectedGroups(prev => {
      const newGroups = prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId];
      return newGroups;
    });
    setCurrentPage(1);
  };

  const clearGroupFilters = () => {
    setSelectedGroups([]);
    setCurrentPage(1);
  };

  const filteredGroups = groups.filter(group =>
    group.Name.toLowerCase().includes(groupSearchTerm.toLowerCase())
  );

  const getSelectedGroupsLabel = () => {
    if (selectedGroups.length === 0) return 'Filter by Groups';
    if (selectedGroups.length === 1) {
      return groups.find(g => g.Id === selectedGroups[0])?.Name || 'Group';
    }
    return `${selectedGroups.length} Groups Selected`;
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const renderPaginationButton = (pageNum: number) => (
    <button
      key={pageNum}
      onClick={() => setCurrentPage(pageNum)}
      className={`px-3 py-1 rounded-md ${
        currentPage === pageNum
          ? 'bg-indigo-600 text-white'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      {pageNum}
    </button>
  );

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(renderPaginationButton(i));
      }
    } else {
      pages.push(renderPaginationButton(1));

      if (currentPage > 3) {
        pages.push(
          <span key="dots1" className="px-2 py-1 text-gray-500">
            ...
          </span>
        );
      }

      for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
        pages.push(renderPaginationButton(i));
      }

      if (currentPage < totalPages - 2) {
        pages.push(
          <span key="dots2" className="px-2 py-1 text-gray-500">
            ...
          </span>
        );
      }

      pages.push(renderPaginationButton(totalPages));
    }

    return pages;
  };

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-2.5"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <div className="relative group-filter-dropdown">
              <button
                type="button"
                onClick={() => setShowGroupFilter(!showGroupFilter)}
                className={`px-4 py-2 border rounded-lg flex items-center gap-2 ${
                  selectedGroups.length > 0
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Filter className="h-5 w-5" />
                {getSelectedGroupsLabel()}
              </button>
              {showGroupFilter && (
                <div className="absolute z-10 mt-2 w-72 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="p-2">
                    <div className="relative mb-2">
                      <input
                        type="text"
                        value={groupSearchTerm}
                        onChange={(e) => setGroupSearchTerm(e.target.value)}
                        placeholder="Search groups..."
                        className="pl-8 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                      />
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredGroups.map(group => (
                        <div
                          key={group.Id}
                          onClick={() => toggleGroupFilter(group.Id)}
                          className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-md"
                        >
                          <div className="flex items-center">
                            <div className="w-4 h-4 border rounded mr-2 flex items-center justify-center">
                              {selectedGroups.includes(group.Id) && (
                                <Check className="h-3 w-3 text-indigo-600" />
                              )}
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{group.Name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedGroups.length > 0 && (
                      <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={clearGroupFilters}
                          className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          Clear all filters
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Plus className="h-5 w-5" />
          Add User
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="w-16 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Groups
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.Id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.FirstName} {user.LastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.Email}
                          </div>
                        </div>
                        <div className="relative actions-dropdown">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(activeDropdown === user.Id ? null : user.Id);
                            }}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                          >
                            <MoreVertical className="h-5 w-5 text-gray-400" />
                          </button>
                          {activeDropdown === user.Id && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => handleEdit(user)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <Edit2 className="h-4 w-4 mr-2" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleToggleStatus(user)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <Power className="h-4 w-4 mr-2" />
                                  {user.IsActive ? 'Deactivate' : 'Activate'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.IsActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {user.IsActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {user.UserGroupUsersXref?.map(xref => (
                          <span
                            key={xref.Id}
                            className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full"
                          >
                            {xref.UserGroup.Name}
                          </span>
                        )) || (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            No groups
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-md disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-1">
                {renderPagination()}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-md disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <UserForm
              user={selectedUser}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setSelectedUser(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;