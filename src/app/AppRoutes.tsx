import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './main/Login';
import PrivateRoute from '../core/auth/PrivateRoute';
import Layout from '../core/layout/Layout';
import Dashboard from './main/Dashboard';
import AssetManagement from './main/AssetManagement';
import AssetCreation from './main/AssetCreation';
import AssetDetails from './main/AssetDetails';
import Marketplace from './main/Marketplace';
import AssetInvestorView from './main/AssetInvestorView';
import AssetEdit from './main/AssetEdit';
import DocuVault from './main/DocuVault';
import Reports from './main/Reports';
import AIAssistant from './main/AIAssistant';
import Activity from './main/Activity';
import Settings from './Settings';
import GeneralSettings from './Settings/GeneralSettings';
import PermissionsSettings from './Settings/PermissionsSettings';
import AssetSettings from './Settings/AssetSettings';
import DocumentSettings from './Settings/DocumentSettings';
import MarketplaceSettings from './Settings/MarketplaceSettings';
import ReportsSettings from './Settings/ReportsSettings';
import PrivateSettingsRoute from '../core/auth/PrivateSettingsRoute';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="assets" element={<AssetManagement />} />
        <Route path="assets/new" element={<AssetCreation />} />
        <Route path="assets/:id" element={<AssetDetails />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="marketplace/:id" element={<AssetInvestorView />} />
        <Route path="assets/:id/edit" element={<AssetEdit />} />
        <Route path="docuvault" element={<DocuVault />} />
        <Route path="analytics" element={<Reports />} />
        <Route path="ai" element={<AIAssistant />} />
        <Route path="activity" element={<Activity />} />
        <Route path="admin" element={<PrivateSettingsRoute><Settings /></PrivateSettingsRoute>}>
          <Route index element={<Navigate to="/admin/general" replace />} />
          <Route path="general" element={<GeneralSettings />} />
          <Route path="user-management" element={<PermissionsSettings />} />
          <Route path="assets" element={<AssetSettings />} />
          <Route path="documents" element={<DocumentSettings />} />
          <Route path="marketplace" element={<MarketplaceSettings />} />
          <Route path="reports" element={<ReportsSettings />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;