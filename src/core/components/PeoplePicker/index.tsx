import { useState, useRef, useEffect } from 'react';
import { User, X } from 'lucide-react';

interface Person {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface PeoplePickerProps {
  selectedPeople: Person[];
  onSelect: (person: Person) => void;
  onRemove: (person: Person) => void;
  placeholder?: string;
}

// Mock data for suggestions
const PEOPLE_SUGGESTIONS: Person[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&auto=format',
    role: 'Software Engineer'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&auto=format',
    role: 'Product Manager'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&auto=format',
    role: 'Data Analyst'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&auto=format',
    role: 'UX Designer'
  }
];

export default function PeoplePicker({ selectedPeople, onSelect, onRemove, placeholder = 'Add people...' }: PeoplePickerProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query) {
      const filtered = PEOPLE_SUGGESTIONS.filter(
        person =>
          !selectedPeople.find(p => p.id === person.id) &&
          (person.name.toLowerCase().includes(query.toLowerCase()) ||
            person.email.toLowerCase().includes(query.toLowerCase()))
      );
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query, selectedPeople]);

  return (
    <div className="relative">
      <div className="min-h-[42px] w-full border border-gray-300 rounded-md shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
        <div className="flex flex-wrap gap-2 p-2">
          {selectedPeople.map(person => (
            <div
              key={person.id}
              className="flex items-center gap-1 bg-indigo-50 text-indigo-700 rounded-full pl-2 pr-1 py-1"
            >
              {person.avatar ? (
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="w-5 h-5 rounded-full"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
              <span className="text-sm">{person.name}</span>
              <button
                type="button"
                onClick={() => onRemove(person)}
                className="p-0.5 hover:bg-indigo-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <input
            ref={inputRef}
            type="text"
            className="flex-1 outline-none min-w-[200px] text-sm"
            placeholder={selectedPeople.length === 0 ? placeholder : ''}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
          />
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
        >
          {suggestions.map(person => (
            <div
              key={person.id}
              className="cursor-pointer hover:bg-gray-100 px-4 py-2"
              onClick={() => {
                onSelect(person);
                setQuery('');
                inputRef.current?.focus();
              }}
            >
              <div className="flex items-center">
                {person.avatar ? (
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{person.name}</p>
                  <p className="text-sm text-gray-500">{person.email}</p>
                </div>
                {person.role && (
                  <span className="ml-auto text-xs text-gray-500">{person.role}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}