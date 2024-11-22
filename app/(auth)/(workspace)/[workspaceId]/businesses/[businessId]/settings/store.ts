
import { debug } from "@/lib/utils";
import { create } from 'zustand';
import { toast } from 'sonner';
import {
  createBusinessConfig,
  retrieveBusinessConfig,
  updateBusinessConfig,
} from './actions';
import type { BusinessConfig } from '@prisma/client';

interface BusinessConfigState {
  settings: BusinessConfig | null;
  loading: boolean;
  error: string | null;

  // CRUD Form State
  initialCrudFormData?: BusinessConfig | null;
  isOpenCrudForm: boolean;

  createBusinessConfig: (data: Omit<BusinessConfig, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBusinessConfig: (id: string, data: Partial<BusinessConfig>) => Promise<void>;
  // CRUD Form Actions
  onOpenCreateForm: () => void;
  onOpenEditForm: (data: BusinessConfig) => void;
  onCloseCrudForm: () => void;
}

export const useBusinessConfigStore = create<BusinessConfigState>((set) => ({
  settings: null,
  loading: true,
  error: null,

  initialCrudFormData: null,
  isOpenCrudForm: false,

  fetchBusinessConfigs: async (businessId: string) => {
    debug("CLIENT", "fetchBusinessConfigs", "STORE")
    set({ loading: true, error: null });
    try {
      const response = await retrieveBusinessConfig(businessId);
      if (response.success) {
        set({ settings: response.data });
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
      const error: Error = err
      set({ error: error.message });
      toast.error('Failed to load BusinessConfigs');
    } finally {
      set({ loading: false });
    }
  },
  createBusinessConfig: async (data) => {
    debug("CLIENT", "createBusinessConfig", "STORE")
    try {
      const response = await createBusinessConfig(data);
      if (response.success) {
        set({ settings: response?.data });
        toast.success('BusinessConfig created successfully');
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
      const error: Error = err
      set({ error: error.message });
      toast.error('Failed to create BusinessConfig');
    }
  },

  updateBusinessConfig: async (id, data) => {
    debug("CLIENT", " updateBusinessConfig", "STORE")
    try {
      const response = await updateBusinessConfig(id, data);
      if (response.success) {
        set({ settings: response?.data });
        toast.success('BusinessConfig updated successfully');
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
      const error: Error = err
      set({ error: error.message });
      toast.error('Failed to update BusinessConfig');
    }
  },
  onOpenCreateForm: () => {
    set({
      isOpenCrudForm: true,
      initialCrudFormData: null
    });
  },

  onOpenEditForm: (data) => {
    set({
      isOpenCrudForm: true,
      initialCrudFormData: data
    });
  },

  onCloseCrudForm: () => {
    set({
      isOpenCrudForm: false,
      initialCrudFormData: null
    });
  }
}));
