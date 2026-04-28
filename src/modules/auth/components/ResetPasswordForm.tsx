"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPassword } from "@/modules/auth/api/authApi";

const schema = z
    .object({
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(8, "Please confirm your password"),
    })
    .refine((value) => value.newPassword === value.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        if (!token) {
            setServerError("This password reset link is invalid.");
            return;
        }

        try {
            setServerError(null);
            const response = await resetPassword(token, data.newPassword);
            setSuccessMessage(response.message);

            // Redirect after a successful reset so users can sign in immediately.
            window.setTimeout(() => {
                router.replace("/login");
            }, 1500);
        } catch (error: unknown) {
            const message =
                error &&
                typeof error === "object" &&
                "response" in error &&
                typeof error.response === "object" &&
                error.response &&
                "data" in error.response &&
                typeof error.response.data === "object" &&
                error.response.data &&
                "message" in error.response.data
                    ? String(error.response.data.message)
                    : "Unable to reset your password.";

            setServerError(message);
        }
    };

    return (
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-900">
            <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Reset Password
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                    Enter your new password to finish resetting your account.
                </p>
            </div>

            {!token ? (
                <div className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    This password reset link is invalid or incomplete.
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                    <div>
                        <input
                            type="password"
                            placeholder="New Password"
                            {...register("newPassword")}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white"
                        />
                        {errors.newPassword ? (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.newPassword.message}
                            </p>
                        ) : null}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            {...register("confirmPassword")}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white"
                        />
                        {errors.confirmPassword ? (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.confirmPassword.message}
                            </p>
                        ) : null}
                    </div>

                    {successMessage ? (
                        <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                            {successMessage}
                        </div>
                    ) : null}

                    {serverError ? (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                            {serverError}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-blue-900 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-60"
                    >
                        {isSubmitting ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            )}

            <div className="mt-6 text-center">
                <Link
                    href="/login"
                    className="text-sm font-medium text-blue-900 transition hover:text-blue-700"
                >
                    Back to Sign In
                </Link>
            </div>
        </div>
    );
}
