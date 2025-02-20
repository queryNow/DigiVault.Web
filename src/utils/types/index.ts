export interface Asset {
  id: string;
  name: string;
  status: string;
  description: string;
  value: number;
  occupancyRate: number; // Add this line
  expectedReturn: number;
  investmentTerm: number;
  assetClass: string;
  subClass: string;
  sector: string;
  location: string;
  currency: string;
  type: string;
  paymentFrequency: string;
  performance: {
    ytd: number;
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };
  riskLevel: string;
  riskFactors: string[];
  regulatoryCompliance: string[];
  investorRestrictions: string;
  signatures?: {
    required: string[];
    completed: string[];
    pending: string[];
  };
  managerName: string;
  companyName: string;
  region: string;
  country: string;
  regulatoryLicenses: string[];
  minimumInvestment: number;
  image: string;
  tenants: number;
  lastValuation: string;
  nextValuation: string;
  createdAt: string;
  updatedAt: string;
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