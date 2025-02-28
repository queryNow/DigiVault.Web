import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Users, Key, MoreVertical, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Group } from '../../../utils/types/permissions';

interface GroupsListProps {
  groups: Group[];
  onEditGroup: (group: Group) => void;
  onDeleteGroup: (groupId: string) => void;
}

export default function GroupsList({ groups, onEditGroup, onDeleteGroup }: GroupsListProps) {
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: groups.length,
    totalPages: Math.ceil(groups.length / 10)
  });

  // Update pagination when groups change
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      totalItems: filteredGroups.length,
      totalPages: Math.ceil(filteredGroups.length / prev.pageSize),
      currentPage: Math.min(prev.currentPage, Math.ceil(filteredGroups.length / prev.pageSize) || 1)
    }));
  }, [searchTerm, groups]);

  const handleActionClick = useCallback((groupId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setShowActionMenu(showActionMenu === groupId ? null : groupId);
  }, [showActionMenu]);

  const handleEditClick = useCallback((group: Group, event: React.MouseEvent) => {
    event.stopPropagation();
    setShowActionMenu(null);
    onEditGroup(group);
  }, [onEditGroup]);

  const handleDeleteClick = useCallback((groupId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      onDeleteGroup(groupId);
    }
    setShowActionMenu(null);
  }, [onDeleteGroup]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowActionMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Filter groups based on search term
  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current page of groups
  const currentGroups = filteredGroups.slice(
    (pagination.currentPage - 1) * pagination.pageSize,
    pagination.currentPage * pagination.pageSize
  );

  // Change page
  const changePage = useCallback((page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  }, []);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="w-full sm:w-64 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search groups..."
          />
        </div>
      </div>

      {/* Groups Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Group
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Members
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permissions
              </th>
              <th scope="col" className="relative w-10 px-2">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentGroups.map((group) => (
              <tr
                key={group.id}
                className="hover:bg-gray-50"
                onMouseEnter={() => setHoveredGroupId(group.id)}
                onMouseLeave={() => setHoveredGroupId(null)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{group.name}</div>
                      <div className="text-sm text-gray-500">{group.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{group.members} members</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {group.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        <Key className="h-3 w-3 mr-1" />
                        {permission}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-2 py-4 text-right text-sm font-medium">
                  {hoveredGroupId === group.id && (
                    <div className="relative">
                      <button
                        onClick={(e) => handleActionClick(group.id, e)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {showActionMenu === group.id && (
                        <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 right-6 top-0">
                          <button
                            onClick={(e) => handleEditClick(group, e)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="mr-2 h-4 w-4 text-gray-500" />
                            Edit Group
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(group.id, e)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                            Delete Group
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
      {pagination.totalPages > 1 && (
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
                Showing <span className="font-medium">{Math.min(1 + (pagination.currentPage - 1) * pagination.pageSize, pagination.totalItems)}</span> to{' '}
                <span className="font-medium">{Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)}</span> of{' '}
                <span className="font-medium">{pagination.totalItems}</span> results
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
      )}
    </div>
  );
}