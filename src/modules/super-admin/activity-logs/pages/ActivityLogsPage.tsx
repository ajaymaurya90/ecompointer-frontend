"use client";

import { useEffect, useMemo, useState } from "react";
import { getActivityLog, getActivityLogs } from "@/modules/super-admin/activity-logs/api/activityLogsApi";
import type {
    ActivityLogItem,
    ActivityLogListResponse,
} from "@/modules/super-admin/activity-logs/types/activityLogs";

const pageSize = 20;

const actorRoleOptions = [
    { label: "All roles", value: "" },
    { label: "Super Admin", value: "SUPER_ADMIN" },
    { label: "Brand Owner", value: "BRAND_OWNER" },
    { label: "Shop Owner", value: "SHOP_OWNER" },
    { label: "Customer", value: "CUSTOMER" },
];

export default function ActivityLogsPage() {
    const [logs, setLogs] = useState<ActivityLogItem[]>([]);
    const [meta, setMeta] = useState<ActivityLogListResponse["meta"]>({
        page: 1,
        limit: pageSize,
        total: 0,
        totalPages: 1,
    });
    const [search, setSearch] = useState("");
    const [actionKey, setActionKey] = useState("");
    const [actorRole, setActorRole] = useState("");
    const [brandOwnerId, setBrandOwnerId] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const hasFilters = useMemo(
        () =>
            Boolean(
                search.trim() ||
                    actionKey.trim() ||
                    actorRole ||
                    brandOwnerId.trim() ||
                    dateFrom ||
                    dateTo,
            ),
        [search, actionKey, actorRole, brandOwnerId, dateFrom, dateTo],
    );

    async function load(nextPage = page) {
        try {
            setLoading(true);
            setError(null);
            const response = await getActivityLogs({
                search,
                actionKey,
                actorRole,
                brandOwnerId,
                dateFrom,
                dateTo,
                page: nextPage,
                limit: pageSize,
            });
            setLogs(response.data ?? []);
            setMeta(response.meta);
            setPage(response.meta.page);
        } catch (err) {
            setError(getErrorMessage(err, "Could not load activity logs."));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void load(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function applyFilters() {
        await load(1);
    }

    async function clearFilters() {
        setSearch("");
        setActionKey("");
        setActorRole("");
        setBrandOwnerId("");
        setDateFrom("");
        setDateTo("");

        try {
            setLoading(true);
            setError(null);
            const response = await getActivityLogs({ page: 1, limit: pageSize });
            setLogs(response.data ?? []);
            setMeta(response.meta);
            setPage(response.meta.page);
        } catch (err) {
            setError(getErrorMessage(err, "Could not load activity logs."));
        } finally {
            setLoading(false);
        }
    }

    async function openDetail(log: ActivityLogItem) {
        setSelectedLog(log);
        setDetailLoading(true);
        try {
            setSelectedLog(await getActivityLog(log.id));
        } catch (err) {
            setError(getErrorMessage(err, "Could not load activity log detail."));
        } finally {
            setDetailLoading(false);
        }
    }

    async function goToPage(nextPage: number) {
        if (nextPage < 1 || nextPage > meta.totalPages || nextPage === page) return;
        await load(nextPage);
    }

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-borderSoft bg-white p-6 shadow-sm">
                <div>
                    <h1 className="text-2xl font-semibold text-textPrimary">
                        Activity Logs
                    </h1>
                    <p className="mt-1 max-w-3xl text-sm text-textSecondary">
                        Review read-only business and audit events across Super Admin,
                        Brand Owner, and storefront workflows.
                    </p>
                </div>
            </section>

            <section className="rounded-2xl border border-borderSoft bg-white p-5 shadow-sm">
                <div className="grid gap-4 md:grid-cols-3">
                    <label className="block">
                        <span className="text-sm font-medium text-textPrimary">
                            Search
                        </span>
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Summary, action, entity"
                            className="mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
                        />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-textPrimary">
                            Action Key
                        </span>
                        <input
                            value={actionKey}
                            onChange={(event) => setActionKey(event.target.value)}
                            placeholder="SA_BO_CREATED"
                            className="mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
                        />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-textPrimary">
                            Actor Role
                        </span>
                        <select
                            value={actorRole}
                            onChange={(event) => setActorRole(event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
                        >
                            {actorRoleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-textPrimary">
                            Brand Owner ID
                        </span>
                        <input
                            value={brandOwnerId}
                            onChange={(event) => setBrandOwnerId(event.target.value)}
                            placeholder="UUID"
                            className="mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
                        />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-textPrimary">
                            From
                        </span>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(event) => setDateFrom(event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
                        />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-textPrimary">
                            To
                        </span>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(event) => setDateTo(event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
                        />
                    </label>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => void applyFilters()}
                        className="rounded-2xl bg-sidebar px-5 py-3 text-sm font-medium text-white shadow-sm"
                    >
                        Apply Filters
                    </button>
                    <button
                        type="button"
                        disabled={!hasFilters}
                        onClick={() => void clearFilters()}
                        className="rounded-2xl border border-borderSoft px-5 py-3 text-sm font-medium text-textPrimary hover:bg-cardMuted disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Clear
                    </button>
                </div>
            </section>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            <section className="overflow-hidden rounded-2xl border border-borderSoft bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-cardMuted text-xs uppercase tracking-wide text-textSecondary">
                        <tr>
                            <th className="px-5 py-4">Date/Time</th>
                            <th className="px-5 py-4">Action</th>
                            <th className="px-5 py-4">Actor Role</th>
                            <th className="px-5 py-4">Brand Owner</th>
                            <th className="px-5 py-4">Entity Type</th>
                            <th className="px-5 py-4">Summary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-8 text-center text-textSecondary">
                                    Loading activity logs...
                                </td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-8 text-center text-textSecondary">
                                    No activity logs found.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr
                                    key={log.id}
                                    onClick={() => void openDetail(log)}
                                    className="cursor-pointer border-b border-borderSoft transition last:border-b-0 hover:bg-cardMuted"
                                >
                                    <td className="whitespace-nowrap px-5 py-4 text-textSecondary">
                                        {formatDate(log.createdAt)}
                                    </td>
                                    <td className="px-5 py-4">
                                        <code className="rounded-lg bg-cardMuted px-2 py-1 text-xs text-textPrimary">
                                            {log.actionKey}
                                        </code>
                                    </td>
                                    <td className="px-5 py-4 text-textPrimary">
                                        {formatRole(log.actorRole)}
                                    </td>
                                    <td className="px-5 py-4 text-textPrimary">
                                        {formatBrandOwner(log)}
                                    </td>
                                    <td className="px-5 py-4 text-textSecondary">
                                        {log.entityType}
                                    </td>
                                    <td className="max-w-xl px-5 py-4 text-textSecondary">
                                        {log.summary}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="flex flex-col gap-3 border-t border-borderSoft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-textSecondary">
                        Showing page {meta.page} of {meta.totalPages} · {meta.total} total
                    </p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={page <= 1 || loading}
                            onClick={() => void goToPage(page - 1)}
                            className="rounded-2xl border border-borderSoft px-4 py-2 text-sm font-medium text-textPrimary hover:bg-cardMuted disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            disabled={page >= meta.totalPages || loading}
                            onClick={() => void goToPage(page + 1)}
                            className="rounded-2xl border border-borderSoft px-4 py-2 text-sm font-medium text-textPrimary hover:bg-cardMuted disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </section>

            {selectedLog ? (
                <ActivityLogDetailModal
                    log={selectedLog}
                    loading={detailLoading}
                    onClose={() => setSelectedLog(null)}
                />
            ) : null}
        </div>
    );
}

function ActivityLogDetailModal({
    log,
    loading,
    onClose,
}: {
    log: ActivityLogItem;
    loading: boolean;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                <div className="flex items-start justify-between border-b border-borderSoft p-6">
                    <div>
                        <h2 className="text-xl font-semibold text-textPrimary">
                            Activity Log Detail
                        </h2>
                        <p className="mt-1 text-sm text-textSecondary">
                            Read-only audit event information.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl border border-borderSoft px-3 py-2 text-sm font-medium text-textPrimary hover:bg-cardMuted"
                    >
                        Close
                    </button>
                </div>
                <div className="space-y-5 p-6">
                    {loading ? (
                        <div className="rounded-2xl bg-cardMuted px-4 py-3 text-sm text-textSecondary">
                            Loading latest detail...
                        </div>
                    ) : null}
                    <DetailGrid
                        rows={[
                            ["Action Key", log.actionKey],
                            ["Summary", log.summary],
                            ["Actor User ID", log.actorUserId || "-"],
                            ["Actor Role", formatRole(log.actorRole)],
                            ["Brand Owner ID", log.brandOwnerId || "-"],
                            ["Brand Owner", formatBrandOwner(log)],
                            ["Entity Type", log.entityType],
                            ["Entity ID", log.entityId || "-"],
                            ["IP Address", log.ipAddress || "-"],
                            ["Created At", formatDate(log.createdAt)],
                        ]}
                    />
                    <div>
                        <h3 className="mb-2 text-sm font-semibold text-textPrimary">
                            Metadata
                        </h3>
                        <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
                            {JSON.stringify(log.metadataJson ?? {}, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailGrid({ rows }: { rows: Array<[string, string]> }) {
    return (
        <div className="grid gap-3 sm:grid-cols-2">
            {rows.map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-borderSoft p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-textSecondary">
                        {label}
                    </div>
                    <div className="mt-1 break-words text-sm font-medium text-textPrimary">
                        {value}
                    </div>
                </div>
            ))}
        </div>
    );
}

function formatBrandOwner(log: ActivityLogItem) {
    if (log.brandOwner?.businessName) {
        return log.brandOwner.businessName;
    }
    return log.brandOwnerId || "-";
}

function formatRole(role?: string | null) {
    return role ? role.replaceAll("_", " ") : "-";
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

function getErrorMessage(error: unknown, fallback: string) {
    if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response
    ) {
        const data = error.response.data as { message?: string | string[] };
        if (Array.isArray(data.message)) return data.message.join(", ");
        if (data.message) return data.message;
    }

    return fallback;
}
