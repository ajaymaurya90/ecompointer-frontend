/**
 * Trim string and return undefined if empty.
 */
export function cleanString(value?: string | null): string | undefined {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
}

/**
 * Trim required string and return empty string only if nothing entered.
 * Useful for required form fields before frontend validation.
 */
export function requiredString(value?: string | null): string {
    return value?.trim() ?? "";
}

/**
 * Convert value to integer if valid, otherwise undefined.
 */
export function cleanInt(value?: string | number | null): number | undefined {
    if (value === null || value === undefined || value === "") {
        return undefined;
    }

    const parsed =
        typeof value === "number" ? Math.trunc(value) : parseInt(String(value), 10);

    return Number.isNaN(parsed) ? undefined : parsed;
}

/**
 * Convert value to float if valid, otherwise undefined.
 */
export function cleanNumber(value?: string | number | null): number | undefined {
    if (value === null || value === undefined || value === "") {
        return undefined;
    }

    const parsed =
        typeof value === "number" ? value : parseFloat(String(value));

    return Number.isNaN(parsed) ? undefined : parsed;
}