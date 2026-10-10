// src/components/ErrorBoundary.tsx
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

// Atrapa errores de render para que la app no quede en blanco.
// Tiene que ser una clase: React no tiene un hook equivalente.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error no controlado:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '16px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '32px', maxWidth: '420px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <p style={{ fontSize: '40px', margin: 0 }}>💥</p>
          <h2 style={{ color: '#1e293b', margin: '12px 0 8px' }}>La aplicación tuvo un problema</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
            {this.state.error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
          >
            Recargar
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
