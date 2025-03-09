import { BrowserRouter as Router } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './core/auth/msal-config';
import { AuthProvider } from './core/auth';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </MsalProvider>
  );
}

export default App;