// src/pages/DashboardPage.tsx
import { Link } from 'react-router-dom';
import { mockEmployees } from '../utils/mockData';
import { useAuthStore } from '../store/authStore';

function DashboardPage() {
  const total = mockEmployees.length;
  const active = mockEmployees.filter(e => e.status === 'active').length;
  const onLeave = mockEmployees.filter(e => e.status === 'on_leave').length;

  const userName = useAuthStore((state) => state.user?.name) || 'invitado';

  const stats = [
    { label: 'Total empleados', value: total, bg: 'bg-blue-100', text: 'text-blue-800' },
    { label: 'Activos', value: active, bg: 'bg-green-100', text: 'text-green-800' },
    { label: 'En permiso', value: onLeave, bg: 'bg-yellow-100', text: 'text-yellow-800' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-slate-800 mb-1 text-2xl font-semibold">Dashboard</h2>
      <p className="text-slate-500 mb-6">Bienvenido, <strong>{userName}</strong></p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {stats.map(stat => (
          <div
            key={stat.label}
            className={`${stat.bg} p-6 rounded-xl min-w-40 flex-1 hover:shadow-lg transition-shadow duration-200`}
          >
            <p className={`m-0 mb-1 ${stat.text} text-sm`}>{stat.label}</p>
            <p className={`m-0 text-4xl font-bold ${stat.text}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link
          to="/empleados"
          className="px-5 py-2.5 bg-blue-800 text-white rounded-md no-underline text-sm hover:bg-blue-900 transition-colors duration-200"
        >
          Ver empleados →
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;