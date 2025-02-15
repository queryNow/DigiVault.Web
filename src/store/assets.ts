import { create } from 'zustand';
import { apiService } from '../services/api/ApiService';
import { Asset } from '../types';

interface AssetStore {
  assets: Asset[];
  selectedAsset: Asset | null;
  loading: boolean;
  error: string | null;
  fetchAssets: () => Promise<void>;
  getAssetById: (id: string) => Asset | undefined;
  createAsset: (asset: Omit<Asset, 'id' | 'createdAt'>) => Promise<void>;
  updateAsset: (id: string, asset: Partial<Asset>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
}

export const useAssetStore = create<AssetStore>((set, get) => ({
  assets: [],
  selectedAsset: null,
  loading: false,
  error: null,

  fetchAssets: async () => {
    set({ loading: true });
    try {
      const assets = await apiService.getAssets();
      set({ assets, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch assets', loading: false });
    }
  },

  getAssetById: (id: string) => {
    return get().assets.find(asset => asset.id === id);
  },

  createAsset: async (asset: Omit<Asset, 'id' | 'createdAt'>) => {
    set({ loading: true });
    try {
      const newAsset = await apiService.createAsset(asset);
      set(state => ({ assets: [...state.assets, newAsset], loading: false }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to create asset', loading: false });
    }
  },

  updateAsset: async (id: string, assetUpdate: Partial<Asset>) => {
    set({ loading: true });
    try {
      const updatedAsset = await apiService.updateAsset(id, assetUpdate);
      set(state => ({
        assets: state.assets.map(asset =>
          asset.id === id ? updatedAsset : asset
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to update asset', loading: false });
    }
  },

  deleteAsset: async (id: string) => {
    set({ loading: true });
    try {
      await apiService.deleteAsset(id);
      set(state => ({
        assets: state.assets.filter(asset => asset.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete asset', loading: false });
    }
  }
}));