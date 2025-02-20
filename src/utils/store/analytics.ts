import { create } from 'zustand';
import { Document } from './documents';

interface DocumentAnalytics {
  byCategory: Record<string, number>;
  byType: Record<string, number>;
  byConfidentiality: Record<string, number>;
  byDepartment: Record<string, number>;
  byStatus: Record<string, number>;
  totalSize: number;
  documentCount: number;
  recentActivity: {
    uploads: number;
    views: number;
    updates: number;
  };
  monthlyTrends: {
    month: string;
    uploads: number;
    views: number;
    updates: number;
  }[];
}

interface AnalyticsStore {
  documentAnalytics: DocumentAnalytics | null;
  loading: boolean;
  error: string | null;
  calculateDocumentAnalytics: (documents: Document[]) => void;
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  documentAnalytics: null,
  loading: false,
  error: null,

  calculateDocumentAnalytics: (documents: Document[]) => {
    try {
      // Initialize counters
      const byCategory: Record<string, number> = {};
      const byType: Record<string, number> = {};
      const byConfidentiality: Record<string, number> = {};
      const byDepartment: Record<string, number> = {};
      const byStatus: Record<string, number> = {};
      let totalSize = 0;

      // Process documents
      documents.forEach(doc => {
        // Count by category
        byCategory[doc.category] = (byCategory[doc.category] || 0) + 1;

        // Count by type
        byType[doc.type] = (byType[doc.type] || 0) + 1;

        // Count by confidentiality
        const confidentiality = doc.metadata.confidentiality;
        byConfidentiality[confidentiality] = (byConfidentiality[confidentiality] || 0) + 1;

        // Count by department
        const department = doc.metadata.department;
        byDepartment[department] = (byDepartment[department] || 0) + 1;

        // Count by status
        byStatus[doc.status] = (byStatus[doc.status] || 0) + 1;

        // Sum total size
        totalSize += doc.size;
      });

      // Generate mock monthly trends with more realistic values
      const monthlyTrends = [
        { month: 'Jan', uploads: 45, views: 85, updates: 32 },
        { month: 'Feb', uploads: 52, views: 92, updates: 38 },
        { month: 'Mar', uploads: 58, views: 95, updates: 42 },
        { month: 'Apr', uploads: 48, views: 88, updates: 35 },
        { month: 'May', uploads: 55, views: 91, updates: 40 },
        { month: 'Jun', uploads: 62, views: 96, updates: 45 }
      ];

      set({
        documentAnalytics: {
          byCategory,
          byType,
          byConfidentiality,
          byDepartment,
          byStatus,
          totalSize,
          documentCount: documents.length,
          recentActivity: {
            uploads: documents.filter(d => {
              const uploadDate = new Date(d.uploadedAt);
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              return uploadDate >= thirtyDaysAgo;
            }).length,
            views: 156, // Mock data
            updates: 42  // Mock data
          },
          monthlyTrends
        },
        loading: false,
        error: null
      });
    } catch (error) {
      set({ error: 'Failed to calculate analytics', loading: false });
    }
  }
}));