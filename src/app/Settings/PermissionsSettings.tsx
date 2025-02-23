import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users, UserPlus, Shield, Search } from 'lucide-react';
import { User, Group } from '../../utils/types/permissions';
import UsersList from '../../core/components/Permissions/UsersList';
import GroupsList from '../../core/components/Permissions/GroupsList';
import EditUserModal from '../../core/components/Permissions/EditUserModal';
import AddGroupModal from '../../core/components/Permissions/AddGroupModal';
import EditGroupModal from '../../core/components/Permissions/EditGroupModal';
import AddUserModal from '../../core/components/Permissions/AddUserModal';


const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Administrator',
    status: 'Active',
    lastLogin: '2024-03-20T10:30:00Z',
    groups: ['Administrators', 'Asset Managers']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'Asset Manager',
    status: 'Active',
    lastLogin: '2024-03-19T15:45:00Z',
    groups: ['Asset Managers']
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    role: 'Analyst',
    status: 'Active',
    lastLogin: '2024-03-20T09:15:00Z',
    groups: ['Analysts', 'Compliance']
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    role: 'Compliance Officer',
    status: 'Inactive',
    lastLogin: '2024-03-15T11:20:00Z',
    groups: ['Compliance']
  }
];

const MOCK_GROUPS: Group[] = [
  {
    id: '1',
    name: 'Administrators',
    description: 'Full system access and control',
    members: 3,
    permissions: ['assets.read', 'assets.write', 'assets.delete', 'users.read', 'users.write', 'users.delete', 'settings.read', 'settings.write']
  },
  {
    id: '2',
    name: 'Asset Managers',
    description: 'Manage and monitor assets',
    members: 8,
    permissions: ['assets.read', 'assets.write', 'documents.read', 'documents.write']
  },
  {
    id: '3',
    name: 'Analysts',
    description: 'View and analyze assets',
    members: 12,
    permissions: ['assets.read', 'documents.read']
  },
  {
    id: '4',
    name: 'Compliance',
    description: 'Compliance monitoring and reporting',
    members: 5,
    permissions: ['assets.read', 'documents.read', 'documents.write']
  }
];

const AVAILABLE_PERMISSIONS = {
  assets: [
    { id: 'assets.read', name: 'View Assets' },
    { id: 'assets.write', name: 'Manage Assets' },
    { id: 'assets.delete', name: 'Delete Assets' }
  ],
  documents: [
    { id: 'documents.read', name: 'View Documents' },
    { id: 'documents.write', name: 'Manage Documents' },
    { id: 'documents.delete', name: 'Delete Documents' }
  ],
  users: [
    { id: 'users.read', name: 'View Users' },
    { id: 'users.write', name: 'Manage Users' },
    { id: 'users.delete', name: 'Delete Users' }
  ],
  settings: [
    { id: 'settings.read', name: 'View Settings' },
    { id: 'settings.write', name: 'Manage Settings' }
  ]
};

export default function PermissionsSettings() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [users, setUsers] = useState(MOCK_USERS);
  const [groups, setGroups] = useState(MOCK_GROUPS);

  const handleAddUser = (user: Omit<User, 'id'>) => {
    const newUser = {
      ...user,
      id: Math.random().toString(36).substr(2, 9)
    };
    setUsers([...users, newUser]);
    setShowAddUser(false);
  };

  const handleAddGroup = (group: Omit<Group, 'id' | 'members'>) => {
    const newGroup = {
      ...group,
      id: Math.random().toString(36).substr(2, 9),
      members: 0
    };
    setGroups([...groups, newGroup]);
    setShowAddGroup(false);
  };

  const handleEditUser = (userId: string, userData: Partial<User>) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, ...userData } : user
    ));
    setShowEditUser(false);
    setSelectedUser(null);
  };

  const handleEditGroup = (groupId: string, groupData: Partial<Group>) => {
    setGroups(groups.map(group =>
      group.id === groupId ? { ...group, ...groupData } : group
    ));
    setShowEditGroup(false);
    setSelectedGroup(null);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    setShowEditUser(false);
    setSelectedUser(null);
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter(group => group.id !== groupId));
    setShowEditGroup(false);
    setSelectedGroup(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">User & Group Management</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage users, groups, and their permissions
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="sm:hidden">
          <select
            value={location.hash === '#GRP' ? 'groups' : 'users'}
            onChange={(e) => navigate(e.target.value)}
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="#USR">Users</option>
            <option value="#GRP">Groups</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => navigate(`#USR`)}
              className={`px-3 py-2 text-sm font-medium rounded-md ${location.hash === '#USR'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Users className="h-5 w-5 inline-block mr-2" />
              Users
            </button>
            <button
              onClick={() => navigate(`#GRP`)}
              className={`px-3 py-2 text-sm font-medium rounded-md ${location.hash === '#GRP'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Shield className="h-5 w-5 inline-block mr-2" />
              Groups
            </button>
          </nav>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-96 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={`Search ${location.hash === '#GRP' ? 'groups' : 'users'}...`}
          />
        </div>
        <button
          onClick={() => location.hash === '#USR' ? setShowAddUser(true) : setShowAddGroup(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {location.hash === '#USR' ? (
            <>
              <UserPlus className="h-5 w-5 mr-2" />
              Add User
            </>
          ) : (
            <>
              <Shield className="h-5 w-5 mr-2" />
              Add Group
            </>
          )}
        </button>
      </div>

      {/* Content */}
      {location.hash === '#USR' ? (
        <UsersList
          users={users}
          onEditUser={(user) => {
            setSelectedUser(user);
            setShowEditUser(true);
          }}
        />
      ) : (
        <GroupsList
          groups={groups}
          onEditGroup={(group) => {
            setSelectedGroup(group);
            setShowEditGroup(true);
          }}
        />
      )}

      {/* Modals */}
      {showAddUser && (
        <AddUserModal
          onClose={() => setShowAddUser(false)}
          onSave={handleAddUser}
          groups={groups.map(g => g.name)}
        />
      )}

      {showEditUser && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditUser(false);
            setSelectedUser(null);
          }}
          onSave={handleEditUser}
          onDelete={handleDeleteUser}
          groups={groups.map(g => g.name)}
        />
      )}

      {showAddGroup && (
        <AddGroupModal
          onClose={() => setShowAddGroup(false)}
          onSave={handleAddGroup}
          availablePermissions={AVAILABLE_PERMISSIONS}
        />
      )}

      {showEditGroup && selectedGroup && (
        <EditGroupModal
          group={selectedGroup}
          onClose={() => {
            setShowEditGroup(false);
            setSelectedGroup(null);
          }}
          onSave={handleEditGroup}
          onDelete={handleDeleteGroup}
          availablePermissions={AVAILABLE_PERMISSIONS}
        />
      )}
    </div>
  );
}