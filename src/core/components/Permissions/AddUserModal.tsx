import React, { useState } from 'react';
import { X } from 'lucide-react';
import { User } from '../../types/permissions';
import PeoplePicker from '../PeoplePicker';

interface Person {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface AddUserModalProps {
  onClose: () => void;
  onSave: (user: Omit<User, 'id'>) => void;
  groups: string[];
}

export default function AddUserModal({ onClose, onSave, groups }: AddUserModalProps) {
  const [selectedPeople, setSelectedPeople] = useState<Person[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new user for each selected person
    selectedPeople.forEach(person => {
      onSave({
        name: person.name,
        email: person.email,
        groups: selectedGroups,
        status: 'Active'
      });
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Add Users</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Users
            </label>
            <PeoplePicker
              selectedPeople={selectedPeople}
              onSelect={(person) => setSelectedPeople([...selectedPeople, person])}
              onRemove={(person) => setSelectedPeople(selectedPeople.filter(p => p.id !== person.id))}
              placeholder="Search users by name or email..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Groups</label>
            <select
              multiple
              value={selectedGroups}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(option => option.value);
                setSelectedGroups(selected);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-32"
            >
              {groups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
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
              disabled={selectedPeople.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add Users
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}