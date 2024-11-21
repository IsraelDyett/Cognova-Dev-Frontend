import { create } from "zustand";
import type { Plan, Role } from "@prisma/client";

interface WorkspaceFormData {
  displayName: string;
  team: Array<{
    email: string;
    roleId: string;
  }>;
}

interface WorkspaceState {
  isOpen: boolean;
  isLoading: boolean;
  roles: Role[];
  formData: WorkspaceFormData;
  setOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setRoles: (roles: Role[]) => void;
  updateFormData: (data: Partial<WorkspaceFormData>) => void;
  addTeamMember: (email: string, roleId: string) => void;
  removeTeamMember: (email: string) => void;
  reset: () => void;
}

const initialFormData: WorkspaceFormData = {
  displayName: "",
  team: [],
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  isOpen: false,
  isLoading: false,
  roles: [],
  formData: initialFormData,
  setOpen: (open) => set({ isOpen: open }),
  setLoading: (loading) => set({ isLoading: loading }),
  setRoles: (roles) => set({ roles }),
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  addTeamMember: (email, roleId) =>
    set((state) => ({
      formData: {
        ...state.formData,
        team: [...state.formData.team, { email, roleId }],
      },
    })),
  removeTeamMember: (email) =>
    set((state) => ({
      formData: {
        ...state.formData,
        team: state.formData.team.filter((member) => member.email !== email),
      },
    })),
  reset: () =>
    set({
      formData: initialFormData,
      isOpen: false,
      isLoading: false,
    }),
}));
