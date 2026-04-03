"use client";

/**
 * ---------------------------------------------------------
 * USE PAGE ERROR
 * ---------------------------------------------------------
 * Purpose:
 * Small reusable hook to manage page-level error state.
 * It normalizes common API/client error shapes into a
 * user-friendly string and exposes helpers to set/clear it.
 * ---------------------------------------------------------
 */

import { useState } from "react";

export function usePageError() {
    const [error, setError] = useState<string | null>(null);

    // Convert common API/client error shapes into a displayable message.
    function getErrorMessage(err: any, fallback = "Something went wrong") {
        const message = err?.response?.data?.message || err?.message || fallback;

        if (Array.isArray(message)) {
            return message.join(", ");
        }

        return String(message);
    }

    // Set a normalized error message from any thrown error.
    function captureError(err: any, fallback = "Something went wrong") {
        setError(getErrorMessage(err, fallback));
    }

    // Set an explicit page error message directly.
    function setPageError(message: string | null) {
        setError(message);
    }

    // Clear the current page error.
    function clearError() {
        setError(null);
    }

    return {
        error,
        setError: setPageError,
        clearError,
        captureError,
        getErrorMessage,
    };
}