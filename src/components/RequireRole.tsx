// src/components/RequireRole.tsx
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { usePermissions, type Permission } from '../hooks/usePermissions';

interface RequireRoleProps {
  permission: Permission;
  children: ReactNode;
}

// Se usa dentro de ProtectedRoute: el usuario ya inició sesión, aquí solo
// revisamos si su rol le permite ver la página.
function RequireRole({ permission, children }: RequireRoleProps) {
  const { can, role } = usePermissions();

  if (can(permission)) return <>{children}</>;

  return (
    <div style={{ padding: '64px 24px', textAlign: 'center' }}>
      <p style={{ fontSize: '48px', margin: 0 }}>🔒</p>
      <h2 style={{ color: '#1e293b', margin: '12px 0 8px' }}>Sin acceso</h2>
      <p style={{ color: '#64748b', maxWidth: '420px', margin: '0 auto 20px' }}>
        Tu rol ({role ?? 'desconocido'}) no tiene permiso para ver esta sección.
      </p>
      <Link to="/dashboard" style={{ color: '#1e40af', fontSize: '14px' }}>
        Ir al dashboard
      </Link>
    </div>
  );
}

export default RequireRole;
