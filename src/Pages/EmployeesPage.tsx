// src/pages/EmployeesPage.tsx
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Employee, Department, EmployeeStatus, EmployeeRole } from '../types';
import EmployeeCard from '../components/EmployeeCard';
import StatsBadge from '../components/StatsBadge';
import FormField from '../components/FormField';
import Modal from '../components/Modal';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '../hooks/useEmployees';

function EmployeesPage() {
  const navigate = useNavigate();
  
  // Estado de los filtros — esto sigue siendo estado LOCAL (de la UI), no del servidor
  const [search, setSearch] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<EmployeeStatus | ''>('');

  const { data, isLoading: loading, isError, error: queryError } = useEmployees({
    search: search || undefined,
    department: selectedDepartment || undefined,
    status: selectedStatus || undefined,
  });

  const employees = data?.data || [];

  const { data: allData } = useEmployees({});
  const allEmployees = useMemo(() => allData?.data ?? [], [allData]);

  const totalEmployees = allEmployees.length;
  const activeEmployees = allEmployees.filter(emp => emp.status === 'active').length;
  const onLeaveEmployees = allEmployees.filter(emp => emp.status === 'on_leave').length;
  const inactiveEmployees = allEmployees.filter(emp => emp.status === 'inactive').length;

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
  const [formError, setFormError] = useState<string | null>(null);

  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  const handleSelectEmployee = useCallback((employee: Employee) => {
    navigate(`/empleados/${employee.id}`);
  }, [navigate]);

  const handleDeleteEmployee = useCallback((id: number) => {
    if (!confirm('¿Estás seguro de eliminar este empleado?')) return;
    deleteEmployee.mutate(id);
  }, [deleteEmployee]);

  const nextStatus: Record<EmployeeStatus, EmployeeStatus> = useMemo(() => ({
    active: 'on_leave',
    on_leave: 'inactive',
    inactive: 'active',
  }), []);

  const handleToggleStatus = useCallback((employee: Employee) => {
    updateEmployee.mutate({ id: employee.id, data: { status: nextStatus[employee.status] } });
  }, [updateEmployee, nextStatus]);

  // Handler para agregar empleado
  const handleAddEmployee = useCallback(() => {
    if (!newName.trim() || !newEmail.trim() || !newPosition.trim() || !newHireDate) return;

    // El API no valida emails duplicados por nosotros, así que lo revisamos
    // del lado del cliente antes de mandar la mutación (misma regla de la Clase 6).
    const emailTaken = allEmployees.some(emp => emp.email === newEmail.trim());
    if (emailTaken) {
      setFormError(`Ya existe un empleado con el email ${newEmail.trim()}.`);
      return;
    }

    createEmployee.mutate({
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
    }, {
      onSuccess: () => {
        setFormError(null);
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
      },
      onError: () => {
        setFormError('No se pudo crear el empleado. Intenta de nuevo.');
      },
    });
  }, [allEmployees, createEmployee, newName, newEmail, newPosition, newDepartment, newSalary, newHireDate, newStatus, newRole, newPhone, newAvatarUrl]);

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
            {loading ? 'Cargando...' : `${employees.length} de ${totalEmployees} empleados`}
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
          {formError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {formError}
            </div>
          )}
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
              disabled={createEmployee.isPending}
              style={{
                padding: '8px 16px',
                background: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                opacity: createEmployee.isPending ? 0.6 : 1,
              }}
            >
              {createEmployee.isPending ? 'Guardando...' : 'Guardar'}
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

      {loading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mr-3" />
          <span>Cargando empleados...</span>
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">Error al cargar los empleados</p>
          <p className="text-red-500 text-sm mt-1">
            {(queryError as Error)?.message || 'Error desconocido'}
          </p>
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

      {!loading && !isError && employees.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
          <p>No se encontraron empleados con los filtros aplicados.</p>
        </div>
      )}

      {!loading && !isError && employees.length > 0 && (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {employees.map(employee => (
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