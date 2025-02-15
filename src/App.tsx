import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/auth/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AssetManagement from './pages/AssetManagement';
import DocuVault from './pages/DocuVault';
import Marketplace from './pages/Marketplace';
import Reports from './pages/Reports';
import AssetCreation from './pages/AssetCreation';
import AssetDetails from './pages/AssetDetails';
import AssetInvestorView from './pages/AssetInvestorView';
import AssetEdit from './pages/AssetEdit';
import Settings from './pages/Settings';
import GeneralSettings from './pages/Settings/GeneralSettings';
import PermissionsSettings from './pages/Settings/PermissionsSettings';
import AssetSettings from './pages/Settings/AssetSettings';
import DocumentSettings from './pages/Settings/DocumentSettings';
import MarketplaceSettings from './pages/Settings/MarketplaceSettings';
import ReportsSettings from './pages/Settings/ReportsSettings';
import AIAssistant from './pages/AIAssistant';
import Activity from './pages/Activity';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="assets" element={<AssetManagement />} />
            <Route path="assets/new" element={<AssetCreation />} />
            <Route path="assets/:id" element={<AssetDetails />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="marketplace/:id" element={<AssetInvestorView />} />
            <Route path="assets/:id/edit" element={<AssetEdit />} />
            <Route path="docuvault" element={<DocuVault />} />
            <Route path="reports" element={<Reports />} />
            <Route path="ai" element={<AIAssistant />} />
            <Route path="activity" element={<Activity />} />
            <Route path="settings" element={<Settings />}>
              <Route index element={<Navigate to="/settings/general" replace />} />
              <Route path="general" element={<GeneralSettings />} />
              <Route path="permissions" element={<PermissionsSettings />} />
              <Route path="assets" element={<AssetSettings />} />
              <Route path="documents" element={<DocumentSettings />} />
              <Route path="marketplace" element={<MarketplaceSettings />} />
              <Route path="reports" element={<ReportsSettings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;