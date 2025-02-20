import { create } from 'zustand';
import { apiService } from '../services/api/ApiService';
import { Document } from '../utils/types';

interface DocumentStore {
  documents: Document[];
  loading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  getDocumentsByAssetId: (assetId: string) => Document[];
  addDocument: (document: Omit<Document, 'id' | 'uploadedAt'>) => Promise<void>;
  updateDocument: (id: string, document: Partial<Document>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  loading: false,
  error: null,

  fetchDocuments: async () => {
    set({ loading: true });
    try {
      const documents = await apiService.getDocuments();
      set({ documents, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch documents', loading: false });
    }
  },

  getDocumentsByAssetId: (assetId: string) => {
    return get().documents.filter(doc => doc.assetId === assetId);
  },

  addDocument: async (document: Omit<Document, 'id' | 'uploadedAt'>) => {
    set({ loading: true });
    try {
      const newDocument = await apiService.createDocument(document);
      set(state => ({ documents: [...state.documents, newDocument], loading: false }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to add document', loading: false });
    }
  },

  updateDocument: async (id: string, documentUpdate: Partial<Document>) => {
    set({ loading: true });
    try {
      const updatedDocument = await apiService.updateDocument(id, documentUpdate);
      set(state => ({
        documents: state.documents.map(doc =>
          doc.id === id ? updatedDocument : doc
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to update document', loading: false });
    }
  },

  deleteDocument: async (id: string) => {
    set({ loading: true });
    try {
      await apiService.deleteDocument(id);
      set(state => ({
        documents: state.documents.filter(doc => doc.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete document', loading: false });
    }
  }
}));