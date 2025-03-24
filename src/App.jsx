import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import useAuth here
import ProductDashboard from './components/ProductDashboard';
import LoginForm from './components/logIn';
import RegisterForm from './components/registationForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route 
            path="/products" 
            element={
              <ProtectedRoute>
                <ProductDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Define ProtectedRoute INSIDE App component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Now properly accessible
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default App;