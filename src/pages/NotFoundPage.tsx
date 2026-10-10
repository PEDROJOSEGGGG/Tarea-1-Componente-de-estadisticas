// src/pages/NotFoundPage.tsx
import { Link } from 'react-router-dom';
import { usePageNotFound } from '../hooks/usePageNotFound';

function NotFoundPage() {
  const missingUrl = usePageNotFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="relative inline-block mb-6">
          <p className="text-[120px] sm:text-[160px] leading-none font-black text-blue-800/10 select-none">
            404
          </p>
          <span className="absolute inset-0 flex items-center justify-center text-6xl" aria-hidden="true">
            🧭
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
          Te perdiste en la oficina
        </h2>
        <p className="text-slate-500 mb-4">
          Buscamos en todos los departamentos y esta página no está en ninguno.
        </p>

        <p className="inline-block max-w-full truncate bg-white border border-slate-200 rounded-lg px-3 py-1.5 mb-8 font-mono text-sm text-slate-600">
          {missingUrl}
        </p>

        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-800 text-white rounded-lg font-medium shadow-md hover:bg-blue-900 hover:shadow-lg transition-all duration-200"
          >
            ← Volver al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
