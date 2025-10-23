import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box } from '@mui/material';

// Import all of our custom components from their separate files
import Navbar from './layout/Navbar';
import AccountLayout from './components/AccountLayout';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import AdminDashboard from './components/AdminDashboard';
import ManageUsersPage from './components/ManageUsersPage';
import CalculateInterestPage from './components/CalculateInterestPage';
import TransactionReportPage from './components/TransactionReportPage';
import AccountSummary from './components/AccountSummary';
import TransactionsPage from './components/TransactionsPage';
import TransferMoneyPage from './components/TransferMoneyPage';
import TermAccountForm from './components/TermAccountForm';
import ProfilePage from './components/ProfilePage';

// --- THEME ---
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  }
});

// --- ROUTING HELPER ---
const ProtectedRoute = ({ user, children }) => {
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// --- MAIN APP COMPONENT ---
function App() {
  const [auth, setAuth] = useState({ role: null, user: null });
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user) {
      if (auth.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/account/summary');
      }
    }
  }, [auth]);

  const handleLogin = (authData) => setAuth(authData);
  const handleLogout = () => {
    setAuth({ role: null, user: null });
    navigate('/');
  };
  const handleProfileUpdate = (updatedUserData) => setAuth(prevAuth => ({ ...prevAuth, user: updatedUserData }));
  const handleTransactionSuccess = () => setRefreshKey(prevKey => prevKey + 1);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
        <Navbar auth={auth} onLogout={handleLogout} />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Container sx={{flexGrow: 1}}><LoginPage onLogin={handleLogin} /></Container>} />
          <Route path="/register" element={<Container sx={{flexGrow: 1}}><RegistrationPage /></Container>} />
          
          {/* --- THIS IS THE CORRECTED NESTED ROUTING STRUCTURE --- */}
          <Route 
            path="/account"
            element={
              <ProtectedRoute user={auth.user}>
                <Container maxWidth="xl" sx={{ my: 4 }}><AccountLayout /></Container>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="summary" replace />} />
            <Route path="summary" element={<AccountSummary user={auth.user} onTransactionSuccess={handleTransactionSuccess} />} />
            <Route path="profile" element={<ProfilePage user={auth.user} onProfileUpdate={handleProfileUpdate} />} />
            <Route path="transactions" element={<TransactionsPage user={auth.user} onTransactionSuccess={handleTransactionSuccess} />} />
            <Route path="transfer" element={<TransferMoneyPage user={auth.user} onTransactionSuccess={handleTransactionSuccess} />} />
            <Route path="create" element={<TermAccountForm customerId={auth.user?.customerId} />} />
          </Route>
          
          <Route 
            path="/admin/*"
            element={
              <ProtectedRoute user={auth.user}>
                  <Container maxWidth="xl" sx={{ my: 4 }}>
                    <Routes>
                        <Route index element={<AdminDashboard />} />
                        <Route path="manage-users" element={<ManageUsersPage />} />
                        <Route path="calculate-interest" element={<CalculateInterestPage />} />
                        <Route path="reports" element={<TransactionReportPage />} />
                    </Routes>
                  </Container>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

export default App;