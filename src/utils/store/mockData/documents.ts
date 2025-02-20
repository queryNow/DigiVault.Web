export const mockDocuments = [
  {
    id: '1',
    name: 'Property Deed.pdf',
    type: 'Legal Document',
    category: 'Legal',
    size: 2.5,
    uploadedAt: '2024-03-15',
    lastModified: '2024-03-15',
    assetId: '1',
    assetName: 'Commercial Property A',
    lastViewed: '2024-03-20',
    status: 'active',
    uploadedBy: 'John Smith',
    version: '1.0',
    tags: ['legal', 'property', 'deed'],
    thumbnail: 'https://images.unsplash.com/photo-1568695269828-8da695a95ea5?w=800&h=600&fit=crop',
    metadata: {
      documentType: 'Legal Agreement',
      confidentiality: 'High',
      department: 'Legal',
      reviewStatus: 'Approved'
    },
    versions: [
      {
        version: '1.0',
        date: '2024-03-15',
        author: 'John Smith',
        changes: 'Initial version'
      }
    ]
  },
  // ... (keep the rest of the mock documents)
];