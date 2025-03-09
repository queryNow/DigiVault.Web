import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useCoreApi } from '../../../services/api/coreApi';
import { useNavigate } from 'react-router-dom';
import { UserGroup, ODataParams, PermissionLevel } from '../../../services/api/types';
import { Edit2, Search, Plus, X, Users, MoreVertical, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import LoadingSpinner from '../../../core/components/LoadingSpinner';
import GroupForm from './GroupForm';

const PAGE_SIZE = 10;

const GroupTable: React.FC = () => {
  const coreApi = useCoreApi();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [permissionLevels, setPermissionLevels] = useState<PermissionLevel[]>([]);

  const fetchPermissionLevels = useCallback(async () => {
    try {
      const response = await coreApi.getPermissionLevels();
      setPermissionLevels(response.value);
    } catch (err) {
      console.error('Failed to fetch permission levels:', err);
    }
  }, []);

  useEffect(() => {
    fetchPermissionLevels();
  }, [fetchPermissionLevels]);

  const queryParams = useMemo(() => {
    const params: ODataParams = {
      $top: PAGE_SIZE,
      $skip: (currentPage - 1) * PAGE_SIZE,
      $count: true,
      $orderby: 'Precedence desc'  // Sort by precedence in descending order
    };

    if (searchTerm) {
      params.$filter = `contains(Name, '${searchTerm}') or contains(Description, '${searchTerm}')`;
    }

    return params;
  }, [currentPage, searchTerm]);

  const fetchGroups = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await coreApi.getUserGroups(queryParams);
      setGroups(response.value);
      setTotalCount(response['@odata.count'] || 0);
    } catch (err) {
      console.error('Failed to fetch groups:', err);
      setError('Failed to load groups. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !(event.target as Element).closest('.actions-dropdown')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleEdit = (group: UserGroup) => {
    setSelectedGroup(group);
    setShowForm(true);
    setActiveDropdown(null);
  };

  const handleDelete = async (group: UserGroup) => {
    if (window.confirm(`Are you sure you want to delete the group "${group.Name}"?`)) {
      try {
        await coreApi.deleteGroup(group.Id);
        fetchGroups();
        setActiveDropdown(null);
      } catch (err) {
        console.error('Failed to delete group:', err);
        setError('Failed to delete group. Please try again.');
      }
    }
  };

  const handleManageUsers = (group: UserGroup) => {
    navigate(`/admin/user-management#USR?group=${group.Id}`, {
      state: { selectedGroup: group }
    });
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    setSelectedGroup(null);
    fetchGroups();
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
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search groups..."
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
        </form>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Plus className="h-5 w-5" />
          Add Group
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Group Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {groups.map((group) => (
                  <tr key={group.Id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {group.Name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {group.Description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {group.UserGroupPermissionLevelXref?.map(xref => (
                          <span
                            key={xref.Id}
                            className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full"
                          >
                            {xref.PermissionLevel.Name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative actions-dropdown">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === group.Id ? null : group.Id);
                          }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-400" />
                        </button>
                        {activeDropdown === group.Id && (
                          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1">
                              <button
                                onClick={() => handleManageUsers(group)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Users className="h-4 w-4 mr-2" />
                                Manage Users
                              </button>
                              <button
                                onClick={() => handleEdit(group)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(group)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </button>
                            </div>
                          </div>
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
            <GroupForm
              group={selectedGroup}
              permissionLevels={permissionLevels}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setSelectedGroup(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupTable;