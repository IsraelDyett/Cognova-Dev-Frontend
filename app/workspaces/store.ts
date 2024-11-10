import { create } from "zustand";

interface OnboardingState {
  step: number;
  email: string;
  workspaceName: string;
  invites: Array<{ email: string; role: "member" | "admin" }>;
  setStep: (step: number) => void;
  setEmail: (email: string) => void;
  setWorkspaceName: (name: string) => void;
  addInvite: (email: string, role: "member" | "admin") => void;
  removeInvite: (email: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  email: "",
  workspaceName: "",
  invites: [],
  setStep: (step) => set({ step }),
  setEmail: (email) => set({ email }),
  setWorkspaceName: (name) => set({ workspaceName: name }),
  addInvite: (email, role) =>
    set((state) => ({
      invites: [...state.invites, { email, role }],
    })),
  removeInvite: (email) =>
    set((state) => ({
      invites: state.invites.filter((invite) => invite.email !== email),
    })),
  reset: () => set({ step: 1, email: "", workspaceName: "", invites: [] }),
}));
