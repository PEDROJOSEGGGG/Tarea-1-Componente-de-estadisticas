import Header from './layouts/Header';
import EmployeeCard from './components/EmployeeCard';
import { mockEmployees } from './utils/mockData';
import type { Employee } from './types';

function App() {
  const handleSelectEmployee = (employee: Employee) => {
    console.log('Empleado seleccionado:', employee.name);
    alert(`Seleccionaste a ${employee.name} — ${employee.position}`);
  };

  // 📊 Totales por estado
  const total = mockEmployees.length;
  const activos = mockEmployees.filter(e => e.status === "active").length;
  const permiso = mockEmployees.filter(e => e.status === "on_leave").length;
  const inactivos = mockEmployees.filter(e => e.status === "inactive").length;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      <main style={{ padding: '24px' }}>
        <h2 style={{ marginBottom: '16px', color: '#1e293b' }}>
          Empleados ({total})
        </h2>

        {/* Panel de resumen */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, padding: '12px', border: '2px solid #3b82f6', color: '#3b82f6', borderRadius: '8px' }}>
            <strong>{total}</strong>
            <div>Total de empleados</div>
          </div>
          <div style={{ flex: 1, padding: '12px', border: '2px solid #22c55e', color: '#22c55e', borderRadius: '8px' }}>
            <strong>{activos}</strong>
            <div>Empleados activos</div>
          </div>
          <div style={{ flex: 1, padding: '12px', border: '2px solid #f97316', color: '#f97316', borderRadius: '8px' }}>
            <strong>{permiso}</strong>
            <div>Empleados en permiso</div>
          </div>
          <div style={{ flex: 1, padding: '12px', border: '2px solid #ef4444', color: '#ef4444', borderRadius: '8px' }}>
            <strong>{inactivos}</strong>
            <div>Empleados inactivos</div>
          </div>
        </div>

        {/* Cards de empleados */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {mockEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onSelect={handleSelectEmployee}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
