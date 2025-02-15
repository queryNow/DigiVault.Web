export interface Asset {
  id: string;
  name: string;
  type: string;
  value: number;
  description: string;
  createdAt: string;
  documents: Document[];
  status: 'draft' | 'published' | 'archived';
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  assetId?: string;
}

export interface MarketplaceListing {
  id: string;
  assetId: string;
  price: number;
  status: 'active' | 'pending' | 'sold';
  createdAt: string;
}