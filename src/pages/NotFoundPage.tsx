// src/pages/NotFoundPage.tsx
import { Link, useLocation } from 'react-router-dom';

function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '72px', fontWeight: 800, color: '#1e40af', margin: 0 }}>404</p>
        <h2 style={{ color: '#1e293b', margin: '8px 0' }}>Página no encontrada</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
          No existe nada en <code>{pathname}</code>
        </p>
        <Link
          to="/dashboard"
          style={{ padding: '10px 20px', background: '#1e40af', color: 'white', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
