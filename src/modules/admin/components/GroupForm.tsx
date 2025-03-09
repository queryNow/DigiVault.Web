import React, { useState } from 'react';
import { useCoreApi } from '../../../services/api/coreApi';
import { UserGroup, PermissionLevel, CreateUpdateGroupRequest } from '../../../services/api/types';
import { X, Check } from 'lucide-react';

interface GroupFormProps {
  group?: UserGroup | null;
  permissionLevels: PermissionLevel[];
  onSubmit: () => void;
  onCancel: () => void;
}

const READ_PERMISSION_ID = 4; // ID for Read permission level

const GroupForm: React.FC<GroupFormProps> = ({ group, permissionLevels, onSubmit, onCancel }) => {
  const coreApi = useCoreApi();
  const [formData, setFormData] = useState<CreateUpdateGroupRequest>({
    Id: group?.Id,
    Name: group?.Name || '',
    Description: group?.Description || '',
    Precedence: group?.Precedence || 0,
    UserGroupPermissionLevelXrefs: group?.UserGroupPermissionLevelXref?.map(xref => ({
      Id: xref.Id,
      UserGroup: group.Id,
      PermissionLevel: xref.PermissionLevel.Id
    })) || [{ Id: 0, UserGroup: 0, PermissionLevel: READ_PERMISSION_ID }]
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (group?.Id) {
        await coreApi.updateGroup(group.Id, formData);
      } else {
        await coreApi.createGroup(formData);
      }
      onSubmit();
    } catch (err) {
      console.error('Failed to save group:', err);
      setError('Failed to save group. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePermission = (permissionId: number) => {
    if (permissionId === READ_PERMISSION_ID) return; // Prevent toggling Read permission

    setFormData(prev => {
      const currentXrefs = prev.UserGroupPermissionLevelXrefs || [];
      const hasPermission = currentXrefs.some(x => x.PermissionLevel === permissionId);

      if (hasPermission) {
        return {
          ...prev,
          UserGroupPermissionLevelXrefs: currentXrefs.filter(x => x.PermissionLevel !== permissionId)
        };
      } else {
        return {
          ...prev,
          UserGroupPermissionLevelXrefs: [
            ...currentXrefs,
            {
              Id: 0,
              UserGroup: group?.Id || 0,
              PermissionLevel: permissionId
            }
          ]
        };
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {group ? 'Edit Group' : 'Add New Group'}
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Group Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.Name}
                onChange={(e) => setFormData(prev => ({ ...prev, Name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                value={formData.Description}
                onChange={(e) => setFormData(prev => ({ ...prev, Description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Permissions
              </label>
              <div className="space-y-2 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                {permissionLevels.map(permission => (
                  <div
                    key={permission.Id}
                    className={`flex items-center justify-between p-2 rounded-md ${
                      permission.Id === READ_PERMISSION_ID
                        ? 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-75'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
                    }`}
                    onClick={() => togglePermission(permission.Id)}
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {permission.Name}
                        {permission.Id === READ_PERMISSION_ID && (
                          <span className="ml-2 text-xs text-gray-500">(Required)</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {permission.Description}
                      </div>
                    </div>
                    {(formData.UserGroupPermissionLevelXrefs?.some(x => x.PermissionLevel === permission.Id) || permission.Id === READ_PERMISSION_ID) && (
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

export default GroupForm;