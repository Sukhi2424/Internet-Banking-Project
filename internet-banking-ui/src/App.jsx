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

// --- ENHANCED MODERN BANKING THEME ---
const theme = createTheme({
  palette: {
    primary: { 
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff'
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b'
    },
    success: {
      main: '#10b981',
      light: '#6ee7b7',
      dark: '#047857'
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626'
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706'
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb'
    }
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Roboto", "Helvetica Neue", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.025em'
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.875rem',
      lineHeight: 1.3,
      letterSpacing: '-0.025em'
    },
    h3: {
      fontWeight: 600,
      fontSize: '2.25rem',
      lineHeight: 1.3,
      letterSpacing: '-0.025em'
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.875rem',
      lineHeight: 1.4
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#475569'
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#64748b'
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.875rem'
    }
  },
  shape: {
    borderRadius: 12
  },
  shadows: [
    'none',
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)'
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px 0 rgb(0 0 0 / 0.15)',
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out'
          }
        },
        contained: {
          background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }
      }
    }
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
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
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