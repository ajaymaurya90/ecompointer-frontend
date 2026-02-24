import { create } from "zustand";
import { api } from "@/lib/api";

export interface Brand {
    id: string;
    name: string;
    description?: string | null;
    tagline?: string | null;
    logoUrl?: string | null;
    status: "ACTIVE" | "INACTIVE";
    createdAt: string;
}

interface BrandState {
    brands: Brand[];
    loading: boolean;

    fetchBrands: () => Promise<void>;
    createBrand: (data: { name: string; description?: string | null; tagline?: string | null }) => Promise<void>;
    updateBrand: (id: string, data: { name: string; description?: string | null; tagline?: string | null }) => Promise<void>;
    deleteBrand: (id: string) => Promise<void>;
}

export const useBrandStore = create<BrandState>((set) => ({
    brands: [],
    loading: false,

    fetchBrands: async () => {
        set({ loading: true });
        try {
            const res = await api.get("/brand");
            set({ brands: res.data });
        } finally {
            set({ loading: false });
        }
    },

    createBrand: async (data) => {
        await api.post("/brand", data);
        await useBrandStore.getState().fetchBrands();
    },

    updateBrand: async (id, data) => {
        await api.patch(`/brand/${id}`, data);
        await useBrandStore.getState().fetchBrands();
    },

    deleteBrand: async (id) => {
        await api.delete(`/brand/${id}`);
        await useBrandStore.getState().fetchBrands();
    },
}));