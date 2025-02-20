import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './core/auth/AuthProvider';
import AppRoutes from './app/AppRoutes';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;