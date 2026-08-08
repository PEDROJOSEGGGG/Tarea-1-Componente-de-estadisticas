import type { Employee } from '../types';

interface EmployeeCardProps {
  employee: Employee;
  onSelect?: (employee: Employee) => void;
}

const statusConfig = {
  active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Activo' },
  inactive: { bg: 'bg-red-100', text: 'text-red-800', label: 'Inactivo' },
  on_leave: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En permiso' },
};

function EmployeeCard({ employee, onSelect }: EmployeeCardProps) {
  const { name, position, department, status, avatarUrl } = employee;
  const statusStyle = statusConfig[status];

  return (
    <button
      type="button"
      onClick={() => onSelect?.(employee)}
      className="w-full rounded-xl border border-slate-200 bg-white p-5 text-left transition-all duration-200 hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-lg font-semibold text-blue-700">
          {avatarUrl ? (
            <img src={avatarUrl} alt={`Avatar de ${name}`} className="h-full w-full object-cover" />
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-900">{name}</h3>
          <p className="truncate text-sm text-slate-500">{position}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="truncate rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
          {department}
        </span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
          {statusStyle.label}
        </span>
      </div>
    </button>
  );
}

export default EmployeeCard;
