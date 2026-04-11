"use client";

import Link from "next/link";
import type {
    GlobalSearchItem,
    GlobalSearchResults,
    GlobalSearchScope,
} from "@/modules/search/types/search";

interface GlobalSearchDropdownProps {
    loading: boolean;
    query: string;
    results: GlobalSearchResults;
    open: boolean;
    scope: GlobalSearchScope;
}

function SearchGroup({
    title,
    items,
}: {
    title: string;
    items?: GlobalSearchItem[];
}) {
    if (!items?.length) return null;

    return (
        <div className="space-y-1">
            <div className="px-3 pt-2 text-[11px] font-semibold uppercase tracking-wide text-textSecondary">
                {title}
            </div>

            {items.map((item) => (
                <Link
                    key={`${item.type}-${item.id}`}
                    href={item.url}
                    className="block rounded-xl px-3 py-2 transition hover:bg-cardMuted"
                >
                    <div className="text-sm font-medium text-textPrimary">
                        {item.title}
                    </div>

                    {item.subtitle ? (
                        <div className="text-xs text-textSecondary">
                            {item.subtitle}
                        </div>
                    ) : null}
                </Link>
            ))}
        </div>
    );
}

function SearchFlatList({ items }: { items: GlobalSearchItem[] }) {
    return (
        <div className="max-h-[420px] overflow-y-auto p-2">
            {items.map((item) => (
                <Link
                    key={`${item.type}-${item.id}`}
                    href={item.url}
                    className="block rounded-xl px-3 py-2 transition hover:bg-cardMuted"
                >
                    <div className="text-sm font-medium text-textPrimary">
                        {item.title}
                    </div>

                    {item.subtitle ? (
                        <div className="text-xs text-textSecondary">
                            {item.subtitle}
                        </div>
                    ) : null}
                </Link>
            ))}
        </div>
    );
}

function getScopedItems(
    scope: GlobalSearchScope,
    results: GlobalSearchResults
): GlobalSearchItem[] {
    switch (scope) {
        case "products":
            return results.products ?? [];
        case "customers":
            return results.customers ?? [];
        case "orders":
            return results.orders ?? [];
        case "shopOwners":
            return results.shopOwners ?? [];
        default:
            return [];
    }
}

export default function GlobalSearchDropdown({
    loading,
    query,
    results,
    open,
    scope,
}: GlobalSearchDropdownProps) {
    if (!open) return null;

    const hasGroupedResults =
        (results.products?.length ?? 0) > 0 ||
        (results.customers?.length ?? 0) > 0 ||
        (results.orders?.length ?? 0) > 0 ||
        (results.shopOwners?.length ?? 0) > 0;

    const scopedItems = scope === "all" ? [] : getScopedItems(scope, results);
    const hasScopedResults = scopedItems.length > 0;

    return (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[120] overflow-hidden rounded-2xl border border-borderSoft bg-elevated shadow-md">
            {loading ? (
                <div className="px-4 py-4 text-sm text-textSecondary">
                    Searching...
                </div>
            ) : scope === "all" ? (
                !hasGroupedResults ? (
                    <div className="px-4 py-4 text-sm text-textSecondary">
                        No results found for “{query}”.
                    </div>
                ) : (
                    <div className="max-h-[420px] space-y-2 overflow-y-auto p-2">
                        <SearchGroup title="Products" items={results.products} />
                        <SearchGroup title="Customers" items={results.customers} />
                        <SearchGroup title="Orders" items={results.orders} />
                        <SearchGroup title="Shop Owners" items={results.shopOwners} />
                    </div>
                )
            ) : !hasScopedResults ? (
                <div className="px-4 py-4 text-sm text-textSecondary">
                    No results found for “{query}”.
                </div>
            ) : (
                <SearchFlatList items={scopedItems} />
            )}
        </div>
    );
}