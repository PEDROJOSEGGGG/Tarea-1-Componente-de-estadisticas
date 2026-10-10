import { NavLink } from 'react-router-dom';
import type { NavItem, SessionUser } from '../types';
import { hasRole } from '../hooks/usePermissions';

interface HeaderProps {
    user?: SessionUser;
    onLogout?: () => void;
}

// Cada link declara qué roles lo pueden ver
const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '🏠', roles: ['ADMIN', 'HR_MANAGER', 'EMPLOYEE'] },
    { label: 'Empleados', path: '/empleados', icon: '📋', roles: ['ADMIN', 'HR_MANAGER'] },
];

function Header({ user, onLogout }: HeaderProps) {
    const links = navItems.filter((item) => hasRole(user?.role, item.roles));

    return (
        <header style={{
            background: '#1e40af',
            color: 'white',
            padding: '0 24px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>👥</span>
                    <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: 'white' }}>
                        Mini RRHH
                    </h1>
                </div>

                {user && (
                    <nav style={{ display: 'flex', gap: '4px' }}>
                        {links.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                style={({ isActive }) => ({
                                    color: 'white',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                                })}
                            >
                                {item.icon} {item.label}
                            </NavLink>
                        ))}
                    </nav>
                )}
            </div>

            {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '14px' }}>
                        <strong>{user.firstName} {user.lastName}</strong>
                    </span>
                    <span
                        title={user.role}
                        style={{
                            background: '#3b82f6',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            textTransform: 'uppercase',
                        }}
                    >
                        {user.roleName}
                    </span>
                    {onLogout && (
                        <button
                            onClick={onLogout}
                            style={{
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.5)',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                        >
                            Cerrar sesión
                        </button>
                    )}
                </div>
            )}
        </header>
    );
}

export default Header;
