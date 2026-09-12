import { useParams, useNavigate } from 'react-router-dom';
import { useEmployee } from '../hooks/useEmployees';

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const employeeId = id ? parseInt(id, 10) : null;
  const { data, isLoading, error } = useEmployee(employeeId);

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #e2e8f0',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ marginTop: '16px', color: '#64748b' }}>Cargando empleado...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px' }}>
        <div
          style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            padding: '16px',
            color: '#991b1b',
          }}
        >
          Error: {error instanceof Error ? error.message : 'No se pudo cargar el empleado'}
        </div>
        <button
          onClick={() => navigate('/empleados')}
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          ← Volver a la lista
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: '#64748b' }}>Empleado no encontrado</p>
        <button
          onClick={() => navigate('/empleados')}
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          ← Volver a la lista
        </button>
      </div>
    );
  }

  const employee = data;

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const statusColors: Record<string, string> = {
    active: '#dcfce7',
    inactive: '#fee2e2',
    on_leave: '#fef9c3',
  };

  const statusLabels: Record<string, string> = {
    active: 'Activo',
    inactive: 'Inactivo',
    on_leave: 'En permiso',
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Botón Volver */}
      <button
        onClick={() => navigate('/empleados')}
        style={{
          marginBottom: '24px',
          padding: '8px 16px',
          background: 'transparent',
          color: '#3b82f6',
          border: '1px solid #3b82f6',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        ← Volver
      </button>

      {/* Card de detalle */}
      <div
        style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Avatar + Nombre + Puesto */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              margin: '0 auto 16px',
              overflow: 'hidden',
            }}
          >
            {employee.avatarUrl ? (
              <img
                src={employee.avatarUrl}
                alt={employee.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              '👤'
            )}
          </div>
          <h1 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '28px' }}>
            {employee.name}
          </h1>
          <p style={{ margin: '0', color: '#64748b', fontSize: '16px' }}>
            {employee.position}
          </p>
        </div>

        {/* Status badge */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '6px 12px',
              background: statusColors[employee.status],
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#1e293b',
            }}
          >
            {statusLabels[employee.status]}
          </span>
        </div>

        {/* Info grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
          }}
        >
          {/* Información personal */}
          <div>
            <h3 style={{ margin: '0 0 16px 0', color: '#475569', fontSize: '14px', fontWeight: '600' }}>
              INFORMACIÓN PERSONAL
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>
                  Email
                </label>
                <p style={{ margin: '0', color: '#1e293b', fontSize: '14px' }}>
                  {employee.email}
                </p>
              </div>
              <div>
                <label style={{ display: 'block', color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>
                  Teléfono
                </label>
                <p style={{ margin: '0', color: '#1e293b', fontSize: '14px' }}>
                  {employee.phone || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Información laboral */}
          <div>
            <h3 style={{ margin: '0 0 16px 0', color: '#475569', fontSize: '14px', fontWeight: '600' }}>
              INFORMACIÓN LABORAL
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>
                  Departamento
                </label>
                <p style={{ margin: '0', color: '#1e293b', fontSize: '14px' }}>
                  {employee.department}
                </p>
              </div>
              <div>
                <label style={{ display: 'block', color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>
                  Rol
                </label>
                <p style={{ margin: '0', color: '#1e293b', fontSize: '14px', textTransform: 'uppercase' }}>
                  {employee.role}
                </p>
              </div>
            </div>
          </div>

          {/* Información financiera */}
          <div>
            <h3 style={{ margin: '0 0 16px 0', color: '#475569', fontSize: '14px', fontWeight: '600' }}>
              INFORMACIÓN FINANCIERA
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>
                  Salario
                </label>
                <p style={{ margin: '0', color: '#1e293b', fontSize: '14px', fontWeight: '600' }}>
                  {formatSalary(employee.salary)}
                </p>
              </div>
            </div>
          </div>

          {/* Información de contratación */}
          <div>
            <h3 style={{ margin: '0 0 16px 0', color: '#475569', fontSize: '14px', fontWeight: '600' }}>
              CONTRATACIÓN
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>
                  Fecha de ingreso
                </label>
                <p style={{ margin: '0', color: '#1e293b', fontSize: '14px' }}>
                  {formatDate(employee.hireDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
