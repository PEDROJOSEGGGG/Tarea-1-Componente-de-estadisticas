import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema, type EmployeeFormData, type EmployeeFormInput } from '../schemas/employeeSchema';
import type { Employee } from '../types';

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

function FormField({ label, error, children, required = false }: { label: string; error?: string; children: ReactNode; required?: boolean; }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
        {label}
        {required && <span style={{ color: '#ef4444', marginLeft: '4px' }} aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p style={{ marginTop: '4px', fontSize: '11px', color: '#dc2626' }} role="alert">{error}</p>
      )}
    </div>
  );
}

function EmployeeForm({ employee, onSubmit, onCancel, isLoading = false, error }: EmployeeFormProps) {
  const isEditing = !!employee;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<EmployeeFormInput, unknown, EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: '',
      email: '',
      position: '',
      department: 'Tecnologia',
      salary: 0,
      hireDate: new Date().toISOString().split('T')[0],
      role: 'employee',
      status: 'active',
      phone: '',
      avatarUrl: '',
    },
  });

  const watchedName = watch('name');
  const watchedPosition = watch('position');
  const watchedEmail = watch('email');

  useEffect(() => {
    if (employee) {
      reset({
        name: employee.name,
        email: employee.email,
        position: employee.position,
        department: employee.department,
        salary: employee.salary,
        hireDate: employee.hireDate,
        role: employee.role,
        status: employee.status,
        phone: employee.phone || '',
        avatarUrl: employee.avatarUrl || '',
      });
    }
  }, [employee, reset]);

  useEffect(() => {
    const normalizedEmail = watchedEmail?.trim().toLowerCase() ?? '';
    if (normalizedEmail.includes('@empresa.com')) {
      setValue('department', 'Tecnologia', { shouldDirty: true });
    }
  }, [watchedEmail, setValue]);

  const handleCancelClick = () => {
    if (isDirty && !window.confirm('Tienes cambios sin guardar. ¿Deseas salir sin guardar?')) {
      return;
    }
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'grid', gap: '16px' }}>
      {(watchedName || watchedPosition) && (
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '10px 12px', color: '#1d4ed8', fontSize: '12px' }}>
          {watchedName || 'Empleado'} — {watchedPosition || 'Sin cargo'}
        </div>
      )}
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 12px', borderRadius: '8px', fontSize: '13px' }} role="alert">
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <FormField label="Nombre completo" error={errors.name?.message} required>
          <input
            {...register('name')}
            type="text"
            placeholder="Ana García"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.name ? '#fca5a5' : '#cbd5e1'}`,
              borderRadius: '8px',
              fontSize: '14px',
              background: errors.name ? '#fef2f2' : '#fff',
              boxSizing: 'border-box',
            }}
            aria-required="true"
          />
        </FormField>

        <FormField label="Correo electrónico" error={errors.email?.message} required>
          <input
            {...register('email')}
            type="email"
            placeholder="ana@empresa.com"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.email ? '#fca5a5' : '#cbd5e1'}`,
              borderRadius: '8px',
              fontSize: '14px',
              background: errors.email ? '#fef2f2' : '#fff',
              boxSizing: 'border-box',
            }}
            aria-required="true"
          />
        </FormField>

        <FormField label="Cargo" error={errors.position?.message} required>
          <input
            {...register('position')}
            type="text"
            placeholder="Desarrolladora Frontend"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.position ? '#fca5a5' : '#cbd5e1'}`,
              borderRadius: '8px',
              fontSize: '14px',
              background: errors.position ? '#fef2f2' : '#fff',
              boxSizing: 'border-box',
            }}
            aria-required="true"
          />
        </FormField>

        <FormField label="Departamento" error={errors.department?.message} required>
          <select
            {...register('department')}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.department ? '#fca5a5' : '#cbd5e1'}`,
              borderRadius: '8px',
              fontSize: '14px',
              background: errors.department ? '#fef2f2' : '#fff',
              boxSizing: 'border-box',
            }}
            aria-required="true"
          >
            <option value="">Selecciona...</option>
            {['Tecnologia', 'Recursos Humanos', 'Finanzas', 'Operaciones', 'Ventas'].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Salario (GTQ)" error={errors.salary?.message} required>
          <input
            {...register('salary')}
            type="number"
            min="0"
            step="100"
            placeholder="8500"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.salary ? '#fca5a5' : '#cbd5e1'}`,
              borderRadius: '8px',
              fontSize: '14px',
              background: errors.salary ? '#fef2f2' : '#fff',
              boxSizing: 'border-box',
            }}
            aria-required="true"
          />
        </FormField>

        <FormField label="Fecha de ingreso" error={errors.hireDate?.message} required>
          <input
            {...register('hireDate')}
            type="date"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.hireDate ? '#fca5a5' : '#cbd5e1'}`,
              borderRadius: '8px',
              fontSize: '14px',
              background: errors.hireDate ? '#fef2f2' : '#fff',
              boxSizing: 'border-box',
            }}
            aria-required="true"
          />
        </FormField>

        <FormField label="Rol del sistema" error={errors.role?.message}>
          <select
            {...register('role')}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.role ? '#fca5a5' : '#cbd5e1'}`,
              borderRadius: '8px',
              fontSize: '14px',
              background: errors.role ? '#fef2f2' : '#fff',
              boxSizing: 'border-box',
            }}
          >
            <option value="employee">Empleado</option>
            <option value="hr">RRHH</option>
            <option value="admin">Administrador</option>
          </select>
        </FormField>

        <FormField label="Estado" error={errors.status?.message}>
          <select
            {...register('status')}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.status ? '#fca5a5' : '#cbd5e1'}`,
              borderRadius: '8px',
              fontSize: '14px',
              background: errors.status ? '#fef2f2' : '#fff',
              boxSizing: 'border-box',
            }}
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="on_leave">En permiso</option>
          </select>
        </FormField>

        <FormField label="Teléfono (opcional)" error={errors.phone?.message}>
          <input
            {...register('phone')}
            type="tel"
            placeholder="+502 1234-5678"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.phone ? '#fca5a5' : '#cbd5e1'}`,
              borderRadius: '8px',
              fontSize: '14px',
              background: errors.phone ? '#fef2f2' : '#fff',
              boxSizing: 'border-box',
            }}
          />
        </FormField>

        <FormField label="URL de avatar (opcional)" error={errors.avatarUrl?.message}>
          <input
            {...register('avatarUrl')}
            type="url"
            placeholder="https://..."
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.avatarUrl ? '#fca5a5' : '#cbd5e1'}`,
              borderRadius: '8px',
              fontSize: '14px',
              background: errors.avatarUrl ? '#fef2f2' : '#fff',
              boxSizing: 'border-box',
            }}
          />
        </FormField>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
        <button
          type="button"
          onClick={handleCancelClick}
          disabled={isLoading}
          style={{
            padding: '10px 16px',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            background: '#fff',
            color: '#475569',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.5 : 1,
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading || (!isDirty && isEditing)}
          style={{
            padding: '10px 16px',
            border: 'none',
            borderRadius: '8px',
            background: '#1e40af',
            color: '#fff',
            cursor: isLoading || (!isDirty && isEditing) ? 'not-allowed' : 'pointer',
            opacity: isLoading || (!isDirty && isEditing) ? 0.5 : 1,
            minWidth: '130px',
          }}
        >
          {isLoading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear empleado'}
        </button>
      </div>
    </form>
  );
}

export default EmployeeForm;
