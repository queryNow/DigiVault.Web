import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  BarChart as BarChartIcon,
  Building2,
  DollarSign,
  Users,
  FileText
} from 'lucide-react';
import { useAssetStore } from '../../utils/store/assets';
import OverviewTab from '../../core/components/Reports/tabs/OverviewTab';
import AssetsTab from '../../core/components/Reports/tabs/AssetsTab';
import FinancialTab from '../../core/components/Reports/tabs/FinancialTab';
import InvestorsTab from '../../core/components/Reports/tabs/InvestorsTab';
import DocumentsTab from '../../core/components/Reports/tabs/DocumentsTab';
import ReportHeader from '../../core/components/Reports/ReportHeader';
import ReportTabs from '../../core/components/Reports/ReportTabs';

const REPORT_TABS = [
  { id: 'overview', name: 'Overview', icon: BarChartIcon },
  { id: 'assets', name: 'Asset Analytics', icon: Building2 },
  { id: 'financial', name: 'Financial Reports', icon: DollarSign },
  { id: 'investors', name: 'Investor Analytics', icon: Users },
  { id: 'documents', name: 'Document Analytics', icon: FileText }
];

const TIME_RANGES = [
  { id: '7d', name: 'Last 7 days' },
  { id: '30d', name: 'Last 30 days' },
  { id: '90d', name: 'Last 90 days' },
  { id: '12m', name: 'Last 12 months' },
  { id: 'ytd', name: 'Year to date' },
  { id: 'all', name: 'All time' }
];

export default function Reports() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const { assets } = useAssetStore();

  // Set active tab from location state if provided
  useEffect(() => {
    if (location.state?.tab && REPORT_TABS.some(tab => tab.id === location.state.tab)) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  // Calculate metrics
  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const activeAssets = assets.filter(asset => asset.status === 'published').length;
  const averageReturn = assets.reduce((sum, asset) => sum + Number(asset.expectedReturn), 0) / assets.length;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'assets':
        return <AssetsTab />;
      case 'financial':
        return (
          <FinancialTab
            totalAssetValue={totalAssetValue}
            averageReturn={averageReturn}
            activeAssets={activeAssets}
          />
        );
      case 'investors':
        return <InvestorsTab />;
      case 'documents':
        return <DocumentsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ReportHeader
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        timeRanges={TIME_RANGES}
      />

      <ReportTabs
        tabs={REPORT_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {renderTabContent()}
    </div>
  );
}