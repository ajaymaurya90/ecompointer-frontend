"use client";

import { create } from "zustand";
import { runGlobalSearch } from "@/modules/search/api/globalSearchApi";
import type {
    GlobalSearchResults,
    GlobalSearchScope,
} from "@/modules/search/types/search";

interface GlobalSearchState {
    query: string;
    scope: GlobalSearchScope;
    loading: boolean;
    open: boolean;
    results: GlobalSearchResults;

    setQuery: (query: string) => void;
    setScope: (scope: GlobalSearchScope) => void;
    setOpen: (open: boolean) => void;
    search: () => Promise<void>;
    clear: () => void;
}

export const useGlobalSearchStore = create<GlobalSearchState>((set, get) => ({
    query: "",
    scope: "all",
    loading: false,
    open: false,
    results: {},

    setQuery: (query) => set({ query }),
    setScope: (scope) => set({ scope }),
    setOpen: (open) => set({ open }),

    search: async () => {
        const { query, scope } = get();
        const trimmed = query.trim();

        if (!trimmed) {
            set({
                results: {},
                loading: false,
                open: false,
            });
            return;
        }

        set({
            loading: true,
            open: true,
        });

        try {
            const response = await runGlobalSearch({
                query: trimmed,
                scope,
            });

            set({
                results: response.results ?? {},
                loading: false,
                open: true,
            });
        } catch (error) {
            console.error("Global search failed", error);
            set({
                results: {},
                loading: false,
                open: true,
            });
        }
    },

    clear: () =>
        set({
            query: "",
            scope: "all",
            loading: false,
            open: false,
            results: {},
        }),
}));