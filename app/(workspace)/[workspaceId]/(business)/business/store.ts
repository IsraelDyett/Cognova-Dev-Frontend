import { create } from "zustand";
import {
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getBusiness,
  getBusinesses,
} from "./actions";
import {
  Bot,
  Business,
  BusinessConfig,
  BusinessLocation,
  BusinessOperatingHours,
  BusinessProduct,
} from "@prisma/client";

type CurrentBusinessWithRelations = Business & {
  products?: BusinessProduct[];
  bots?: Bot[];
  configurations?: BusinessConfig | null;
  operatingHours?: (BusinessOperatingHours & { location: BusinessLocation | null })[];
  locations?: BusinessLocation[];
};
type BusinessesWithRelations = Business & {
  configurations?: BusinessConfig | null;
};

interface BusinessState {
  businesses: BusinessesWithRelations[];
  currentBusiness: CurrentBusinessWithRelations | null;
  loading: boolean;
  error: string | null;
  fetchBusinesses: (workspaceId: string) => Promise<void>;
  fetchBusiness: (id: string) => Promise<void>;
  createNewBusiness: (data: Business) => Promise<{
    success: boolean;
    data?: CurrentBusinessWithRelations;
    error?: string;
  }>;
  updateCurrentBusiness: (id: string, data: Partial<Business>) => Promise<void>;
  deleteCurrentBusiness: (id: string) => Promise<void>;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  businesses: [],
  currentBusiness: null,
  loading: false,
  error: null,
  fetchBusinesses: async (workspaceId) => {
    set({ loading: true, error: null });
    const result = await getBusinesses(workspaceId);
    if (result.success && result?.data) {
      set({ businesses: result.data, loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
  },
  fetchBusiness: async (id) => {
    set({ loading: true, error: null });
    const result = await getBusiness(id);
    if (result.success && result?.data) {
      set({ currentBusiness: result.data, loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
  },
  createNewBusiness: async (data) => {
    // Removed explicit Business type
    set({ loading: true, error: null });
    const result = await createBusiness(data);
    if (result.success) {
      set((state) => ({
        businesses: [...state.businesses, result.data ?? ({} as Business)],
        loading: false,
      }));
    } else {
      set({ error: result.error, loading: false });
    }
    return result;
  },
  updateCurrentBusiness: async (id, data) => {
    set({ loading: true, error: null });
    const result = await updateBusiness(id, data);
    if (result.success) {
      set((state) => ({
        businesses: state.businesses.map((b) =>
          b.id === id ? (result.data ?? ({} as Business)) : b,
        ),
        currentBusiness: result.data,
        loading: false,
      }));
    } else {
      set({ error: result.error, loading: false });
    }
  },
  deleteCurrentBusiness: async (id) => {
    set({ loading: true, error: null });
    const result = await deleteBusiness(id);
    if (result.success) {
      set((state) => ({
        businesses: state.businesses.filter((b) => b.id !== id),
        currentBusiness: null,
        loading: false,
      }));
    } else {
      set({ error: result.error, loading: false });
    }
  },
}));
