export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastLogin?: string;
  groups: string[];
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  permissions: string[];
}

export const AVAILABLE_PERMISSIONS = {
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
} as const;

export const ROLES = [
  'Administrator',
  'Asset Manager',
  'Investor',
  'Analyst',
  'Compliance Officer',
  'Risk Manager'
] as const;