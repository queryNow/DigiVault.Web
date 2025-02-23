import { FileText, Tag, Shield } from 'lucide-react';

const DOCUMENT_TYPES = [
  { id: 1, name: 'Legal Document', icon: FileText, count: 15 },
  { id: 2, name: 'Financial', icon: FileText, count: 20 },
  { id: 3, name: 'Marketing', icon: FileText, count: 8 },
  { id: 4, name: 'Technical', icon: FileText, count: 12 }
];

const METADATA_FIELDS = [
  { id: 1, name: 'Document Type', type: 'select', required: true },
  { id: 2, name: 'Confidentiality Level', type: 'select', required: true },
  { id: 3, name: 'Department', type: 'select', required: true },
  { id: 4, name: 'Expiry Date', type: 'date', required: false }
];

const RETENTION_POLICIES = [
  { id: 1, name: 'Legal Documents', duration: '7 years', autoArchive: true },
  { id: 2, name: 'Financial Reports', duration: '5 years', autoArchive: true },
  { id: 3, name: 'Marketing Materials', duration: '2 years', autoArchive: false }
];

export default function DocumentSettings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Document Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure document types, metadata fields, and retention policies
        </p>
      </div>

      {/* Document Types */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Document Types</h3>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Add Document Type
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {DOCUMENT_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <li key={type.id}>
                  <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{type.name}</div>
                        <div className="text-sm text-gray-500">{type.count} documents</div>
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      Edit
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Metadata Fields */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Metadata Fields</h3>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Add Field
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {METADATA_FIELDS.map((field) => (
              <li key={field.id}>
                <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                  <div className="flex items-center">
                    <Tag className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{field.name}</div>
                      <div className="text-sm text-gray-500">
                        Type: {field.type} • {field.required ? 'Required' : 'Optional'}
                      </div>
                    </div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Retention Policies */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Retention Policies</h3>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Add Policy
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {RETENTION_POLICIES.map((policy) => (
              <li key={policy.id}>
                <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                      <div className="text-sm text-gray-500">
                        Duration: {policy.duration} •
                        {policy.autoArchive ? ' Auto-archive enabled' : ' Manual archive'}
                      </div>
                    </div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}