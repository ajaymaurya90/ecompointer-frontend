"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
    const router = useRouter();
    const setAccessToken = useAuthStore((s) => s.setAccessToken);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            const res = await api.post("/auth/login", data);

            setAccessToken(res.data.accessToken);

            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Login failed");
        }
    };

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <input placeholder="Email" {...register("email")} />
                <p>{errors.email?.message}</p>

                <input
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                />
                <p>{errors.password?.message}</p>

                <button type="submit">Login</button>
            </form>
        </div>
    );
}