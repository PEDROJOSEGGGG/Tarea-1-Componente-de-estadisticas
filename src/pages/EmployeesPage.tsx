// src/pages/EmployeesPage.tsx
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Employee, Department, EmployeeStatus } from '../types';
import EmployeeCard from '../components/EmployeeCard';
import StatsBadge from '../components/StatsBadge';
import FormField from '../components/FormField';
import Modal from '../components/Modal';
import EmployeeForm from '../components/EmployeeForm';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '../hooks/useEmployees';
import type { EmployeeFormData } from '../schemas/employeeSchema';

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

const nextStatus: Record<EmployeeStatus, EmployeeStatus> = {
  active: 'on_leave',
  on_leave: 'inactive',
  inactive: 'active',
};

function EmployeesPage() {
  const navigate = useNavigate();

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
  const activeEmployees = allEmployees.filter((emp) => emp.status === 'active').length;
  const onLeaveEmployees = allEmployees.filter((emp) => emp.status === 'on_leave').length;
  const inactiveEmployees = allEmployees.filter((emp) => emp.status === 'inactive').length;

  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSelectEmployee = useCallback((employee: Employee) => {
    navigate(`/empleados/${employee.id}`);
  }, [navigate]);

  const handleDeleteEmployee = useCallback((id: number) => {
    if (!confirm('¿Estás seguro de eliminar este empleado?')) return;
    deleteEmployee.mutate(id);
  }, [deleteEmployee]);

  const handleToggleStatus = useCallback((employee: Employee) => {
    updateEmployee.mutate({ id: employee.id, data: { status: nextStatus[employee.status] } });
  }, [updateEmployee]);

  const handleOpenCreate = useCallback(() => {
    setEditingEmployee(undefined);
    setSubmitError(null);
    setModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((employee: Employee) => {
    setEditingEmployee(employee);
    setSubmitError(null);
    setModalOpen(true);
  }, []);

  const handleSubmit = useCallback(async (formData: EmployeeFormData) => {
    setSubmitError(null);

    try {
      if (editingEmployee) {
        await updateEmployee.mutateAsync({ id: editingEmployee.id, data: formData });
      } else {
        await createEmployee.mutateAsync(formData);
      }
      setModalOpen(false);
    } catch {
      setSubmitError('No se pudo guardar el empleado. Intenta de nuevo.');
    }
  }, [editingEmployee, createEmployee, updateEmployee]);

  const departments: Department[] = ['Tecnologia', 'Recursos Humanos', 'Finanzas', 'Operaciones', 'Ventas'];
  const statuses: EmployeeStatus[] = ['active', 'inactive', 'on_leave'];
  const statusLabels: Record<EmployeeStatus, string> = {
    active: 'Activo',
    inactive: 'Inactivo',
    on_leave: 'En permiso',
  };
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1e293b' }}>Gestión de Empleados</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b' }}>
            {loading ? 'Cargando...' : `${employees.length} de ${totalEmployees} empleados`}
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          style={{
            padding: '8px 16px',
            background: '#1e40af',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          + Nuevo empleado
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <StatsBadge label="Total de empleados" value={totalEmployees} color="#2563eb" />
        <StatsBadge label="Empleados activos" value={activeEmployees} color="#16a34a" />
        <StatsBadge label="Empleados en permiso" value={onLeaveEmployees} color="#ca8a04" />
        <StatsBadge label="Empleados inactivos" value={inactiveEmployees} color="#d44444" />
      </div>

      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        marginBottom: '24px',
        padding: '16px',
        background: 'white',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
      }}>
        <FormField label="Buscar" style={{ flex: '1', minWidth: '220px' }}>
          <input
            type="text"
            placeholder="Buscar por nombre, email o cargo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={formFieldStyle}
          />
        </FormField>

        <FormField label="Departamento" style={{ minWidth: '180px' }}>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value as Department | '')}
            style={formFieldStyle}
          >
            <option value="">Todos los departamentos</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Estado" style={{ minWidth: '160px' }}>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as EmployeeStatus | '')}
            style={formFieldStyle}
          >
            <option value="">Todos los estados</option>
            {statuses.map((status) => (
              <option key={status} value={status}>{statusLabels[status]}</option>
            ))}
          </select>
        </FormField>

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
              fontSize: '14px',
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
          <p>Cargando empleados...</p>
        </div>
      )}

      {isError && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '24px', textAlign: 'center', borderRadius: '12px' }}>
          <p style={{ color: '#b91c1c', fontWeight: 600 }}>Error al cargar los empleados</p>
          <p style={{ color: '#ef4444', marginTop: '8px' }}>
            {(queryError as Error)?.message || 'Error desconocido'}
          </p>
        </div>
      )}

      {!loading && !isError && employees.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
          <p>No se encontraron empleados con los filtros aplicados.</p>
        </div>
      )}

      {!loading && !isError && employees.length > 0 && (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {employees.map((employee) => (
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
                  boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                }}
              >
                ×
              </button>
              <button
                onClick={() => handleOpenEdit(employee)}
                aria-label="Editar empleado"
                title="Editar empleado"
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '20px',
                  zIndex: 1,
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '2px solid white',
                  background: '#2563eb',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                  lineHeight: '18px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                }}
              >
                ✎
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

      <Modal
        isOpen={modalOpen}
        title={editingEmployee ? `Editar: ${editingEmployee.name}` : 'Nuevo empleado'}
        onClose={() => setModalOpen(false)}
      >
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          isLoading={createEmployee.isPending || updateEmployee.isPending}
          error={submitError}
        />
      </Modal>
    </div>
  );
}

export default EmployeesPage;