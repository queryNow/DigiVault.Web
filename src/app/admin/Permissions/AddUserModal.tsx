import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { User } from '../../../utils/types/permissions';
import { CoreService } from '../../../utils/services/CoreService';
import { useAuth } from '../../../core/auth/AuthProvider';

interface AddUserModalProps {
  onClose: () => void;
  onSave: (user: Omit<User, 'id'>) => void;
}

export default function AddUserModal({ onClose, onSave }: AddUserModalProps) {
  const { instance } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    isActive: true,
    selectedGroups: [] as string[]
  });
  const [groups, setGroups] = useState<{ id: string, name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const coreService = new CoreService(instance);
        const response = await coreService.getUserGroups();
        const groupsData = response.value.map((group: any) => ({
          id: group.Id.toString(),
          name: group.Name
        }));
        setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [instance]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: ''
    };

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userData: Omit<User, 'id'> = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      status: formData.isActive ? 'Active' : 'Inactive',
      role: formData.selectedGroups.includes('Administrators') ? 'Administrator' :
        formData.selectedGroups.includes('Approvers') ? 'Approver' : 'User',
      groups: formData.selectedGroups
    };

    onSave(userData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Add New User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              required
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${errors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              required
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>

          <div>
            <label htmlFor="groups" className="block text-sm font-medium text-gray-700">
              Groups
            </label>
            {loading ? (
              <div className="mt-1 text-sm text-gray-500">Loading groups...</div>
            ) : (
              <select
                multiple
                id="groups"
                value={formData.selectedGroups}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                  setFormData({ ...formData, selectedGroups: selectedOptions });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-32"
              >
                {groups.map(group => (
                  <option key={group.id} value={group.name}>{group.name}</option>
                ))}
              </select>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Hold Ctrl (or Cmd on Mac) to select multiple groups
            </p>
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
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}