// src/hooks/usePermissions.ts
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types';

// Qué puede hacer cada rol. Así las reglas viven en un solo lugar y las
// pantallas solo preguntan "¿puedo hacer X?".
export const permissions = {
  viewEmployees: ['ADMIN', 'HR_MANAGER'],
  editEmployees: ['ADMIN', 'HR_MANAGER'],
  deleteEmployees: ['ADMIN'],
} satisfies Record<string, UserRole[]>;

export type Permission = keyof typeof permissions;

export function hasRole(role: UserRole | undefined, allowed: UserRole[]): boolean {
  return !!role && allowed.includes(role);
}

export function usePermissions() {
  const role = useAuthStore((state) => state.user?.role);
  return {
    role,
    can: (permission: Permission) => hasRole(role, permissions[permission]),
  };
}
