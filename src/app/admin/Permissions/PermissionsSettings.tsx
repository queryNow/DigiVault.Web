import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users, UserPlus, Shield } from 'lucide-react';
import { useAuth } from '../../../core/auth/AuthProvider';
import { CoreService } from '../../../utils/services/CoreService';
import { Group, User } from '../../../utils/types/permissions';
import UsersList from './UsersList';
import GroupsList from './GroupsList';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import AddGroupModal from './AddGroupModal';
import EditGroupModal from './EditGroupModal';


// Available permissions for groups
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
  const { instance } = useAuth();
  const coreService = useMemo(() => new CoreService(instance), [instance]);

  // State for data
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for modals
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // Fetch data function
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch users and groups
      const usersResponse = await coreService.getUsers();
      const groupsResponse = await coreService.getUserGroups();

      // Transform API responses to our models
      const transformedUsers = usersResponse.value.map((apiUser: any) =>
        coreService.transformApiUserToUser(apiUser)
      );

      let transformedGroups = groupsResponse.value.map((apiGroup: any) =>
        coreService.transformApiGroupToGroup(apiGroup)
      );

      // Calculate members count for each group
      transformedGroups = transformedGroups.map(group => {
        const membersCount = transformedUsers.filter(user =>
          user.groups.includes(group.name)
        ).length;

        return {
          ...group,
          members: membersCount
        };
      });

      setUsers(transformedUsers);
      setGroups(transformedGroups);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch users and groups');
    } finally {
      setLoading(false);
    }
  }, [coreService]);

  // Initial data load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // User management handlers
  const handleAddUser = useCallback(async (user: Omit<User, 'id'>) => {
    try {
      setLoading(true);
      // Create the user
      const apiUser = {
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ').slice(1).join(' '),
        email: user.email,
        status: user.status
      };

      const response = await coreService.createUser(apiUser);
      const userId = response.Id.toString();

      // Assign user to groups
      if (user.groups && user.groups.length > 0) {
        for (const groupName of user.groups) {
          const group = groups.find(g => g.name === groupName);
          if (group) {
            await coreService.assignUserToGroup(userId, group.id);
          }
        }
      }

      // Refresh data
      await fetchData();
      setShowAddUser(false);
    } catch (err: any) {
      console.error('Error adding user:', err);
      setError(err.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  }, [coreService, fetchData, groups]);

  const handleEditUser = useCallback(async (userId: string, userData: Partial<User>) => {
    try {
      setLoading(true);

      // Update user basic info
      await coreService.updateUser(userId, userData);

      // Handle group membership changes if needed
      if (userData.groups) {
        const currentUser = users.find(u => u.id === userId);
        if (currentUser) {
          // Groups to add
          const groupsToAdd = userData.groups.filter(g => !currentUser.groups.includes(g));
          // Groups to remove
          const groupsToRemove = currentUser.groups.filter(g => !userData.groups?.includes(g));

          // Add user to new groups
          for (const groupName of groupsToAdd) {
            const group = groups.find(g => g.name === groupName);
            if (group) {
              await coreService.assignUserToGroup(userId, group.id);
            }
          }

          // Remove user from groups
          for (const groupName of groupsToRemove) {
            const group = groups.find(g => g.name === groupName);
            if (group) {
              await coreService.removeUserFromGroup(userId, group.id);
            }
          }
        }
      }

      // Refresh data
      await fetchData();
      setShowEditUser(false);
      setSelectedUser(null);
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  }, [coreService, fetchData, groups, users]);

  const handleDeleteUser = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      await coreService.deleteUser(userId);
      await fetchData();
      setShowEditUser(false);
      setSelectedUser(null);
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError(err.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  }, [coreService, fetchData]);

  // Group management handlers
  const handleAddGroup = useCallback(async (group: Omit<Group, 'id' | 'members'>) => {
    try {
      setLoading(true);
      // Create the group
      const apiGroup = {
        name: group.name,
        description: group.description,
        precedence: 0
      };

      const response = await coreService.createUserGroup(apiGroup);
      const groupId = response.Id.toString();

      // Assign permissions to group
      if (group.permissions && group.permissions.length > 0) {
        for (const permission of group.permissions) {
          // Map permission string to permission level ID
          const permissionMap: Record<string, string> = {
            'read': '4', // Assuming 4 is the ID for Read permission
            'write': '2', // Assuming 2 is the ID for Write permission
            'update': '3', // Assuming 3 is the ID for Update permission
            'delete': '1'  // Assuming 1 is the ID for Delete permission
          };

          const permissionLevelId = permissionMap[permission];
          if (permissionLevelId) {
            await coreService.assignPermissionToGroup(groupId, permissionLevelId);
          }
        }
      }

      // Refresh data
      await fetchData();
      setShowAddGroup(false);
    } catch (err: any) {
      console.error('Error adding group:', err);
      setError(err.message || 'Failed to add group');
    } finally {
      setLoading(false);
    }
  }, [coreService, fetchData]);

  const handleEditGroup = useCallback(async (groupId: string, groupData: Partial<Group>) => {
    try {
      setLoading(true);

      // Update group basic info
      await coreService.updateUserGroup(groupId, groupData);

      // Handle permission changes if needed
      if (groupData.permissions) {
        const currentGroup = groups.find(g => g.id === groupId);
        if (currentGroup) {
          // Permissions to add
          const permissionsToAdd = groupData.permissions.filter(p => !currentGroup.permissions.includes(p));
          // Permissions to remove
          const permissionsToRemove = currentGroup.permissions.filter(p => !groupData.permissions?.includes(p));

          // Map permission string to permission level ID
          const permissionMap: Record<string, string> = {
            'read': '4',
            'write': '2',
            'update': '3',
            'delete': '1'
          };

          // Add new permissions
          for (const permission of permissionsToAdd) {
            const permissionLevelId = permissionMap[permission];
            if (permissionLevelId) {
              await coreService.assignPermissionToGroup(groupId, permissionLevelId);
            }
          }

          // Remove permissions
          for (const permission of permissionsToRemove) {
            const permissionLevelId = permissionMap[permission];
            if (permissionLevelId) {
              await coreService.removePermissionFromGroup(groupId, permissionLevelId);
            }
          }
        }
      }

      // Refresh data
      await fetchData();
      setShowEditGroup(false);
      setSelectedGroup(null);
    } catch (err: any) {
      console.error('Error updating group:', err);
      setError(err.message || 'Failed to update group');
    } finally {
      setLoading(false);
    }
  }, [coreService, fetchData, groups]);

  const handleDeleteGroup = useCallback(async (groupId: string) => {
    try {
      setLoading(true);
      await coreService.deleteUserGroup(groupId);
      await fetchData();
      setShowEditGroup(false);
      setSelectedGroup(null);
    } catch (err: any) {
      console.error('Error deleting group:', err);
      setError(err.message || 'Failed to delete group');
    } finally {
      setLoading(false);
    }
  }, [coreService, fetchData]);

  // UI handlers
  const handleEditUserClick = useCallback((user: User) => {
    setSelectedUser(user);
    setShowEditUser(true);
  }, []);

  const handleEditGroupClick = useCallback((group: Group) => {
    setSelectedGroup(group);
    setShowEditGroup(true);
  }, []);

  // Loading state
  if (loading && users.length === 0 && groups.length === 0) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Error state
  if (error && users.length === 0 && groups.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <button
            onClick={() => fetchData()}
            className="mt-2 text-sm text-red-600 hover:text-red-500"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const isUsersTab = location.hash !== '#GRP';

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
            value={isUsersTab ? '#USR' : '#GRP'}
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
              className={`px-3 py-2 text-sm font-medium rounded-md ${isUsersTab
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Users className="h-5 w-5 inline-block mr-2" />
              Users
            </button>
            <button
              onClick={() => navigate(`#GRP`)}
              className={`px-3 py-2 text-sm font-medium rounded-md ${!isUsersTab
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

      {/* Actions */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => isUsersTab ? setShowAddUser(true) : setShowAddGroup(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {isUsersTab ? (
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
      {isUsersTab ? (
        <UsersList
          users={users}
          onEditUser={handleEditUserClick}
          onDeleteUser={handleDeleteUser}
        />
      ) : (
        <GroupsList
          groups={groups}
          onEditGroup={handleEditGroupClick}
          onDeleteGroup={handleDeleteGroup}
        />
      )}

      {/* Modals */}
      {showAddUser && (
        <AddUserModal
          onClose={() => setShowAddUser(false)}
          onSave={handleAddUser}
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