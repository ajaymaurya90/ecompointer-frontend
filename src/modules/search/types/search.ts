export type GlobalSearchScope =
    | "all"
    | "products"
    | "customers"
    | "orders"
    | "shopOwners";

export interface GlobalSearchItem {
    id: string;
    title: string;
    subtitle?: string;
    url: string;
    type: "product" | "customer" | "order" | "shopOwner";
}

export interface GlobalSearchResults {
    products?: GlobalSearchItem[];
    customers?: GlobalSearchItem[];
    orders?: GlobalSearchItem[];
    shopOwners?: GlobalSearchItem[];
}

export interface GlobalSearchResponse {
    query: string;
    scope: GlobalSearchScope;
    results: GlobalSearchResults;
}