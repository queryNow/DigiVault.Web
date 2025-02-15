import { create } from 'zustand';

export interface Investor {
  id: string;
  name: string;
  email: string;
  type: 'Individual' | 'Institutional';
  status: 'Active' | 'Inactive';
  accreditationStatus: 'Accredited' | 'Non-Accredited';
  investmentPreferences: string[];
  totalInvested: number;
  portfolioValue: number;
  joinDate: string;
  lastActivity: string;
  riskProfile: 'Conservative' | 'Moderate' | 'Aggressive';
  location: {
    country: string;
    region: string;
  };
  investmentHistory: {
    assetId: string;
    amount: number;
    date: string;
    type: 'Buy' | 'Sell';
  }[];
}

interface InvestorAnalytics {
  totalInvestors: number;
  activeInvestors: number;
  totalInvestment: number;
  averageInvestment: number;
  byType: Record<string, number>;
  byAccreditation: Record<string, number>;
  byRiskProfile: Record<string, number>;
  byRegion: Record<string, number>;
  investmentTrends: {
    month: string;
    newInvestors: number;
    totalInvestment: number;
    transactions: number;
  }[];
  topInvestors: {
    id: string;
    name: string;
    totalInvested: number;
    portfolioValue: number;
    riskProfile: string;
  }[];
  recentActivity: {
    type: string;
    count: number;
    change: number;
  }[];
}

interface InvestorStore {
  investors: Investor[];
  analytics: InvestorAnalytics | null;
  loading: boolean;
  error: string | null;
  fetchInvestors: () => Promise<void>;
  calculateAnalytics: () => void;
}

// Mock data
const MOCK_INVESTORS: Investor[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    type: 'Individual',
    status: 'Active',
    accreditationStatus: 'Accredited',
    investmentPreferences: ['Real Estate', 'Fixed Income'],
    totalInvested: 500000,
    portfolioValue: 575000,
    joinDate: '2023-01-15',
    lastActivity: '2024-03-20',
    riskProfile: 'Moderate',
    location: {
      country: 'United States',
      region: 'North America'
    },
    investmentHistory: [
      { assetId: '1', amount: 250000, date: '2023-02-01', type: 'Buy' },
      { assetId: '2', amount: 250000, date: '2023-06-15', type: 'Buy' }
    ]
  },
  // Add more mock investors...
];

export const useInvestorStore = create<InvestorStore>((set, get) => ({
  investors: [],
  analytics: null,
  loading: false,
  error: null,

  fetchInvestors: async () => {
    set({ loading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ investors: MOCK_INVESTORS, loading: false });
      get().calculateAnalytics();
    } catch (error) {
      set({ error: 'Failed to fetch investors', loading: false });
    }
  },

  calculateAnalytics: () => {
    const { investors } = get();
    
    if (investors.length === 0) return;

    const analytics: InvestorAnalytics = {
      totalInvestors: investors.length,
      activeInvestors: investors.filter(i => i.status === 'Active').length,
      totalInvestment: investors.reduce((sum, i) => sum + i.totalInvested, 0),
      averageInvestment: investors.reduce((sum, i) => sum + i.totalInvested, 0) / investors.length,
      
      byType: investors.reduce((acc, i) => {
        acc[i.type] = (acc[i.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      
      byAccreditation: investors.reduce((acc, i) => {
        acc[i.accreditationStatus] = (acc[i.accreditationStatus] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      
      byRiskProfile: investors.reduce((acc, i) => {
        acc[i.riskProfile] = (acc[i.riskProfile] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      
      byRegion: investors.reduce((acc, i) => {
        acc[i.location.region] = (acc[i.location.region] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),

      // Mock monthly trends
      investmentTrends: [
        { month: 'Jan', newInvestors: 12, totalInvestment: 1500000, transactions: 45 },
        { month: 'Feb', newInvestors: 15, totalInvestment: 1800000, transactions: 52 },
        { month: 'Mar', newInvestors: 18, totalInvestment: 2200000, transactions: 58 },
        { month: 'Apr', newInvestors: 14, totalInvestment: 1900000, transactions: 48 },
        { month: 'May', newInvestors: 20, totalInvestment: 2500000, transactions: 62 },
        { month: 'Jun', newInvestors: 22, totalInvestment: 2800000, transactions: 65 }
      ],

      // Top investors by portfolio value
      topInvestors: investors
        .sort((a, b) => b.portfolioValue - a.portfolioValue)
        .slice(0, 5)
        .map(i => ({
          id: i.id,
          name: i.name,
          totalInvested: i.totalInvested,
          portfolioValue: i.portfolioValue,
          riskProfile: i.riskProfile
        })),

      // Recent activity metrics
      recentActivity: [
        { type: 'New Investors', count: 22, change: 15.3 },
        { type: 'Active Traders', count: 156, change: 8.7 },
        { type: 'Portfolio Updates', count: 342, change: -5.2 }
      ]
    };

    set({ analytics });
  }
}));