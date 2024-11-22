import { create } from "zustand";
import { toast } from "sonner";
import { createBusiness, updateBusiness, deleteBusiness, listBusinesss } from "./actions";
import type { Business } from "@prisma/client";

interface BusinessState {
  businesss: Business[];
  loading: boolean;
  error: string | null;

  // CRUD Form State
  initialCrudFormData?: Business | null;
  isOpenCrudForm: boolean;

  fetchBusinesss: (workspaceId: string) => Promise<void>;
  createBusiness: (data: Omit<Business, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateBusiness: (id: string, data: Partial<Business>) => Promise<void>;
  deleteBusiness: (id: string) => Promise<void>;

  // CRUD Form Actions
  onOpenCreateForm: () => void;
  onOpenEditForm: (data: Business) => void;
  onCloseCrudForm: () => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  businesss: [],
  loading: false,
  error: null,

  initialCrudFormData: null,
  isOpenCrudForm: false,

  fetchBusinesss: async (workspaceId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await listBusinesss({ where: { workspaceId } });
      if (response.success) {
        set({ businesss: response.data });
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
      const error: Error = err;
      set({ error: error.message });
      toast.error("Failed to load Businesss");
    } finally {
      set({ loading: false });
    }
  },

  createBusiness: async (data) => {
    try {
      const response = await createBusiness(data);
      if (response.success) {
        set((state) => ({
          businesss: [...state.businesss, response?.data ?? ({} as Business)],
        }));
        toast.success("Business created successfully");
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
      const error: Error = err;
      set({ error: error.message });
      toast.error("Failed to create Business");
    }
  },

  updateBusiness: async (id, data) => {
    try {
      const response = await updateBusiness(id, data);
      if (response.success) {
        set((state) => ({
          businesss: state.businesss.map((item) =>
            item.id === id ? (response.data ?? ({} as Business)) : item,
          ),
        }));
        toast.success("Business updated successfully");
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
      const error: Error = err;
      set({ error: error.message });
      toast.error("Failed to update Business");
    }
  },

  deleteBusiness: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await deleteBusiness(id);
      if (response.success) {
        set((state) => ({
          businesss: state.businesss.filter((item) => item.id !== id),
        }));
        toast.success("Business deleted successfully");
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
      const error: Error = err;
      set({ error: error.message });
      toast.error("Failed to delete Business");
    } finally {
      set({ loading: false });
    }
  },
  onOpenCreateForm: () => {
    set({
      isOpenCrudForm: true,
      initialCrudFormData: null,
    });
  },

  onOpenEditForm: (data) => {
    set({
      isOpenCrudForm: true,
      initialCrudFormData: data,
    });
  },

  onCloseCrudForm: () => {
    set({
      isOpenCrudForm: false,
      initialCrudFormData: null,
    });
  },
}));
