"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forgotPassword } from "@/modules/auth/api/authApi";

const schema = z.object({
    email: z.string().email("Please enter a valid email"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordForm() {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            setServerError(null);
            const response = await forgotPassword(data.email);
            setSuccessMessage(response.message);
        } catch {
            setServerError("Unable to process your request right now.");
        }
    };

    return (
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-900">
            <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Forgot Password
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                    Enter your email and we&apos;ll send you a reset link if an
                    account exists.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white"
                    />
                    {errors.email ? (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.email.message}
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
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>
            </form>

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
