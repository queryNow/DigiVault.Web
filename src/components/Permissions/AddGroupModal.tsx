import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Group } from '../../types/permissions';

interface AddGroupModalProps {
  onClose: () => void;
  onSave: (group: Omit<Group, 'id' | 'members'>) => void;
  availablePermissions: Record<string, { id: string; name: string; }[]>;
}

export default function AddGroupModal({ onClose, onSave, availablePermissions }: AddGroupModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof availablePermissions>(
    Object.keys(availablePermissions)[0] as keyof typeof availablePermissions
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Add New Group</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Group Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
            <div className="flex space-x-2 mb-4">
              {Object.keys(availablePermissions).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category as keyof typeof availablePermissions)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    selectedCategory === category
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-4">
              {availablePermissions[selectedCategory].map((permission) => (
                <div key={permission.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={permission.id}
                    checked={formData.permissions.includes(permission.id)}
                    onChange={(e) => {
                      const newPermissions = e.target.checked
                        ? [...formData.permissions, permission.id]
                        : formData.permissions.filter(p => p !== permission.id);
                      setFormData({ ...formData, permissions: newPermissions });
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={permission.id} className="ml-2 text-sm text-gray-700">
                    {permission.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}