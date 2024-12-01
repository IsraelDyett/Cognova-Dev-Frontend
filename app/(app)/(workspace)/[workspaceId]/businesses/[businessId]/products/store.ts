import { create } from "zustand";
import { toast } from "sonner";
import { createProduct, updateProduct, deleteProduct, getProducts } from "@/lib/actions/server/business";
import type { BusinessConfig, BusinessProduct as Product } from "@prisma/client";

export interface ProductsStoreState {
	products: (Product & { business: { configurations: BusinessConfig | null } })[];
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

export const useProductStore = create<ProductsStoreState>((set) => ({
	products: [],
	loading: false,
	error: null,

	initialCrudFormData: null,
	isOpenCrudForm: false,

	fetchProducts: async (businessId: string) => {
		set({ loading: true, error: null });
		try {
			const response = await getProducts({ businessId, include: { business: { include: { configurations: true } } } });
			if (response.success) {
				set({ products: response.data as unknown as ProductsStoreState['products'] });
			} else {
				console.error(response.error)
				toast.error("Failed to delete Product");
			}
		} finally {
			set({ loading: false });
		}
	},

	createProduct: async (data) => {
		set({ loading: true, error: null });
		const response = await createProduct({ data, include: { business: { include: { configurations: true } } } });
		if (response.success) {
			set((state) => ({
				products: [
					...state.products,
					response?.data as unknown as ProductsStoreState["products"]["0"],
				],
			}));
			toast.success("Product created successfully");
		} else {
			console.error(response.error)
			toast.error("Failed to delete Product");
		}
	},

	updateProduct: async (id, data) => {
		const response = await updateProduct({ id, data, include: { business: { include: { configurations: true } } } });
		if (response.success) {
			set((state) => ({
				products: state.products.map((item) =>
					item.id === id
						? response?.data as unknown as ProductsStoreState["products"]["0"]
						: item,
				),
			}));
			toast.success("Product updated successfully");
		} else {
			console.error(response.error)
			toast.error("Failed to delete Product");
		}
	},

	deleteProduct: async (id) => {
		const response = await deleteProduct({ id });
		if (response.success) {
			set((state) => ({
				products: state.products.filter((item) => item.id !== id),
			}));
			toast.success("Product deleted successfully");
		} else {
			console.error(response.error)
			toast.error("Failed to delete Product");
		}
	},
	onOpenCreateForm: () => {
		set({ isOpenCrudForm: true, initialCrudFormData: null, });
	},

	onOpenEditForm: (data) => {
		set({ isOpenCrudForm: true, initialCrudFormData: data, });
	},

	onCloseCrudForm: () => {
		set({ isOpenCrudForm: false, initialCrudFormData: null, });
	},
}));
