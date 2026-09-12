// src/pages/EmployeesPage.tsx
import { useState, useEffect, useCallback } from 'react';
import type { Employee, Department, EmployeeStatus, EmployeeRole } from '../types';
import EmployeeCard from '../components/EmployeeCard';
import  StatsBadge from "../components/StatsBadge";
import FormField from "../components/FormField";
import Modal from "../components/Modal";
import { useEmployeeStore } from '../store/employeeStore';

function EmployeesPage() {
  const { employees, isLoading: loading, error, fetchEmployees, addEmployee, updateEmployee, deleteEmployee } = useEmployeeStore();

  // Estado de los filtros
  const [search, setSearch] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<EmployeeStatus | ''>('');

  // Estado del formulario
  const [showForm, setShowForm] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPosition, setNewPosition] = useState<string>('');
  const [newDepartment, setNewDepartment] = useState<Department>('Tecnologia');
  const [newSalary, setNewSalary] = useState<string>('');
  const [newHireDate, setNewHireDate] = useState<string>('');
  const [newStatus, setNewStatus] = useState<EmployeeStatus>('active');
  const [newRole, setNewRole] = useState<EmployeeRole>('employee');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newAvatarUrl, setNewAvatarUrl] = useState<string>('');

  useEffect(() => {
    void fetchEmployees();
  }, [fetchEmployees]);

  // Filtrar empleados según los criterios activos
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
                          emp.email.toLowerCase().includes(search.toLowerCase()) ||
                          emp.position.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment = !selectedDepartment || emp.department === selectedDepartment;
    const matchesStatus = !selectedStatus || emp.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Estadísticas generales (sobre el total de empleados, no sobre el filtro activo)
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const onLeaveEmployees = employees.filter(emp => emp.status === 'on_leave').length;
  const inactiveEmployees = employees.filter(emp => emp.status === 'inactive').length;

  const handleSelectEmployee = useCallback((employee: Employee) => {
    alert(`Empleado: ${employee.name}\nCargo: ${employee.position}\nDepartamento: ${employee.department}`);
  }, []);

  const handleDeleteEmployee = useCallback((id: number) => {
    if (!confirm('¿Estás seguro de eliminar este empleado?')) return;
    deleteEmployee(id);
  }, [deleteEmployee]);

  const handleToggleStatus = useCallback((employee: Employee) => {
    const nextStatus: Record<EmployeeStatus, EmployeeStatus> = {
      active: 'on_leave',
      on_leave: 'inactive',
      inactive: 'active',
    };
    updateEmployee(employee.id, { status: nextStatus[employee.status] });
  }, [updateEmployee]);

  // Handler para agregar empleado
  const handleAddEmployee = useCallback(() => {
    if (!newName.trim() || !newEmail.trim() || !newPosition.trim() || !newHireDate) return;

    const added = addEmployee({
      name: newName.trim(),
      email: newEmail.trim(),
      position: newPosition.trim(),
      department: newDepartment,
      salary: Number(newSalary) || 0,
      hireDate: newHireDate,
      status: newStatus,
      role: newRole,
      ...(newPhone.trim() && { phone: newPhone.trim() }),
      ...(newAvatarUrl.trim() && { avatarUrl: newAvatarUrl.trim() }),
    });

    if (!added) return;

    setNewName('');
    setNewEmail('');
    setNewPosition('');
    setNewDepartment('Tecnologia');
    setNewSalary('');
    setNewHireDate('');
    setNewStatus('active');
    setNewRole('employee');
    setNewPhone('');
    setNewAvatarUrl('');
    setShowForm(false);
  }, [addEmployee, newName, newEmail, newPosition, newDepartment, newSalary, newHireDate, newStatus, newRole, newPhone, newAvatarUrl]);

  // Listas y diccionarios de apoyo
  const departments: Department[] = ['Tecnologia', 'Recursos Humanos', 'Finanzas', 'Operaciones', 'Ventas'];
  const statuses: EmployeeStatus[] = ['active', 'inactive', 'on_leave'];
  const statusLabels: Record<EmployeeStatus, string> = {
    active: 'Activo',
    inactive: 'Inactivo',
    on_leave: 'En permiso',
  };
  const roles: EmployeeRole[] = ['employee', 'hr', 'admin'];
  const roleLabels: Record<EmployeeRole, string> = {
    employee: 'Empleado',
    hr: 'Recursos Humanos',
    admin: 'Administrador',
  };

  // Estilos reutilizables
  const formFieldStyle = {
    padding: '8px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#1e293b',
    background: 'white',
    width: '100%',
    boxSizing: 'border-box' as const,
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Encabezado */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1e293b' }}>Gestión de Empleados</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b' }}>
            {filteredEmployees.length} de {employees.length} empleados
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '8px 16px',
            background: '#1e40af',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          + Agregar empleado
        </button>
      </div>

      {/* Estadísticas */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <StatsBadge label="Total de empleados" value={totalEmployees} color="#2563eb" />
        <StatsBadge label="Empleados activos" value={activeEmployees} color="#16a34a" />
        <StatsBadge label="Empleados en permiso" value={onLeaveEmployees} color="#ca8a04" />
        <StatsBadge label="Empleados inactivos" value={inactiveEmployees} color="#d44444" />
      </div>

      {/* Formulario dentro de un modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Nuevo empleado"
      >
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <FormField label="Nombre *">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                autoFocus
                style={formFieldStyle}
              />
            </FormField>

            <FormField label="Email *">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="juan.perez@empresa.com"
                style={formFieldStyle}
              />
            </FormField>

            <FormField label="Cargo *">
              <input
                type="text"
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                placeholder="Ej. Analista de Ventas"
                style={formFieldStyle}
              />
            </FormField>

            <FormField label="Departamento *">
              <select
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value as Department)}
                style={formFieldStyle}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Salario mensual *">
              <input
                type="number"
                min="0"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                placeholder="Ej. 8500"
                style={formFieldStyle}
              />
            </FormField>

            <FormField label="Fecha de ingreso *">
              <input
                type="date"
                value={newHireDate}
                onChange={(e) => setNewHireDate(e.target.value)}
                style={formFieldStyle}
              />
            </FormField>

            <FormField label="Estado *">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as EmployeeStatus)}
                style={formFieldStyle}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{statusLabels[status]}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Rol *">
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as EmployeeRole)}
                style={formFieldStyle}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{roleLabels[role]}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Teléfono (opcional)">
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Ej. 5555-5555"
                style={formFieldStyle}
              />
            </FormField>

            <FormField label="URL de foto (opcional)">
              <input
                type="text"
                value={newAvatarUrl}
                onChange={(e) => setNewAvatarUrl(e.target.value)}
                placeholder="https://..."
                style={formFieldStyle}
              />
            </FormField>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleAddEmployee}
              style={{
                padding: '8px 16px',
                background: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Guardar
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                padding: '8px 16px',
                background: '#e2e8f0',
                color: '#475569',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      {error && (
        <div style={{
          background: '#fee2e2',
          color: '#dc2626',
          padding: '10px 12px',
          borderRadius: '6px',
          marginBottom: '16px',
          fontSize: '13px',
        }}>
          {error}
        </div>
      )}

      {/* Barra de filtros */}
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        marginBottom: '24px',
        padding: '16px',
        background: 'white',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        {/* Búsqueda por texto */}
        <FormField label="Buscar" style={{ flex: '1', minWidth: '220px' }}>
          <input
            type="text"
            placeholder="Buscar por nombre, email o cargo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={formFieldStyle}
          />
        </FormField>

        {/* Filtro por departamento */}
        <FormField label="Departamento" style={{ minWidth: '180px' }}>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value as Department | '')}
            style={formFieldStyle}
          >
            <option value="">Todos los departamentos</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </FormField>

        {/* Filtro por estado */}
        <FormField label="Estado" style={{ minWidth: '160px' }}>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as EmployeeStatus | '')}
            style={formFieldStyle}
          >
            <option value="">Todos los estados</option>
            {statuses.map(status => (
              <option key={status} value={status}>{statusLabels[status]}</option>
            ))}
          </select>
        </FormField>

        {/* Botón limpiar filtros */}
        {(search || selectedDepartment || selectedStatus) && (
          <button
            onClick={() => {
              setSearch('');
              setSelectedDepartment('');
              setSelectedStatus('');
            }}
            style={{
              padding: '8px 12px',
              background: '#fee2e2',
              color: '#dc2626',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Estado de carga */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
          <p>Cargando empleados...</p>
        </div>
      )}

      {/* Sin resultados */}
      {!loading && filteredEmployees.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
          <p>No se encontraron empleados con los filtros aplicados.</p>
        </div>
      )}

      {/* Lista de empleados */}
      {!loading && filteredEmployees.length > 0 && (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {filteredEmployees.map(employee => (
            <div key={employee.id} style={{ position: 'relative' }}>
              <button
                onClick={() => handleDeleteEmployee(employee.id)}
                aria-label="Eliminar empleado"
                title="Eliminar empleado"
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  zIndex: 1,
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '2px solid white',
                  background: '#ef4444',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  lineHeight: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.25)'
                }}
              >
                ×
              </button>
              <EmployeeCard
                employee={employee}
                onSelect={handleSelectEmployee}
                onToggleStatus={handleToggleStatus}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployeesPage;