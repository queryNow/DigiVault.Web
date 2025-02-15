import React from 'react';
import { Upload, FileText } from 'lucide-react';

interface DocumentsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function Documents({ formData, setFormData }: DocumentsProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newDocuments = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size / 1024 / 1024,
        type: file.type,
        category: 'Uncategorized'
      }));

      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...newDocuments]
      }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-100">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white bg-opacity-50">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500"
              >
                <span>Upload documents</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  onChange={handleFileUpload}
                />
              </label>
              <p className="pl-1 text-gray-500">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              PDF, DOC, DOCX, XLS, XLSX up to 10MB each
            </p>
          </div>
        </div>

        {formData.documents.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Uploaded Documents</h4>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul role="list" className="divide-y divide-gray-200">
                {formData.documents.map((doc: any) => (
                  <li key={doc.id}>
                    <div className="px-4 py-4 flex items-center sm:px-6">
                      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                        <div className="truncate">
                          <div className="flex text-sm">
                            <p className="font-medium text-indigo-600 truncate">{doc.name}</p>
                            <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                              ({doc.size.toFixed(2)} MB)
                            </p>
                          </div>
                          <div className="mt-2 flex">
                            <div className="flex items-center text-sm text-gray-500">
                              <FileText className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <p>{doc.type}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-5 flex-shrink-0">
                        <button
                          onClick={() => {
                            setFormData({
                              ...formData,
                              documents: formData.documents.filter((d: any) => d.id !== doc.id)
                            });
                          }}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}