import React, { useState } from 'react';
import { X, Mail, Link, Clock, Shield } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
}

export default function ShareDocumentDialog({ isOpen, onClose, documentName }: Props) {
  const [shareMethod, setShareMethod] = useState<'email' | 'link'>('email');
  const [email, setEmail] = useState('');
  const [expiryDays, setExpiryDays] = useState('7');
  const [accessLevel, setAccessLevel] = useState('view');
  const [message, setMessage] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const handleShare = () => {
    if (shareMethod === 'email') {
      // Handle email sharing
      console.log('Sharing via email:', {
        email,
        expiryDays,
        accessLevel,
        message,
      });
    } else {
      // Generate sharing link
      const link = `https://example.com/share/${Math.random().toString(36).substring(7)}`;
      setGeneratedLink(link);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Share Document</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Sharing: <span className="font-medium text-gray-900">{documentName}</span>
              </p>
            </div>

            {/* Share Method Toggle */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setShareMethod('email')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
                  shareMethod === 'email'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Share via Email
                </div>
              </button>
              <button
                onClick={() => setShareMethod('link')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
                  shareMethod === 'link'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-center">
                  <Link className="w-4 h-4 mr-2" />
                  Generate Link
                </div>
              </button>
            </div>

            {shareMethod === 'email' ? (
              <>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter recipient's email"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Add a message..."
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {generatedLink ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Sharing Link
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          readOnly
                          value={generatedLink}
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <button
                          onClick={() => navigator.clipboard.writeText(generatedLink)}
                          className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
            )}

            {/* Common Settings */}
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Link Expiry
                  </div>
                </label>
                <select
                  id="expiry"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="1">1 day</option>
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="never">Never expire</option>
                </select>
              </div>

              <div>
                <label htmlFor="access" className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Access Level
                  </div>
                </label>
                <select
                  id="access"
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="view">View only</option>
                  <option value="comment">Can comment</option>
                  <option value="edit">Can edit</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {shareMethod === 'email' ? 'Send' : 'Generate Link'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}