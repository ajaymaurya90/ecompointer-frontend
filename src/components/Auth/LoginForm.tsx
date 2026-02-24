"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

const schema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
    const router = useRouter();
    const setAccessToken = useAuthStore((s) => s.setAccessToken);
    const setUser = useAuthStore((s) => s.setUser);
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

            const res = await api.post("/auth/login", data);

            setAccessToken(res.data.accessToken);
            setUser(res.data.user);

            router.replace("/dashboard");
        } catch (error) {
            setServerError("Invalid email or password");
        }
    };

    return (
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 
                    rounded-2xl shadow-lg p-8 space-y-6">

            <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Welcome back
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                    Sign in to your dashboard
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        className="w-full rounded-lg border border-gray-300 
                       bg-white px-4 py-2.5 text-sm
                       focus:outline-none focus:ring-2 
                       focus:ring-black dark:focus:ring-white
                       dark:bg-zinc-800 dark:border-zinc-700 
                       dark:text-white"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                        className="w-full rounded-lg border border-gray-300 
                       bg-white px-4 py-2.5 text-sm
                       focus:outline-none focus:ring-2 
                       focus:ring-black dark:focus:ring-white
                       dark:bg-zinc-800 dark:border-zinc-700 
                       dark:text-white"
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {serverError && (
                    <div className="rounded-lg bg-red-50 dark:bg-red-900/30 
                          p-3 text-sm text-red-600 dark:text-red-400">
                        {serverError}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg 
             bg-blue-900 text-white 
             py-2.5 text-sm font-medium
             hover:bg-blue-800
             transition
             disabled:opacity-60
             shadow-sm"
                >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
            </form>
        </div>
    );
}