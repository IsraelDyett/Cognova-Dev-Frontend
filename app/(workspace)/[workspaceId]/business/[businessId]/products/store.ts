import { create } from "zustand";
import { toast } from "sonner";
import { createProduct, updateProduct, deleteProduct, getProduct, listProducts } from "./actions";
import type { BusinessProduct as Product } from "@prisma/client";

interface ProductState {
	products: Product[];
	loading: boolean;
	error: string | null;

	initialCrudFormData?: Product | null;
	isOpenCrudForm: boolean;

	fetchProducts: (businessId: string) => Promise<void>;
	createProduct: (data: Omit<Product, "id" | "createdAt" | "updatedAt">) => Promise<void>;
	updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
	deleteProduct: (id: string) => Promise<void>;

	onOpenCreateForm: () => void;
	onOpenEditForm: (data: Product) => void;
	onCloseCrudForm: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
	products: [],
	loading: false,
	error: null,

	initialCrudFormData: null,
	isOpenCrudForm: false,

	fetchProducts: async (businessId: string) => {
		set({ loading: true, error: null });
		try {
			const response = await listProducts({ where: { businessId: businessId } });
			if (response.success) {
				set({ products: response.data });
				toast.success("Products loaded successfully");
			} else {
				throw new Error(response.error);
			}
		} catch (err: any) {
			const error: Error = err;
			set({ error: error.message });
			toast.error("Failed to load Products");
		} finally {
			set({ loading: false });
		}
	},

	createProduct: async (data) => {
		set({ loading: true, error: null });
		try {
			const response = await createProduct(data);
			if (response.success) {
				set((state) => ({
					products: [...state.products, response?.data ?? ({} as Product)],
				}));
				toast.success("Product created successfully");
			} else {
				throw new Error(response.error);
			}
		} catch (err: any) {
			const error: Error = err;
			set({ error: error.message });
			toast.error("Failed to create Product");
		} finally {
			set({ loading: false });
		}
	},

	updateProduct: async (id, data) => {
		try {
			const response = await updateProduct(id, data);
			if (response.success) {
				set((state) => ({
					products: state.products.map((item) =>
						item.id === id ? (response.data ?? ({} as Product)) : item,
					),
				}));
				toast.success("Product updated successfully");
			} else {
				throw new Error(response.error);
			}
		} catch (err: any) {
			const error: Error = err;
			set({ error: error.message });
			toast.error("Failed to update Product");
		}
	},

	deleteProduct: async (id) => {
		set({ loading: true, error: null });
		try {
			const response = await deleteProduct(id);
			if (response.success) {
				set((state) => ({
					products: state.products.filter((item) => item.id !== id),
				}));
				toast.success("Product deleted successfully");
			} else {
				throw new Error(response.error);
			}
		} catch (err: any) {
			const error: Error = err;
			set({ error: error.message });
			toast.error("Failed to delete Product");
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
