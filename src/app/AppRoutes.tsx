import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './main/Login';
import PrivateRoute from '../core/auth/PrivateRoute';
import Layout from '../core/layout/Layout';
import Dashboard from './main/Dashboard';
import AssetManagement from './main/Assets/AssetManagement';
import AssetCreation from './main/Assets/AssetCreation';
import AssetDetails from './main/Assets/AssetDetails';
import Marketplace from './main/Marketplace/Marketplace';
import AssetInvestorView from './main/Marketplace/AssetInvestorView';
import AssetEdit from './main/Assets/AssetEdit';
import DocuVault from './main/DocuVault';
import Reports from './main/Reports';
import AIAssistant from './main/AIAssistant';
import Activity from './main/Activity';
import Settings from './admin';
import GeneralSettings from './admin/GeneralSettings';
import PermissionsSettings from './admin/Permissions/PermissionsSettings';
import AssetSettings from './admin/AssetSettings';
import DocumentSettings from './admin/DocumentSettings';
import MarketplaceSettings from './admin/MarketplaceSettings';
import ReportsSettings from './admin/ReportsSettings';
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
        <Route path="assets/:id/edit" element={<AssetEdit />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="marketplace/:id" element={<AssetInvestorView />} />
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