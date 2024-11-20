import { create } from "zustand";
import type { Plan, Role } from "@prisma/client";

interface OnboardingState {
  step: number;
  plans: Plan[];
  roles: Role[];
  invites: Array<{ email: string; roleId: string }>;
  isLoading: boolean;
  workspaceId: string | null;
  setStep: (step: number) => void;
  setPlans: (plans: Plan[]) => void;
  setRoles: (roles: Role[]) => void;
  addInvite: (email: string, roleId: string) => void;
  removeInvite: (email: string) => void;
  setIsLoading: (loading: boolean) => void;
  setWorkspaceId: (id: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  plans: [],
  roles: [],
  invites: [],
  isLoading: false,
  workspaceId: null,
  setStep: (step) => set({ step }),
  setPlans: (plans) => set({ plans }),
  setRoles: (roles) => set({ roles }),
  setIsLoading: (isLoading) => set({ isLoading }),
  addInvite: (email, roleId) =>
    set((state) => ({
      invites: [...state.invites, { email, roleId }],
    })),

  setWorkspaceId: (id) => set({ workspaceId: id }),
  removeInvite: (email) =>
    set((state) => ({
      invites: state.invites.filter((invite) => invite.email !== email),
    })),
  reset: () =>
    set({
      step: 1,
      plans: [],
      roles: [],
      invites: [],
      isLoading: false,
    }),
}));
