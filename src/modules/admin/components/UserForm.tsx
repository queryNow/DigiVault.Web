import React, { useState, useEffect } from 'react';
import { useCoreApi } from '../../../services/api/coreApi';
import { User, CreateUpdateUserRequest, UserGroup } from '../../../services/api/types';
import { X, Check, Search } from 'lucide-react';

interface UserFormProps {
  user?: User | null;
  onSubmit: () => void;
  onCancel: () => void;
}

const VISITORS_GROUP_ID = 3; // Make sure this matches your actual Visitors group ID

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const coreApi = useCoreApi();
  const [formData, setFormData] = useState<CreateUpdateUserRequest>({
    Id: user?.Id,
    Email: user?.Email || '',
    FirstName: user?.FirstName || '',
    LastName: user?.LastName || '',
    IsActive: user?.IsActive ?? true,
    UserGroupUsersXrefs: []
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([VISITORS_GROUP_ID]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await coreApi.getUserGroups();
        setGroups(response.value);
        
        if (user?.UserGroupUsersXref) {
          const userGroupIds = user.UserGroupUsersXref.map(x => x.UserGroup.Id);
          setSelectedGroups([...new Set([VISITORS_GROUP_ID, ...userGroupIds])]);
        } else {
          // For new users, only set Visitors group
          setSelectedGroups([VISITORS_GROUP_ID]);
        }
      } catch (err) {
        console.error('Failed to fetch groups:', err);
        setError('Failed to load user groups');
      }
    };

    fetchGroups();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const userGroupXrefs = selectedGroups.map(groupId => ({
        Id: user?.UserGroupUsersXref?.find(x => x.UserGroup.Id === groupId)?.Id || 0,
        User: user?.Id || 0,
        UserGroup: groupId
      }));

      const updatedFormData = {
        ...formData,
        UserGroupUsersXrefs: userGroupXrefs
      };

      if (user?.Id) {
        await coreApi.updateUser(user.Id, updatedFormData);
      } else {
        await coreApi.createUser(updatedFormData);
      }
      onSubmit();
    } catch (err) {
      console.error('Failed to save user:', err);
      setError('Failed to save user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredGroups = groups.filter(group =>
    group.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleGroup = (groupId: number) => {
    if (groupId === VISITORS_GROUP_ID) return; // Prevent toggling Visitors group
    
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user ? 'Edit User' : 'Add New User'}
            </h2>
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.Email}
                onChange={(e) => setFormData(prev => ({ ...prev, Email: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.FirstName}
                onChange={(e) => setFormData(prev => ({ ...prev, FirstName: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.LastName}
                onChange={(e) => setFormData(prev => ({ ...prev, LastName: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.IsActive}
                onChange={(e) => setFormData(prev => ({ ...prev, IsActive: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Active
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                User Groups
              </label>
              <div className="relative mb-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search groups..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
                {filteredGroups.map(group => (
                  <div
                    key={group.Id}
                    className={`flex items-center justify-between p-3 ${
                      group.Id === VISITORS_GROUP_ID 
                        ? 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-75' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
                    }`}
                    onClick={() => toggleGroup(group.Id)}
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {group.Name}
                        {group.Id === VISITORS_GROUP_ID && (
                          <span className="ml-2 text-xs text-gray-500">(Default)</span>
                        )}
                      </div>
                      {group.Description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {group.Description}
                        </div>
                      )}
                    </div>
                    {selectedGroups.includes(group.Id) && (
                      <Check className="h-5 w-5 text-indigo-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;