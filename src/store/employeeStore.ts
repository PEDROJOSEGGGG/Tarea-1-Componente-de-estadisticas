import { create } from 'zustand';
import type { CreateEmployeeDto, Employee, UpdateEmployeeDto } from '../types';
import { mockEmployees } from '../utils/mockData';

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;
  fetchEmployees: () => Promise<void>;
  addEmployee: (data: CreateEmployeeDto) => boolean;
  updateEmployee: (id: number, data: UpdateEmployeeDto) => void;
  deleteEmployee: (id: number) => void;
  selectEmployee: (employee: Employee | null) => void;
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  selectedEmployee: null,
  isLoading: false,
  error: null,
  fetchEmployees: async () => {
    set({ isLoading: true, error: null });
    await new Promise((resolve) => setTimeout(resolve, 600));
    set({ employees: [...mockEmployees], isLoading: false });
  },
  addEmployee: (data) => {
    if (get().employees.some((employee) => employee.email.toLowerCase() === data.email.toLowerCase())) {
      set({ error: `Ya existe un empleado con el email ${data.email}` });
      return false;
    }

    set((state) => ({
      employees: [...state.employees, { ...data, id: Date.now() }],
      error: null,
    }));
    return true;
  },
  updateEmployee: (id, data) => set((state) => ({
    employees: state.employees.map((employee) =>
      employee.id === id ? { ...employee, ...data } : employee,
    ),
    error: null,
  })),
  deleteEmployee: (id) => set((state) => ({
    employees: state.employees.filter((employee) => employee.id !== id),
    selectedEmployee: state.selectedEmployee?.id === id ? null : state.selectedEmployee,
  })),
  selectEmployee: (employee) => set({ selectedEmployee: employee }),
}));
