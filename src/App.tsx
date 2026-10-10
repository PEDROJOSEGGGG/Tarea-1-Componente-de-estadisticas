// src/App.tsx
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './layouts/Header';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import RequireRole from './components/RequireRole';
import { useAuthStore } from './store/authStore';

const SESSION_CHECK_MS = 4 * 60 * 1000; // revisar el token cada 4 minutos

// Layout con Header para páginas autenticadas
function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header user={user ?? undefined} onLogout={handleLogout} />
      <main>{children}</main>
    </div>
  );
}

function App() {
  const verifySession = useAuthStore((state) => state.verifySession);

  // Renueva el access token en segundo plano antes de que el usuario
  // se tope con un 401
  useEffect(() => {
    verifySession();
    const timer = setInterval(verifySession, SESSION_CHECK_MS);
    return () => clearInterval(timer);
  }, [verifySession]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Empleados: solo ADMIN y HR_MANAGER */}
        <Route path="/empleados" element={
          <ProtectedRoute>
            <AppLayout>
              <RequireRole permission="viewEmployees">
                <EmployeesPage />
              </RequireRole>
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/empleados/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <RequireRole permission="viewEmployees">
                <EmployeeDetailPage />
              </RequireRole>
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Redirigir raíz según autenticación */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: { fontSize: '14px', borderRadius: '8px' },
          error: { duration: 6000 },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
