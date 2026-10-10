// src/types/index.ts

// ---tipos base del dominio---

export type Department =
    | "Tecnologia"
    | "Recursos Humanos"
    | "Finanzas"
    | "Operaciones"
    | "Ventas";

    export type EmployeeRole = "admin" | "hr" | "employee";
    
    export type EmployeeStatus = "active" | "inactive" | "on_leave";


    //tipos de authenticacion

    export interface Employee {
    id: number;
    name: string;
    email: string;
    position: string;
    department: Department;
    salary: number;
    hireDate: string; // ISO 8601: "2024-01-15"
    status: EmployeeStatus;
    role: EmployeeRole;
    avatarUrl?: string;
    phone?: string;
    }

    // --- Tipos para creación y actualización ---
 
    export type CreateEmployeeDto = Omit<Employee, "id">;
    export type UpdateEmployeeDto = Partial<CreateEmployeeDto>;
    
    // --- Tipos de autenticación (API-RH) ---

    // Roles que devuelve la API-RH en el login. No son los mismos que
    // EmployeeRole, que es solo un campo del empleado en JSON Server.
    export type UserRole = "ADMIN" | "HR_MANAGER" | "EMPLOYEE";

    export interface SessionUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    roleName: string;
    }

    export interface Session {
    user: SessionUser;
    accessToken: string;
    refreshToken: string;
    }
    
    export interface LoginCredentials {
    email: string;
    password: string;
    }

    // --- Tipos de respuesta de la API ---
 
    export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
    }
    
    export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    }

    // --- Tipos de navegación ---
 
    export interface NavItem {
    label: string;
    path: string;
    icon: string;
    roles: UserRole[];
    }